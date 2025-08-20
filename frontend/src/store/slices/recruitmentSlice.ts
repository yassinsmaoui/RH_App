import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Types
export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: string;
  department: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  resumeUrl?: string;
  coverLetterUrl?: string;
  linkedinProfile?: string;
  portfolio?: string;
  experience: number;
  education: string;
  skills: string[];
  expectedSalary?: number;
  availableFrom?: string;
  source: string;
  notes?: string;
  rating?: number;
  appliedAt: string;
  interviews: Interview[];
  evaluations: Evaluation[];
}

export interface Interview {
  id: string;
  candidateId: string;
  type: 'phone' | 'technical' | 'hr' | 'final';
  scheduledAt: string;
  duration: number;
  interviewers: string[];
  location?: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  feedback?: string;
  rating?: number;
  result?: 'pass' | 'fail' | 'pending';
  notes?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salaryMin?: number;
  salaryMax?: number;
  status: 'draft' | 'active' | 'closed' | 'on-hold';
  postedAt?: string;
  closedAt?: string;
  applicationCount: number;
  viewCount: number;
  createdBy: string;
}

export interface Evaluation {
  id: string;
  candidateId: string;
  evaluatorId: string;
  evaluatorName: string;
  stage: string;
  rating: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'strongly-recommend' | 'recommend' | 'neutral' | 'not-recommend';
  comments: string;
  createdAt: string;
}

export interface RecruitmentState {
  candidates: Candidate[];
  jobPostings: JobPosting[];
  interviews: Interview[];
  selectedCandidate: Candidate | null;
  selectedJobPosting: JobPosting | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    position?: string;
    department?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  statistics: {
    totalApplications: number;
    newApplications: number;
    inProgress: number;
    hired: number;
    rejected: number;
    averageTimeToHire: number;
    conversionRate: number;
  };
}

// Initial state
const initialState: RecruitmentState = {
  candidates: [],
  jobPostings: [],
  interviews: [],
  selectedCandidate: null,
  selectedJobPosting: null,
  loading: false,
  error: null,
  filters: {},
  statistics: {
    totalApplications: 0,
    newApplications: 0,
    inProgress: 0,
    hired: 0,
    rejected: 0,
    averageTimeToHire: 0,
    conversionRate: 0,
  },
};

// Async thunks
export const fetchCandidates = createAsyncThunk(
  'recruitment/fetchCandidates',
  async (filters?: any) => {
    const response = await axios.get('/api/recruitment/candidates', { params: filters });
    return response.data;
  }
);

export const fetchCandidateById = createAsyncThunk(
  'recruitment/fetchCandidateById',
  async (id: string) => {
    const response = await axios.get(`/api/recruitment/candidates/${id}`);
    return response.data;
  }
);

export const createCandidate = createAsyncThunk(
  'recruitment/createCandidate',
  async (data: Partial<Candidate>) => {
    const response = await axios.post('/api/recruitment/candidates', data);
    return response.data;
  }
);

export const updateCandidate = createAsyncThunk(
  'recruitment/updateCandidate',
  async ({ id, data }: { id: string; data: Partial<Candidate> }) => {
    const response = await axios.put(`/api/recruitment/candidates/${id}`, data);
    return response.data;
  }
);

export const updateCandidateStatus = createAsyncThunk(
  'recruitment/updateCandidateStatus',
  async ({ id, status }: { id: string; status: Candidate['status'] }) => {
    const response = await axios.patch(`/api/recruitment/candidates/${id}/status`, { status });
    return response.data;
  }
);

export const fetchJobPostings = createAsyncThunk(
  'recruitment/fetchJobPostings',
  async (filters?: any) => {
    const response = await axios.get('/api/recruitment/job-postings', { params: filters });
    return response.data;
  }
);

export const createJobPosting = createAsyncThunk(
  'recruitment/createJobPosting',
  async (data: Partial<JobPosting>) => {
    const response = await axios.post('/api/recruitment/job-postings', data);
    return response.data;
  }
);

export const updateJobPosting = createAsyncThunk(
  'recruitment/updateJobPosting',
  async ({ id, data }: { id: string; data: Partial<JobPosting> }) => {
    const response = await axios.put(`/api/recruitment/job-postings/${id}`, data);
    return response.data;
  }
);

export const scheduleInterview = createAsyncThunk(
  'recruitment/scheduleInterview',
  async (data: Partial<Interview>) => {
    const response = await axios.post('/api/recruitment/interviews', data);
    return response.data;
  }
);

export const updateInterview = createAsyncThunk(
  'recruitment/updateInterview',
  async ({ id, data }: { id: string; data: Partial<Interview> }) => {
    const response = await axios.put(`/api/recruitment/interviews/${id}`, data);
    return response.data;
  }
);

export const addEvaluation = createAsyncThunk(
  'recruitment/addEvaluation',
  async (data: Partial<Evaluation>) => {
    const response = await axios.post('/api/recruitment/evaluations', data);
    return response.data;
  }
);

export const fetchRecruitmentStatistics = createAsyncThunk(
  'recruitment/fetchStatistics',
  async () => {
    const response = await axios.get('/api/recruitment/statistics');
    return response.data;
  }
);

// Slice
const recruitmentSlice = createSlice({
  name: 'recruitment',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<RecruitmentState['filters']>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedCandidate: (state, action: PayloadAction<Candidate | null>) => {
      state.selectedCandidate = action.payload;
    },
    setSelectedJobPosting: (state, action: PayloadAction<JobPosting | null>) => {
      state.selectedJobPosting = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch candidates
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload.candidates;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch candidates';
      });

    // Fetch candidate by ID
    builder
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.selectedCandidate = action.payload;
      });

    // Create candidate
    builder
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.candidates.unshift(action.payload);
      });

    // Update candidate
    builder
      .addCase(updateCandidate.fulfilled, (state, action) => {
        const index = state.candidates.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.candidates[index] = action.payload;
        }
        if (state.selectedCandidate?.id === action.payload.id) {
          state.selectedCandidate = action.payload;
        }
      });

    // Update candidate status
    builder
      .addCase(updateCandidateStatus.fulfilled, (state, action) => {
        const candidate = state.candidates.find((c) => c.id === action.payload.id);
        if (candidate) {
          candidate.status = action.payload.status;
        }
        if (state.selectedCandidate?.id === action.payload.id) {
          state.selectedCandidate.status = action.payload.status;
        }
      });

    // Fetch job postings
    builder
      .addCase(fetchJobPostings.fulfilled, (state, action) => {
        state.jobPostings = action.payload.jobPostings;
      });

    // Create job posting
    builder
      .addCase(createJobPosting.fulfilled, (state, action) => {
        state.jobPostings.unshift(action.payload);
      });

    // Update job posting
    builder
      .addCase(updateJobPosting.fulfilled, (state, action) => {
        const index = state.jobPostings.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) {
          state.jobPostings[index] = action.payload;
        }
      });

    // Schedule interview
    builder
      .addCase(scheduleInterview.fulfilled, (state, action) => {
        state.interviews.push(action.payload);
        const candidate = state.candidates.find((c) => c.id === action.payload.candidateId);
        if (candidate) {
          candidate.interviews.push(action.payload);
        }
      });

    // Update interview
    builder
      .addCase(updateInterview.fulfilled, (state, action) => {
        const index = state.interviews.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.interviews[index] = action.payload;
        }
      });

    // Add evaluation
    builder
      .addCase(addEvaluation.fulfilled, (state, action) => {
        const candidate = state.candidates.find((c) => c.id === action.payload.candidateId);
        if (candidate) {
          candidate.evaluations.push(action.payload);
        }
      });

    // Fetch statistics
    builder
      .addCase(fetchRecruitmentStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSelectedCandidate,
  setSelectedJobPosting,
  clearError,
} = recruitmentSlice.actions;

export default recruitmentSlice.reducer;
