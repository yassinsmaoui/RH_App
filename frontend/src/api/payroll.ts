import api from './axios';

export interface PayrollPeriod {
  id: number;
  period_type: 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly' | 'annually';
  start_date: string;
  end_date: string;
  payment_date: string;
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  total_payroll: number;
  processed_records: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Allowance {
  id: number;
  name: string;
  description?: string;
  amount: number;
  is_taxable: boolean;
  is_fixed: boolean;
  percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface Deduction {
  id: number;
  name: string;
  description?: string;
  amount: number;
  is_fixed: boolean;
  percentage?: number;
  is_tax_deductible: boolean;
  created_at: string;
  updated_at: string;
}

export interface PayrollRecord {
  id: number;
  period: number;
  period_details: PayrollPeriod;
  employee: number;
  employee_details: {
    id: number;
    employee_id: string;
    full_name: string;
    department_name: string;
  };
  basic_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  overtime_amount: number;
  allowances: Allowance[];
  total_allowances: number;
  deductions: Deduction[];
  total_deductions: number;
  gross_salary: number;
  net_salary: number;
  tax_amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  payment_date?: string;
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const payrollAPI = {
  // Payroll Periods
  getPeriods: (params?: any) =>
    api.get('/payroll/periods/', { params }),

  getPeriod: (id: number) =>
    api.get(`/payroll/periods/${id}/`),

  createPeriod: (data: Partial<PayrollPeriod>) =>
    api.post('/payroll/periods/', data),

  updatePeriod: (id: number, data: Partial<PayrollPeriod>) =>
    api.patch(`/payroll/periods/${id}/`, data),

  deletePeriod: (id: number) =>
    api.delete(`/payroll/periods/${id}/`),

  processPeriod: (id: number) =>
    api.post(`/payroll/periods/${id}/process/`),

  // Payroll Records
  getRecords: (params?: any) =>
    api.get('/payroll/records/', { params }),

  getRecord: (id: number) =>
    api.get(`/payroll/records/${id}/`),

  createRecord: (data: Partial<PayrollRecord>) =>
    api.post('/payroll/records/', data),

  updateRecord: (id: number, data: Partial<PayrollRecord>) =>
    api.patch(`/payroll/records/${id}/`, data),

  deleteRecord: (id: number) =>
    api.delete(`/payroll/records/${id}/`),

  generatePayslip: (id: number) =>
    api.get(`/payroll/records/${id}/generate_payslip/`),

  // Allowances
  getAllowances: (params?: any) =>
    api.get('/payroll/allowances/', { params }),

  getAllowance: (id: number) =>
    api.get(`/payroll/allowances/${id}/`),

  createAllowance: (data: Partial<Allowance>) =>
    api.post('/payroll/allowances/', data),

  updateAllowance: (id: number, data: Partial<Allowance>) =>
    api.patch(`/payroll/allowances/${id}/`, data),

  deleteAllowance: (id: number) =>
    api.delete(`/payroll/allowances/${id}/`),

  getTotalAllowances: (employeeId: number) =>
    api.get('/payroll/allowances/total_by_employee/', {
      params: { employee: employeeId }
    }),

  // Deductions
  getDeductions: (params?: any) =>
    api.get('/payroll/deductions/', { params }),

  getDeduction: (id: number) =>
    api.get(`/payroll/deductions/${id}/`),

  createDeduction: (data: Partial<Deduction>) =>
    api.post('/payroll/deductions/', data),

  updateDeduction: (id: number, data: Partial<Deduction>) =>
    api.patch(`/payroll/deductions/${id}/`, data),

  deleteDeduction: (id: number) =>
    api.delete(`/payroll/deductions/${id}/`),

  getTotalDeductions: (employeeId: number) =>
    api.get('/payroll/deductions/total_by_employee/', {
      params: { employee: employeeId }
    }),

  getMyPayslips: () =>
    api.get('/payroll/my-payslips/'),
};
