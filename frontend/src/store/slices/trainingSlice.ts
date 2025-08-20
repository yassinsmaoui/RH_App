import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Types
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'online' | 'in-person' | 'hybrid' | 'self-paced';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  instructor: string;
  instructorBio?: string;
  capacity?: number;
  enrolledCount: number;
  status: 'draft' | 'published' | 'archived';
  thumbnail?: string;
  materials: CourseMaterial[];
  modules: CourseModule[];
  prerequisites?: string[];
  objectives: string[];
  price?: number;
  certificateAvailable: boolean;
  rating?: number;
  reviewCount?: number;
  startDate?: string;
  endDate?: string;
  location?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  content: string;
  videoUrl?: string;
  materials: string[];
  quiz?: Quiz;
  completionRequired: boolean;
}

export interface CourseMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'document' | 'link' | 'other';
  url: string;
  size?: number;
  uploadedAt: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  attempts: number;
  timeLimit?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
  progress: number;
  enrolledAt: string;
  startedAt?: string;
  completedAt?: string;
  certificateUrl?: string;
  grade?: number;
  completedModules: string[];
  quizScores: Record<string, number>;
  lastAccessedAt: string;
}

export interface TrainingPath {
  id: string;
  title: string;
  description: string;
  courses: string[]; // Course IDs
  targetRoles: string[];
  estimatedDuration: number;
  createdBy: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  enrollmentId: string;
  courseId: string;
  userId: string;
  courseName: string;
  userName: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber: string;
  verificationUrl: string;
  pdfUrl: string;
}

export interface TrainingState {
  courses: Course[];
  enrollments: Enrollment[];
  trainingPaths: TrainingPath[];
  certificates: Certificate[];
  selectedCourse: Course | null;
  selectedEnrollment: Enrollment | null;
  myEnrollments: Enrollment[];
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    type?: string;
    level?: string;
    status?: string;
    search?: string;
  };
  statistics: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalHours: number;
    averageRating: number;
    certificatesEarned: number;
  };
}

// Initial state
const initialState: TrainingState = {
  courses: [],
  enrollments: [],
  trainingPaths: [],
  certificates: [],
  selectedCourse: null,
  selectedEnrollment: null,
  myEnrollments: [],
  loading: false,
  error: null,
  filters: {},
  statistics: {
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
    averageRating: 0,
    certificatesEarned: 0,
  },
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  'training/fetchCourses',
  async (filters?: any) => {
    const response = await axios.get('/api/training/courses', { params: filters });
    return response.data;
  }
);

export const fetchCourseById = createAsyncThunk(
  'training/fetchCourseById',
  async (id: string) => {
    const response = await axios.get(`/api/training/courses/${id}`);
    return response.data;
  }
);

export const createCourse = createAsyncThunk(
  'training/createCourse',
  async (data: Partial<Course>) => {
    const response = await axios.post('/api/training/courses', data);
    return response.data;
  }
);

export const updateCourse = createAsyncThunk(
  'training/updateCourse',
  async ({ id, data }: { id: string; data: Partial<Course> }) => {
    const response = await axios.put(`/api/training/courses/${id}`, data);
    return response.data;
  }
);

export const enrollInCourse = createAsyncThunk(
  'training/enrollInCourse',
  async (courseId: string) => {
    const response = await axios.post(`/api/training/courses/${courseId}/enroll`);
    return response.data;
  }
);

export const unenrollFromCourse = createAsyncThunk(
  'training/unenrollFromCourse',
  async (enrollmentId: string) => {
    const response = await axios.delete(`/api/training/enrollments/${enrollmentId}`);
    return enrollmentId;
  }
);

export const updateProgress = createAsyncThunk(
  'training/updateProgress',
  async ({ enrollmentId, moduleId, progress }: { 
    enrollmentId: string; 
    moduleId: string; 
    progress: number;
  }) => {
    const response = await axios.patch(
      `/api/training/enrollments/${enrollmentId}/progress`,
      { moduleId, progress }
    );
    return response.data;
  }
);

export const submitQuiz = createAsyncThunk(
  'training/submitQuiz',
  async ({ enrollmentId, quizId, answers }: {
    enrollmentId: string;
    quizId: string;
    answers: Record<string, any>;
  }) => {
    const response = await axios.post(
      `/api/training/enrollments/${enrollmentId}/quiz/${quizId}`,
      { answers }
    );
    return response.data;
  }
);

export const fetchMyEnrollments = createAsyncThunk(
  'training/fetchMyEnrollments',
  async () => {
    const response = await axios.get('/api/training/my-enrollments');
    return response.data;
  }
);

export const fetchTrainingPaths = createAsyncThunk(
  'training/fetchTrainingPaths',
  async () => {
    const response = await axios.get('/api/training/paths');
    return response.data;
  }
);

export const fetchCertificates = createAsyncThunk(
  'training/fetchCertificates',
  async (userId?: string) => {
    const response = await axios.get('/api/training/certificates', {
      params: { userId }
    });
    return response.data;
  }
);

export const generateCertificate = createAsyncThunk(
  'training/generateCertificate',
  async (enrollmentId: string) => {
    const response = await axios.post(
      `/api/training/enrollments/${enrollmentId}/certificate`
    );
    return response.data;
  }
);

export const fetchTrainingStatistics = createAsyncThunk(
  'training/fetchStatistics',
  async () => {
    const response = await axios.get('/api/training/statistics');
    return response.data;
  }
);

// Slice
const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TrainingState['filters']>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedCourse: (state, action: PayloadAction<Course | null>) => {
      state.selectedCourse = action.payload;
    },
    setSelectedEnrollment: (state, action: PayloadAction<Enrollment | null>) => {
      state.selectedEnrollment = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      });

    // Fetch course by ID
    builder
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.selectedCourse = action.payload;
      });

    // Create course
    builder
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload);
      });

    // Update course
    builder
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.selectedCourse?.id === action.payload.id) {
          state.selectedCourse = action.payload;
        }
      });

    // Enroll in course
    builder
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.myEnrollments.push(action.payload);
        const course = state.courses.find((c) => c.id === action.payload.courseId);
        if (course) {
          course.enrolledCount += 1;
        }
      });

    // Unenroll from course
    builder
      .addCase(unenrollFromCourse.fulfilled, (state, action) => {
        state.myEnrollments = state.myEnrollments.filter(
          (e) => e.id !== action.payload
        );
      });

    // Update progress
    builder
      .addCase(updateProgress.fulfilled, (state, action) => {
        const enrollment = state.myEnrollments.find((e) => e.id === action.payload.id);
        if (enrollment) {
          enrollment.progress = action.payload.progress;
          enrollment.completedModules = action.payload.completedModules;
        }
      });

    // Submit quiz
    builder
      .addCase(submitQuiz.fulfilled, (state, action) => {
        const enrollment = state.myEnrollments.find(
          (e) => e.id === action.payload.enrollmentId
        );
        if (enrollment) {
          enrollment.quizScores = action.payload.quizScores;
        }
      });

    // Fetch my enrollments
    builder
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.myEnrollments = action.payload.enrollments;
      });

    // Fetch training paths
    builder
      .addCase(fetchTrainingPaths.fulfilled, (state, action) => {
        state.trainingPaths = action.payload.paths;
      });

    // Fetch certificates
    builder
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.certificates = action.payload.certificates;
      });

    // Generate certificate
    builder
      .addCase(generateCertificate.fulfilled, (state, action) => {
        state.certificates.push(action.payload);
      });

    // Fetch statistics
    builder
      .addCase(fetchTrainingStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSelectedCourse,
  setSelectedEnrollment,
  clearError,
} = trainingSlice.actions;

export default trainingSlice.reducer;
