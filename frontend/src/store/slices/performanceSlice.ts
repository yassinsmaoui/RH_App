import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface PerformanceReview {
  id: number;
  employee: number;
  reviewer: number;
  review_period_start: string;
  review_period_end: string;
  overall_score: number;
  comments: string;
  status: 'draft' | 'submitted' | 'approved';
  created_at: string;
  updated_at: string;
}

interface PerformanceCriteria {
  id: number;
  name: string;
  description: string;
  category: string;
  weight: number;
}

interface PerformanceScore {
  id: number;
  review: number;
  criteria: number;
  score: number;
  comments: string;
}

interface PerformanceState {
  reviews: PerformanceReview[];
  criteria: PerformanceCriteria[];
  scores: PerformanceScore[];
  loading: boolean;
  error: string | null;
}

const initialState: PerformanceState = {
  reviews: [],
  criteria: [],
  scores: [],
  loading: false,
  error: null,
};

export const fetchPerformanceReviews = createAsyncThunk(
  'performance/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/performance/reviews/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch performance reviews');
    }
  }
);

export const fetchPerformanceCriteria = createAsyncThunk(
  'performance/fetchCriteria',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('http://localhost:8000/api/performance/criteria/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch performance criteria');
    }
  }
);

export const createPerformanceReview = createAsyncThunk(
  'performance/createReview',
  async (reviewData: Partial<PerformanceReview>, { rejectWithValue }) => {
    try {
      const response = await api.post('http://localhost:8000/api/performance/reviews/', reviewData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create performance review');
    }
  }
);

export const updatePerformanceReview = createAsyncThunk(
  'performance/updateReview',
  async ({ id, data }: { id: number; data: Partial<PerformanceReview> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`http://localhost:8000/api/performance/reviews/${id}/`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update performance review');
    }
  }
);

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformanceReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerformanceReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchPerformanceReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPerformanceCriteria.fulfilled, (state, action) => {
        state.criteria = action.payload;
      })
      .addCase(createPerformanceReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })
      .addCase(updatePerformanceReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex((review) => review.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      });
  },
});

export default performanceSlice.reducer;