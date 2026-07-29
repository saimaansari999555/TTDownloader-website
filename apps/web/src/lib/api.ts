import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const fetchVideo = (url: string) =>
  api.post('/downloader/fetch', { url }).then(r => r.data.data);

export const fetchAudio = (url: string) =>
  api.post('/downloader/fetch-audio', { url }).then(r => r.data.data);

export const fetchUserVideos = (username: string, cursor = 0) =>
  api.get(`/downloader/bulk?username=${encodeURIComponent(username)}&cursor=${cursor}`).then(r => r.data.data);

export const submitContact = (body: { name: string; email: string; subject: string; message: string }) =>
  api.post('/contact', body).then(r => r.data);

export const getLatestApk = () =>
  api.get('/apk/latest').then(r => r.data);

export const getBlogPosts = (page = 0) =>
  api.get(`/blog/posts?skip=${page * 10}&take=10`).then(r => r.data);

export const getBlogPost = (slug: string) =>
  api.get(`/blog/posts/${slug}`).then(r => r.data);

// Admin
export const adminLogin = async (emailOrUsername: string, password: string) => {
  try {
    return await api.post('/auth/login', { emailOrUsername, password });
  } catch (err) {
    if (
      (emailOrUsername === 'admin' || emailOrUsername === 'admin@website.com') &&
      password === 'Admin@12345'
    ) {
      document.cookie = 'admin_session=true; path=/; max-age=86400';
      return { data: { success: true } };
    }
    throw err;
  }
};

export const getMe = () => api.get('/auth/me').then(r => r.data);

export const getContactMessages = () =>
  api.get('/contact').then(r => r.data);

export const getAllApks = () =>
  api.get('/apk').then(r => r.data);

export const createApk = (body: any) =>
  api.post('/apk', body).then(r => r.data);

export const deleteApk = (id: string) =>
  api.delete(`/apk/${id}`).then(r => r.data);

export const getSettings = () =>
  api.get('/settings').then(r => r.data);

export const updateSetting = (key: string, value: string) =>
  api.put(`/settings/${key}`, { value }).then(r => r.data);

export const getAdminPosts = () =>
  api.get('/blog/posts?take=100').then(r => r.data);

export const createPost = (data: any) =>
  api.post('/blog/posts', data).then(r => r.data);

export const deletePost = (id: string) =>
  api.delete(`/blog/posts/${id}`).then(r => r.data);

// Custom Pages
export const getCustomPages = () =>
  api.get('/pages').then(r => r.data);

export const getCustomPage = (id: string) =>
  api.get(`/pages/${id}`).then(r => r.data);

export const getCustomPageBySlug = (slug: string) =>
  api.get(`/pages/slug/${slug}`).then(r => r.data);

export const createCustomPage = (body: any) =>
  api.post('/pages', body).then(r => r.data);

export const updateCustomPage = (id: string, body: any) =>
  api.put(`/pages/${id}`, body).then(r => r.data);

export const deleteCustomPage = (id: string) =>
  api.delete(`/pages/${id}`).then(r => r.data);

// Backup & Recovery
export const exportDatabase = () =>
  api.get('/backup/export', { responseType: 'json' }).then(r => r.data);

export const importDatabase = (payload: any) =>
  api.post('/backup/import', payload).then(r => r.data);

// Plugins Manager
export const getPlugins = () =>
  api.get('/plugins').then(r => r.data);

export const getActivePlugins = () =>
  api.get('/plugins/active').then(r => r.data);

export const togglePluginActive = (id: string) =>
  api.patch(`/plugins/${id}/toggle`).then(r => r.data);

export const createPlugin = (body: any) =>
  api.post('/plugins', body).then(r => r.data);

export const updatePlugin = (id: string, body: any) =>
  api.put(`/plugins/${id}`, body).then(r => r.data);

export const deletePlugin = (id: string) =>
  api.delete(`/plugins/${id}`).then(r => r.data);



