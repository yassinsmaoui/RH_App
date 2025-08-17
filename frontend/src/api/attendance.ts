import api from './axios';

export interface Attendance {
  id: number;
  employee: number;
  employee_details: {
    id: number;
    employee_id: string;
    full_name: string;
    department_name: string;
  };
  date: string;
  check_in?: string;
  check_out?: string;
  attendance_type: 'present' | 'absent' | 'half_day' | 'work_from_home';
  work_hours?: number;
  overtime_hours: number;
  notes?: string;
  is_approved: boolean;
  approved_by?: number;
  created_at: string;
  updated_at: string;
}

export interface AttendancePolicy {
  id: number;
  name: string;
  description: string;
  work_start_time: string;
  work_end_time: string;
  grace_period_minutes: number;
  minimum_work_hours: number;
  overtime_threshold_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttendanceReport {
  employee_id: number;
  employee_name: string;
  department: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_arrivals: number;
  early_departures: number;
  total_work_hours: number;
  total_overtime_hours: number;
  attendance_percentage: number;
}

export const attendanceAPI = {
  // Attendance
  getAttendances: (params?: any) =>
    api.get('/attendance/', { params }),

  getAttendance: (id: number) =>
    api.get(`/attendance/${id}/`),

  createAttendance: (data: Partial<Attendance>) =>
    api.post('/attendance/', data),

  updateAttendance: (id: number, data: Partial<Attendance>) =>
    api.patch(`/attendance/${id}/`, data),

  deleteAttendance: (id: number) =>
    api.delete(`/attendance/${id}/`),

  checkIn: () =>
    api.post('/attendance/check_in/'),

  checkOut: () =>
    api.post('/attendance/check_out/'),

  getEmployeeAttendance: (employeeId: number, params?: any) =>
    api.get(`/attendance/employee/${employeeId}/`, { params }),

  getAttendanceReport: (params?: any) =>
    api.get('/attendance/report/', { params }),

  getMyAttendance: (params?: any) =>
    api.get('/attendance/my-attendance/', { params }),

  // Attendance Policies
  getAttendancePolicies: () =>
    api.get('/attendance/policies/'),

  getAttendancePolicy: (id: number) =>
    api.get(`/attendance/policies/${id}/`),

  createAttendancePolicy: (data: Partial<AttendancePolicy>) =>
    api.post('/attendance/policies/', data),

  updateAttendancePolicy: (id: number, data: Partial<AttendancePolicy>) =>
    api.patch(`/attendance/policies/${id}/`, data),

  deleteAttendancePolicy: (id: number) =>
    api.delete(`/attendance/policies/${id}/`),
};
