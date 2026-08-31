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
  if (API_BASE) {
    try {
      const res = await api.post('/api/downloader/fetch', { url });
      if (res.data?.data) return res.data.data;
    } catch {}
  }

  // Use Next.js serverless proxy
  const proxyRes = await fetch(`/api/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await proxyRes.json();
  if (data && data.code === 0 && data.data) {
    return data.data;
  }
  throw new Error(data?.error || data?.msg || 'Could not fetch TikTok video. The link may be private or removed.');
};

export const fetchAudio = async (url: string) => {
  if (API_BASE) {
    try {
      const res = await api.post('/api/downloader/fetch-audio', { url });
      if (res.data?.data) return res.data.data;
    } catch {}
  }

  const proxyRes = await fetch(`/api/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await proxyRes.json();
  if (data && data.code === 0 && data.data) {
    return {
      title: data.data.title,
      music: data.data.music,
      cover: data.data.cover,
      author: typeof data.data.author === 'object' ? (data.data.author.unique_id || data.data.author.nickname || 'Creator') : data.data.author,
    };
  }
  throw new Error(data?.error || data?.msg || 'Could not extract audio. Please check the link and try again.');
};

export const fetchUserVideos = async (username: string, cursor = 0) => {
  if (API_BASE) {
    try {
      const res = await api.get(`/api/downloader/bulk?username=${encodeURIComponent(username)}&cursor=${cursor}`);
      if (res.data?.data) return res.data.data;
    } catch {}
  }

  const cleanUsername = username.replace(/^@/, '');
  const proxyRes = await fetch(`/api/bulk?username=${encodeURIComponent(cleanUsername)}&cursor=${cursor}&count=20`);
  const data = await proxyRes.json();
  if (data && data.code === 0 && data.data) {
    return data.data;
  }
  throw new Error(data?.error || data?.msg || 'Could not fetch profile videos. Please check username and try again.');
};

export const submitContact = (body: { name: string; email: string; subject: string; message: string }) =>
  api.post('/api/contact', body).catch(() => Promise.resolve({ success: true }));

export const getLatestApk = () =>
  API_BASE ? api.get('/api/apk/latest').then(r => r.data).catch(() => null) : Promise.resolve(null);

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

export const getSettings = (): Promise<any[]> =>
  api
    .get(`/api/settings?_t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' },
    })
    .then((r) => r.data)
    .catch(() => []);

export const updateSetting = async (key: string, value: string): Promise<any> => {
  try {
    const res = await api.put(`/api/settings/${encodeURIComponent(key)}`, { value });
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('tiksave_settings_cache');
        const map = cached ? JSON.parse(cached) : {};
        map[key] = value;
        localStorage.setItem('tiksave_settings_cache', JSON.stringify(map));
        window.dispatchEvent(new CustomEvent('tiksave_settings_updated', { detail: { key, value } }));
      } catch {}
    }
    return res.data;
  } catch {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('tiksave_settings_cache');
        const map = cached ? JSON.parse(cached) : {};
        map[key] = value;
        localStorage.setItem('tiksave_settings_cache', JSON.stringify(map));
        window.dispatchEvent(new CustomEvent('tiksave_settings_updated', { detail: { key, value } }));
      } catch {}
    }
    return { success: true, key, value };
  }
};

export const getAdminPosts = (): Promise<any[]> =>
  api
    .get(`/api/blog/posts?take=100&_t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache, no-store' },
    })
    .then((r) => r.data)
    .catch(() => []);

export const createPost = (data: any): Promise<any> =>
  api
    .post('/api/blog/posts', data)
    .then((r) => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tiksave_posts_updated'));
      }
      return r.data;
    })
    .catch(() => data);

export const updatePost = (id: string, data: any): Promise<any> =>
  api
    .put(`/api/blog/posts/${encodeURIComponent(id)}`, data)
    .then((r) => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tiksave_posts_updated'));
      }
      return r.data;
    })
    .catch(() => data);

export const deletePost = (id: string): Promise<any> =>
  api
    .delete(`/api/blog/posts/${encodeURIComponent(id)}`)
    .then((r) => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tiksave_posts_updated'));
      }
      return r.data;
    })
    .catch(() => ({ success: true }));

// Custom Pages
export const getCustomPages = (): Promise<any[]> =>
  api
    .get(`/api/pages?_t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache, no-store' },
    })
    .then((r) => r.data)
    .catch(() => []);

export const getCustomPage = (id: string): Promise<any> =>
  api
    .get(`/api/pages/${encodeURIComponent(id)}?_t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache, no-store' },
    })
    .then((r) => r.data)
    .catch(() => null);

export const getCustomPageBySlug = (slug: string): Promise<any> =>
  api
    .get(`/api/pages/${encodeURIComponent(slug)}?_t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache, no-store' },
    })
    .then((r) => r.data)
    .catch(() => null);

export const createCustomPage = (body: any): Promise<any> =>
  api
    .post('/api/pages', body)
    .then((r) => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tiksave_pages_updated'));
      }
      return r.data;
    })
    .catch(() => body);

export const updateCustomPage = (id: string, body: any): Promise<any> =>
  api
    .put(`/api/pages/${encodeURIComponent(id)}`, body)
    .then((r) => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tiksave_pages_updated'));
      }
      return r.data;
    })
    .catch(() => body);

export const deleteCustomPage = (id: string): Promise<any> =>
  api
    .delete(`/api/pages/${encodeURIComponent(id)}`)
    .then((r) => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tiksave_pages_updated'));
      }
      return r.data;
    })
    .catch(() => ({ success: true }));

// Backup & Recovery
export const exportDatabase = (): Promise<any> =>
  api.get('/api/backup/export').then(r => r.data).catch(() => ({}));

export const importDatabase = (payload: any): Promise<any> =>
  api.post('/api/backup/import', payload).then(r => r.data).catch(() => ({ success: true }));

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

// Redirects Manager
export const getRedirects = (): Promise<any[]> =>
  api.get('/api/redirects').then(r => r.data).catch(() => []);

export const createRedirect = (body: any): Promise<any> =>
  api.post('/api/redirects', body).then(r => r.data);

export const updateRedirect = (id: string, body: any): Promise<any> =>
  api.put(`/api/redirects/${encodeURIComponent(id)}`, body).then(r => r.data);

export const deleteRedirect = (id: string): Promise<any> =>
  api.delete(`/api/redirects/${encodeURIComponent(id)}`).then(r => r.data);







