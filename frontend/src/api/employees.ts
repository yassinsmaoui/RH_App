import api from './axios';

export interface Employee {
  id: number;
  employee_id: string;
  user: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  user_email: string;
  phone?: string;
  position: string;
  designation: string;
  department: string;
  department_name: string;
  hire_date: string;
  joining_date: string;
  employment_status: 'active' | 'on_leave' | 'terminated' | 'resigned';
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  work_email: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  salary: string;
  base_salary: string;
  bank_account_number: string;
  bank_name: string;
  address: string;
  birth_date?: string;
  gender: 'male' | 'female' | 'other';
  marital_status: 'single' | 'married' | 'divorced' | 'widowed';
  is_manager: boolean;
  resume?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  manager?: number;
  manager_name?: string;
  employee_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeData {
  user?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position: string;
  designation: string;
  department: string;
  hire_date: string;
  joining_date: string;
  employment_status?: string;
  employment_type?: string;
  work_email: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  salary: string;
  base_salary: string;
  bank_account_number: string;
  bank_name: string;
  address: string;
  birth_date?: string;
  gender?: string;
  marital_status?: string;
  is_manager?: boolean;
}

export const employeeAPI = {
  getEmployees: (params?: any) =>
    api.get('/employees/', { params }),

  getAll: (params?: any) =>
    api.get('/employees/', { params }),

  getEmployee: (id: number) =>
    api.get(`/employees/${id}/`),

  create: (data: CreateEmployeeData) =>
    api.post('/employees/', data),

  createEmployee: (data: CreateEmployeeData) =>
    api.post('/employees/', data),

  update: (id: number, data: Partial<CreateEmployeeData>) =>
    api.patch(`/employees/${id}/`, data),

  updateEmployee: (id: number, data: Partial<CreateEmployeeData>) =>
    api.patch(`/employees/${id}/`, data),

  delete: (id: number) =>
    api.delete(`/employees/${id}/`),

  deleteEmployee: (id: number) =>
    api.delete(`/employees/${id}/`),

  uploadDocument: (id: number, file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_type', documentType);
    return api.post(`/employees/${id}/upload_document/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getDepartments: (params?: any) =>
    api.get('/departments/', { params }),

  getDepartment: (id: number) =>
    api.get(`/departments/${id}/`),

  createDepartment: (data: Partial<Department>) =>
    api.post('/departments/', data),

  updateDepartment: (id: number, data: Partial<Department>) =>
    api.patch(`/departments/${id}/`, data),

  deleteDepartment: (id: number) =>
    api.delete(`/departments/${id}/`),

  getDepartmentEmployees: (departmentId: number) =>
    api.get(`/departments/${departmentId}/employees/`),
};
