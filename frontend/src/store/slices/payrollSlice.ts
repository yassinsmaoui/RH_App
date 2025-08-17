import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface PayrollRecord {
  id: number;
  employee: number;
  payroll_period: number;
  basic_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  allowances: number[];
  deductions: number[];
  tax: number;
  net_salary: number;
  status: 'draft' | 'approved' | 'paid';
  created_at: string;
  updated_at: string;
}

interface PayrollPeriod {
  id: number;
  start_date: string;
  end_date: string;
  period_type: 'monthly' | 'bi_weekly' | 'weekly';
  status: 'open' | 'closed';
}

interface Allowance {
  id: number;
  name: string;
  description: string;
  amount: number;
  is_taxable: boolean;
  is_fixed: boolean;
}

interface Deduction {
  id: number;
  name: string;
  description: string;
  amount: number;
  is_mandatory: boolean;
  is_fixed: boolean;
}

interface PayrollState {
  records: PayrollRecord[];
  periods: PayrollPeriod[];
  allowances: Allowance[];
  deductions: Deduction[];
  loading: boolean;
  error: string | null;
}

const initialState: PayrollState = {
  records: [],
  periods: [],
  allowances: [],
  deductions: [],
  loading: false,
  error: null,
};

export const fetchPayrollRecords = createAsyncThunk(
  'payroll/fetchRecords',
  async (periodId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payroll/records/?payroll_period=${periodId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch payroll records');
    }
  }
);

export const fetchPayrollPeriods = createAsyncThunk(
  'payroll/fetchPeriods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/payroll/periods/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch payroll periods');
    }
  }
);

export const fetchAllowances = createAsyncThunk('payroll/fetchAllowances', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/payroll/allowances/');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch allowances');
  }
});

export const fetchDeductions = createAsyncThunk('payroll/fetchDeductions', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/payroll/deductions/');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch deductions');
  }
});

export const createPayrollRecord = createAsyncThunk(
  'payroll/createRecord',
  async (recordData: Partial<PayrollRecord>, { rejectWithValue }) => {
    try {
      const response = await api.post('/payroll/records/', recordData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create payroll record');
    }
  }
);

export const updatePayrollRecord = createAsyncThunk(
  'payroll/updateRecord',
  async ({ id, data }: { id: number; data: Partial<PayrollRecord> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/payroll/records/${id}/`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update payroll record');
    }
  }
);

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayrollRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrollRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchPayrollRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPayrollPeriods.fulfilled, (state, action) => {
        state.periods = action.payload;
      })
      .addCase(fetchAllowances.fulfilled, (state, action) => {
        state.allowances = action.payload;
      })
      .addCase(fetchDeductions.fulfilled, (state, action) => {
        state.deductions = action.payload;
      })
      .addCase(createPayrollRecord.fulfilled, (state, action) => {
        state.records.push(action.payload);
      })
      .addCase(updatePayrollRecord.fulfilled, (state, action) => {
        const index = state.records.findIndex((record) => record.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      });
  },
});

export default payrollSlice.reducer;