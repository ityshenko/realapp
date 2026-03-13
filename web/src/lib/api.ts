import axios from 'axios';
import { useAuthStore } from '@/store';

export const API_URL = process.env.API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data;
        useAuthStore.getState().login(
          useAuthStore.getState().user!,
          token,
          newRefreshToken
        );

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { name: string; phone: string; email?: string; password: string; role?: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { phone: string; password: string }) =>
    api.post('/api/auth/login', data),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put('/api/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/api/auth/change-password', data),
  deleteAccount: () => api.delete('/api/auth/account'),
};

// Listings API
export const listingsApi = {
  getListings: (params?: any) => api.get('/api/listings', { params }),
  getListing: (id: string) => api.get(`/api/listings/${id}`),
  createListing: (data: FormData) =>
    api.post('/api/listings', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateListing: (id: string, data: FormData) =>
    api.put(`/api/listings/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteListing: (id: string) => api.delete(`/api/listings/${id}`),
  toggleFavorite: (id: string) => api.post(`/api/listings/${id}/favorite`),
  getFavorites: (params?: any) => api.get('/api/listings/favorites', { params }),
  getUserListings: (userId?: string, params?: any) =>
    api.get(`/api/listings/${userId ? `user/${userId}` : 'my'}`, { params }),
};

// Messages API
export const messagesApi = {
  getConversations: () => api.get('/api/messages'),
  getOrCreateConversation: (data: { userId: string; listingId?: string }) =>
    api.post('/api/messages/conversation', data),
  getMessages: (conversationId: string, params?: any) =>
    api.get(`/api/messages/${conversationId}/messages`, { params }),
  sendMessage: (data: { conversationId: string; text?: string; imageUrl?: string }) =>
    api.post('/api/messages/send', data),
  markAsRead: (conversationId: string) =>
    api.put(`/api/messages/${conversationId}/read`),
  deleteMessage: (messageId: string) =>
    api.delete(`/api/messages/messages/${messageId}`),
  getUnreadCount: () => api.get('/api/messages/unread/count'),
};

// Promotions API
export const promotionsApi = {
  getAvailable: () => api.get('/api/promotions/available'),
  create: (data: { listingId: string; type: string; durationDays?: number }) =>
    api.post('/api/promotions', data),
  getMyPromotions: () => api.get('/api/promotions/my'),
  activate: (promotionId: string, data: { paymentId: string }) =>
    api.post(`/api/promotions/${promotionId}/activate`, data),
  getStats: () => api.get('/api/promotions/stats'),
};

// Payments API
export const paymentsApi = {
  createPayment: (data: { promotionId: string; method?: string }) =>
    api.post('/api/promotions/payment', data),
  createTopUp: (data: { amount: number; method?: string }) =>
    api.post('/api/promotions/topup', data),
  getTransactions: (params?: any) => api.get('/api/promotions/transactions', { params }),
  getTransaction: (id: string) => api.get(`/api/promotions/transactions/${id}`),
};

// Users API
export const usersApi = {
  getUser: (id: string) => api.get(`/api/users/${id}`),
  getUserReviews: (id: string, params?: any) =>
    api.get(`/api/users/${id}/reviews`, { params }),
  createReview: (data: { revieweeId: string; listingId?: string; rating: number; comment?: string }) =>
    api.post('/api/users/reviews', data),
};

// Notifications API
export const notificationsApi = {
  getNotifications: (params?: any) => api.get('/api/notifications', { params }),
  markAsRead: (id: string) => api.put(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.put('/api/notifications/read-all'),
  deleteNotification: (id: string) => api.delete(`/api/notifications/${id}`),
  getUnreadCount: () => api.get('/api/notifications/unread/count'),
};

// Stats API
export const statsApi = {
  getDashboard: () => api.get('/api/stats/dashboard'),
  getListingStats: (id: string, params?: any) =>
    api.get(`/api/stats/listing/${id}`, { params }),
};

// Admin API
export const adminApi = {
  getAllUsers: (params?: any) => api.get('/api/admin/users', { params }),
  toggleUserBlock: (id: string, data: { isBlocked: boolean }) =>
    api.put(`/api/admin/users/${id}/block`, data),
  getAllListings: (params?: any) => api.get('/api/admin/listings', { params }),
  updateListingStatus: (id: string, data: { status: string }) =>
    api.put(`/api/admin/listings/${id}/status`, data),
  deleteListing: (id: string) => api.delete(`/api/admin/listings/${id}`),
  getPlatformStats: () => api.get('/api/admin/stats'),
  getRecentActivity: () => api.get('/api/admin/activity'),
};

export default api;
