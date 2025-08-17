import api from './axios';

export interface NotificationType {
  id: number;
  name: string;
  description: string;
  category: 'general' | 'leave' | 'attendance' | 'payroll' | 'performance' | 'birthday' | 'anniversary' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_active: boolean;
  template_subject: string;
  template_body: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  notification_type: number;
  notification_type_name: string;
  recipient: number;
  sender?: number;
  sender_name?: string;
  subject: string;
  message: string;
  status: 'pending' | 'sent' | 'read' | 'failed';
  is_read: boolean;
  read_at?: string;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  alert_type: 'info' | 'warning' | 'error' | 'success';
  is_active: boolean;
  is_global: boolean;
  target_users: number[];
  target_roles: string;
  start_date?: string;
  end_date?: string;
  created_by: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export const notificationAPI = {
  // Notification Types
  getNotificationTypes: () =>
    api.get('/notifications/types/'),

  getNotificationType: (id: number) =>
    api.get(`/notifications/types/${id}/`),

  createNotificationType: (data: Partial<NotificationType>) =>
    api.post('/notifications/types/', data),

  updateNotificationType: (id: number, data: Partial<NotificationType>) =>
    api.patch(`/notifications/types/${id}/`, data),

  deleteNotificationType: (id: number) =>
    api.delete(`/notifications/types/${id}/`),

  // Notifications
  getNotifications: (params?: any) =>
    api.get('/notifications/notifications/', { params }),

  getNotification: (id: number) =>
    api.get(`/notifications/notifications/${id}/`),

  createNotification: (data: Partial<Notification>) =>
    api.post('/notifications/notifications/', data),

  updateNotification: (id: number, data: Partial<Notification>) =>
    api.patch(`/notifications/notifications/${id}/`, data),

  deleteNotification: (id: number) =>
    api.delete(`/notifications/notifications/${id}/`),

  getUnreadNotifications: () =>
    api.get('/notifications/notifications/unread/'),

  markAsRead: (id: number) =>
    api.post(`/notifications/notifications/${id}/mark_as_read/`),

  markAllAsRead: () =>
    api.post('/notifications/notifications/mark_all_as_read/'),

  // Alerts
  getAlerts: (params?: any) =>
    api.get('/notifications/alerts/', { params }),

  getAlert: (id: number) =>
    api.get(`/notifications/alerts/${id}/`),

  createAlert: (data: Partial<Alert>) =>
    api.post('/notifications/alerts/', data),

  updateAlert: (id: number, data: Partial<Alert>) =>
    api.patch(`/notifications/alerts/${id}/`, data),

  deleteAlert: (id: number) =>
    api.delete(`/notifications/alerts/${id}/`),

  getActiveAlerts: () =>
    api.get('/notifications/alerts/active/'),
};
