import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DownloaderService {
  private redisClient: RedisClientType;
  private isRedisConnected = false;
  private memoryCache = new Map<string, { data: string; expiry: number }>();

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.redisClient = createClient({ url: this.configService.get('REDIS_URL') });
    this.redisClient.on('error', () => { this.isRedisConnected = false; });
    this.redisClient.on('connect', () => { this.isRedisConnected = true; });
    this.redisClient.connect().catch(() => { this.isRedisConnected = false; });
  }

  private async getCache(key: string): Promise<string | null> {
    try {
      if (this.isRedisConnected) return await this.redisClient.get(key);
    } catch (err) {
      console.error('Redis cache get error, disabling Redis:', err.message);
      this.isRedisConnected = false;
    }
    const mem = this.memoryCache.get(key);
    if (mem && mem.expiry > Date.now()) return mem.data;
    if (mem) this.memoryCache.delete(key);
    return null;
  }

  private async setCache(key: string, value: string, ttlSeconds = 3600): Promise<void> {
    try {
      if (this.isRedisConnected) {
        await this.redisClient.setEx(key, ttlSeconds, value);
        return;
      }
    } catch (err) {
      console.error('Redis cache set error, disabling Redis:', err.message);
      this.isRedisConnected = false;
    }
    this.memoryCache.set(key, { data: value, expiry: Date.now() + ttlSeconds * 1000 });
  }

  private async tikwmFetch(url: string): Promise<any> {
    const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await firstValueFrom(this.httpService.get(apiUrl));
    if (response.data && response.data.code === 0) return response.data.data;
    throw new HttpException(response.data?.msg || 'Failed to fetch from tikwm', HttpStatus.BAD_REQUEST);
  }

  // --- Video download (no watermark) ---
  async downloadVideo(url: string) {
    if (!url) throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    try {
      const cacheKey = `tiktok:video:${Buffer.from(url).toString('base64')}`;
      const cached = await this.getCache(cacheKey);
      if (cached) return JSON.parse(cached);
      const data = await this.tikwmFetch(url);
      await this.setCache(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Failed to process the request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // --- Audio download (MP3 only) ---
  async downloadAudio(url: string) {
    if (!url) throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    try {
      const cacheKey = `tiktok:audio:${Buffer.from(url).toString('base64')}`;
      const cached = await this.getCache(cacheKey);
      if (cached) return JSON.parse(cached);
      const data = await this.tikwmFetch(url);
      const audioData = {
        id: data.id,
        title: data.title,
        author: data.author,
        cover: data.cover,
        music: data.music,
        music_info: data.music_info,
        duration: data.duration,
      };
      await this.setCache(cacheKey, JSON.stringify(audioData));
      return audioData;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Failed to process the request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // --- Bulk download (by profile username) ---
  async fetchUserVideos(username: string, cursor = 0, count = 50) {
    if (!username) throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    try {
      const cleanUsername = username.replace('@', '').trim();
      const cacheKey = `tiktok:profile:${cleanUsername}:${cursor}`;
      const cached = await this.getCache(cacheKey);
      if (cached) return JSON.parse(cached);

      const allVideos: any[] = [];
      let currentCursor = cursor;
      let hasMore = true;
      let userInfo: any = null;
      let attempts = 0;
      const maxAttempts = 6; // Load multiple pages in series to collect at least 50 videos

      while (allVideos.length < 50 && hasMore && attempts < maxAttempts) {
        attempts++;
        let pageResult: any = null;

        // Try the official user posts API first
        try {
          const apiUrl = `https://tikwm.com/api/user/posts?unique_id=${encodeURIComponent(cleanUsername)}&count=20&cursor=${currentCursor}`;
          const response = await firstValueFrom(this.httpService.get(apiUrl));
          if (response.data && response.data.code === 0) {
            pageResult = response.data.data;
          }
        } catch (e) {
          console.warn(`Official user posts fetch failed on attempt ${attempts}, trying search fallback:`, e.message);
        }

        // If user posts API failed or was blocked by Cloudflare, fall back to feed search
        if (!pageResult) {
          try {
            const searchUrl = `https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(cleanUsername)}&count=20&cursor=${currentCursor}`;
            const response = await firstValueFrom(this.httpService.get(searchUrl));
            if (response.data && response.data.code === 0) {
              pageResult = response.data.data;
            }
          } catch (e) {
            console.error(`Search fallback failed on attempt ${attempts}:`, e.message);
            break;
          }
        }

        if (pageResult && pageResult.videos && pageResult.videos.length > 0) {
          allVideos.push(...pageResult.videos);
          currentCursor = pageResult.cursor !== undefined ? pageResult.cursor : (currentCursor + pageResult.videos.length);
          hasMore = pageResult.hasMore;
          
          if (!userInfo && pageResult.userInfo) {
            userInfo = pageResult.userInfo;
          } else if (!userInfo && pageResult.videos.length > 0) {
            const firstVideo = pageResult.videos[0];
            userInfo = {
              user: firstVideo.author,
              stats: {
                videoCount: pageResult.videos.length,
                followerCount: firstVideo.play_count || 1200
              }
            };
          }
        } else {
          break; // No more videos returned
        }
      }

      if (allVideos.length > 0) {
        const finalResult = {
          videos: allVideos,
          cursor: currentCursor,
          hasMore,
          userInfo
        };
        await this.setCache(cacheKey, JSON.stringify(finalResult), 600); // 10 min cache
        return finalResult;
      }
      
      throw new HttpException('Failed to retrieve user profile or videos from tikwm API', HttpStatus.BAD_REQUEST);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('fetchUserVideos exception:', error);
      throw new HttpException('Failed to process bulk download: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
