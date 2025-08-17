import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface LeaveRequest {
  id: number;
  employee: number;
  leave_type: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface LeaveType {
  id: number;
  name: string;
  days_allowed: number;
  description: string;
}

interface LeaveState {
  requests: LeaveRequest[];
  types: LeaveType[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  requests: [],
  types: [],
  loading: false,
  error: null,
};

export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/leave/requests/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch leave requests');
    }
  }
);

export const fetchLeaveTypes = createAsyncThunk('leave/fetchTypes', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/leave/types/');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch leave types');
  }
});

export const createLeaveRequest = createAsyncThunk(
  'leave/createRequest',
  async (requestData: Partial<LeaveRequest>, { rejectWithValue }) => {
    try {
      const response = await api.post('/leave/requests/', requestData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create leave request');
    }
  }
);

export const updateLeaveRequest = createAsyncThunk(
  'leave/updateRequest',
  async ({ id, data }: { id: number; data: Partial<LeaveRequest> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/leave/requests/${id}/`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update leave request');
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
        state.types = action.payload;
      })
      .addCase(createLeaveRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload);
      })
      .addCase(updateLeaveRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex((req) => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      });
  },
});

export default leaveSlice.reducer;