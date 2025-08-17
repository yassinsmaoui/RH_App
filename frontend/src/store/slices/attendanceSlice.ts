import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface Attendance {
  id: number;
  employee: number;
  date: string;
  check_in: string;
  check_out: string;
  attendance_type: 'present' | 'absent' | 'late' | 'half_day';
  work_hours: number;
  notes?: string;
}

interface AttendanceState {
  records: Attendance[];
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  records: [],
  loading: false,
  error: null,
};

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/attendance/?start_date=${startDate}&end_date=${endDate}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch attendance records');
    }
  }
);

export const createAttendance = createAsyncThunk(
  'attendance/create',
  async (attendanceData: Partial<Attendance>, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/', attendanceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create attendance record');
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/update',
  async ({ id, data }: { id: number; data: Partial<Attendance> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/attendance/${id}/`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update attendance record');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.records.push(action.payload);
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        const index = state.records.findIndex((record) => record.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      });
  },
});

export default attendanceSlice.reducer;