import api from './axios';

export interface LeaveType {
  id: number;
  name: string;
  description: string;
  days_allowed: number;
  is_paid: boolean;
  requires_approval: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeaveBalance {
  id: number;
  employee: number;
  employee_details: {
    id: number;
    employee_id: string;
    full_name: string;
    department_name: string;
  };
  leave_type: number;
  leave_type_name: string;
  year: number;
  total_days: number;
  used_days: number;
  remaining_days: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: number;
  employee: number;
  employee_details: {
    id: number;
    employee_id: string;
    full_name: string;
    department_name: string;
  };
  leave_type: number;
  leave_type_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: number;
  rejection_reason?: string;
  documents?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLeaveRequestData {
  leave_type: number;
  start_date: string;
  end_date: string;
  reason: string;
  documents?: File;
}

export interface ApproveLeaveRequestData {
  status: 'approved' | 'rejected';
  rejection_reason?: string;
}

export const leaveAPI = {
  // Leave Types
  getLeaveTypes: () =>
    api.get('/leave/types/'),

  getLeaveType: (id: number) =>
    api.get(`/leave/types/${id}/`),

  createLeaveType: (data: Partial<LeaveType>) =>
    api.post('/leave/types/', data),

  updateLeaveType: (id: number, data: Partial<LeaveType>) =>
    api.patch(`/leave/types/${id}/`, data),

  deleteLeaveType: (id: number) =>
    api.delete(`/leave/types/${id}/`),

  // Leave Balances
  getLeaveBalances: (params?: any) =>
    api.get('/leave/balances/', { params }),

  getLeaveBalance: (id: number) =>
    api.get(`/leave/balances/${id}/`),

  updateLeaveBalance: (id: number, data: Partial<LeaveBalance>) =>
    api.patch(`/leave/balances/${id}/`, data),

  getEmployeeLeaveBalances: (employeeId: number) =>
    api.get(`/leave/employee/${employeeId}/balances/`),

  // Leave Requests
  getLeaveRequests: (params?: any) =>
    api.get('/leave/requests/', { params }),

  getAll: (params?: any) =>
    api.get('/leave/requests/', { params }),

  getLeaveRequest: (id: number) =>
    api.get(`/leave/requests/${id}/`),

  create: (data: CreateLeaveRequestData) => {
    const formData = new FormData();
    formData.append('leave_type', data.leave_type.toString());
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('reason', data.reason);
    if (data.documents) {
      formData.append('documents', data.documents);
    }
    return api.post('/leave/requests/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  createLeaveRequest: (data: CreateLeaveRequestData) => {
    const formData = new FormData();
    formData.append('leave_type', data.leave_type.toString());
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('reason', data.reason);
    if (data.documents) {
      formData.append('documents', data.documents);
    }
    return api.post('/leave/requests/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  update: (id: number, data: Partial<CreateLeaveRequestData>) =>
    api.patch(`/leave/requests/${id}/`, data),

  updateLeaveRequest: (id: number, data: Partial<CreateLeaveRequestData>) =>
    api.patch(`/leave/requests/${id}/`, data),

  delete: (id: number) =>
    api.delete(`/leave/requests/${id}/`),

  deleteLeaveRequest: (id: number) =>
    api.delete(`/leave/requests/${id}/`),

  approveLeaveRequest: (id: number, data: ApproveLeaveRequestData) =>
    api.post(`/leave/requests/${id}/approve/`, data),

  getMyLeaveRequests: () =>
    api.get('/leave/my-requests/'),

  getMyLeaveBalances: () =>
    api.get('/leave/my-balances/'),
};
