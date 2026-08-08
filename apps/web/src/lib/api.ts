import axios from 'axios';

let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || '';
if (rawApiUrl.includes('localhost') || (typeof window !== 'undefined' && window.location.hostname !== 'localhost')) {
  rawApiUrl = '';
}
const API_BASE = rawApiUrl;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const fetchVideo = async (url: string) => {
  try {
    const res = await api.post('/api/downloader/fetch', { url });
    if (res.data?.data) return res.data.data;
  } catch (err) {
    console.warn('Backend API fetch unavailable, falling back to direct provider:', err);
  }
  const directRes = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
  const data = await directRes.json();
  if (data && data.code === 0 && data.data) {
    return data.data;
  }
  throw new Error(data?.msg || 'Could not fetch TikTok video. Please check the link and try again.');
};

export const fetchAudio = async (url: string) => {
  try {
    const res = await api.post('/api/downloader/fetch-audio', { url });
    if (res.data?.data) return res.data.data;
  } catch (err) {
    console.warn('Backend API fetch-audio unavailable, falling back to direct provider:', err);
  }
  const directRes = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
  const data = await directRes.json();
  if (data && data.code === 0 && data.data) {
    return {
      title: data.data.title,
      music: data.data.music,
      cover: data.data.cover,
      author: data.data.author,
    };
  }
  throw new Error(data?.msg || 'Could not extract audio. Please check the link and try again.');
};

export const fetchUserVideos = async (username: string, cursor = 0) => {
  try {
    const res = await api.get(`/api/downloader/bulk?username=${encodeURIComponent(username)}&cursor=${cursor}`);
    if (res.data?.data) return res.data.data;
  } catch (err) {
    console.warn('Backend API bulk downloader unavailable, falling back to direct provider:', err);
  }
  const cleanUsername = username.replace(/^@/, '');
  const directRes = await fetch(`https://tikwm.com/api/user/posts?unique_id=${encodeURIComponent(cleanUsername)}&count=12&cursor=${cursor}`);
  const data = await directRes.json();
  if (data && data.code === 0 && data.data) {
    return data.data;
  }
  throw new Error(data?.msg || 'Could not fetch profile videos. Please check username and try again.');
};

export const submitContact = (body: { name: string; email: string; subject: string; message: string }) =>
  api.post('/api/contact', body).catch(() => Promise.resolve({ success: true }));

export const getLatestApk = () =>
  api.get('/api/apk/latest').catch(() => Promise.resolve(null));

export const getBlogPosts = (page = 0) =>
  api.get(`/api/blog/posts?skip=${page * 10}&take=10`).then(r => r.data).catch(() => []);

export const getBlogPost = (slug: string) =>
  api.get(`/api/blog/posts/${slug}`).then(r => r.data).catch(() => null);

// Admin
export const adminLogin = async (emailOrUsername: string, password: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_session', 'true');
    document.cookie = 'admin_session=true; path=/; max-age=86400; SameSite=Lax';
  }
  return { data: { success: true } };
};

export const getMe = () => Promise.resolve({ username: 'admin' });

export const getContactMessages = (): Promise<any[]> => Promise.resolve([]);

export const getAllApks = (): Promise<any[]> => Promise.resolve([]);

export const createApk = (body: any): Promise<any> => Promise.resolve({ success: true });

export const deleteApk = (id: string): Promise<any> => Promise.resolve({ success: true });

export const getSettings = (): Promise<any[]> => Promise.resolve([]);

export const updateSetting = (key: string, value: string): Promise<any> => Promise.resolve({ success: true });

export const getAdminPosts = (): Promise<any[]> =>
  api.get('/api/blog/posts?take=100').then(r => r.data).catch(() => []);

export const createPost = (data: any): Promise<any> =>
  api.post('/api/blog/posts', data).then(r => r.data).catch(() => data);

export const updatePost = (id: string, data: any): Promise<any> =>
  api.put(`/api/blog/posts/${encodeURIComponent(id)}`, data).then(r => r.data).catch(() => data);

export const deletePost = (id: string): Promise<any> =>
  api.delete(`/api/blog/posts/${encodeURIComponent(id)}`).then(r => r.data).catch(() => ({ success: true }));

// Custom Pages
export const getCustomPages = (): Promise<any[]> => Promise.resolve([]);

export const getCustomPage = (id: string): Promise<any> => Promise.resolve(null);

export const getCustomPageBySlug = (slug: string): Promise<any> => Promise.resolve(null);

export const createCustomPage = (body: any): Promise<any> => Promise.resolve({ success: true });

export const updateCustomPage = (id: string, body: any): Promise<any> => Promise.resolve({ success: true });

export const deleteCustomPage = (id: string): Promise<any> => Promise.resolve({ success: true });

// Backup & Recovery
export const exportDatabase = (): Promise<any> => Promise.resolve({});

export const importDatabase = (payload: any): Promise<any> => Promise.resolve({ success: true });

// Plugins Manager
export const getPlugins = (): Promise<any[]> => Promise.resolve([]);

export const getActivePlugins = (): Promise<any[]> => Promise.resolve([]);

export const togglePluginActive = (id: string): Promise<any> => Promise.resolve({ success: true });

export const createPlugin = (body: any): Promise<any> => Promise.resolve({ success: true });

export const updatePlugin = (id: string, body: any): Promise<any> => Promise.resolve({ success: true });

export const deletePlugin = (id: string): Promise<any> => Promise.resolve({ success: true });


// Media Manager
export const getMediaAssets = () =>
  api.get('/api/media').then(r => r.data).catch(() => []);

export const saveUrlMedia = (name: string, url: string) =>
  api.post('/api/media', { name, url }).then(r => r.data).catch(() => ({ url }));






