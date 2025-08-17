import api from './axios';

export interface PerformanceCriteria {
  id: number;
  name: string;
  description: string;
  category: 'technical' | 'soft' | 'leadership' | 'productivity';
  weight: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PerformanceScore {
  id: number;
  review: number;
  criteria: number;
  criteria_name: string;
  score: number;
  weighted_score: number;
  comments?: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceReview {
  id: number;
  employee: number;
  employee_details: {
    id: number;
    employee_id: string;
    full_name: string;
    department_name: string;
  };
  reviewer?: number;
  reviewer_details?: {
    id: number;
    employee_id: string;
    full_name: string;
  };
  review_type: 'quarterly' | 'semi_annual' | 'annual' | 'probation';
  review_period_start: string;
  review_period_end: string;
  status: 'draft' | 'in_review' | 'completed' | 'acknowledged';
  overall_score?: number;
  summary?: string;
  strengths?: string;
  areas_for_improvement?: string;
  goals_set?: string;
  employee_comments?: string;
  reviewer_comments?: string;
  acknowledgment_date?: string;
  scores: PerformanceScore[];
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: number;
  employee: number;
  employee_details: {
    id: number;
    employee_id: string;
    full_name: string;
    department_name: string;
  };
  title: string;
  description: string;
  start_date: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
  review?: number;
  created_at: string;
  updated_at: string;
}

export const performanceAPI = {
  // Performance Criteria
  getCriteria: () =>
    api.get('/performance/criteria/'),

  getCriterion: (id: number) =>
    api.get(`/performance/criteria/${id}/`),

  createCriterion: (data: Partial<PerformanceCriteria>) =>
    api.post('/performance/criteria/', data),

  updateCriterion: (id: number, data: Partial<PerformanceCriteria>) =>
    api.patch(`/performance/criteria/${id}/`, data),

  deleteCriterion: (id: number) =>
    api.delete(`/performance/criteria/${id}/`),

  // Performance Reviews
  getReviews: (params?: any) =>
    api.get('/performance/reviews/', { params }),

  getReview: (id: number) =>
    api.get(`/performance/reviews/${id}/`),

  createReview: (data: Partial<PerformanceReview>) =>
    api.post('/performance/reviews/', data),

  updateReview: (id: number, data: Partial<PerformanceReview>) =>
    api.patch(`/performance/reviews/${id}/`, data),

  deleteReview: (id: number) =>
    api.delete(`/performance/reviews/${id}/`),

  submitReview: (id: number) =>
    api.post(`/performance/reviews/${id}/submit/`),

  // Performance Scores
  getScores: (params?: any) =>
    api.get('/performance/scores/', { params }),

  getScore: (id: number) =>
    api.get(`/performance/scores/${id}/`),

  createScore: (data: Partial<PerformanceScore>) =>
    api.post('/performance/scores/', data),

  updateScore: (id: number, data: Partial<PerformanceScore>) =>
    api.patch(`/performance/scores/${id}/`, data),

  deleteScore: (id: number) =>
    api.delete(`/performance/scores/${id}/`),

  getAverageScores: (employeeId: number) =>
    api.get('/performance/scores/average_scores/', {
      params: { employee: employeeId }
    }),

  // Goals
  getGoals: (params?: any) =>
    api.get('/performance/goals/', { params }),

  getGoal: (id: number) =>
    api.get(`/performance/goals/${id}/`),

  createGoal: (data: Partial<Goal>) =>
    api.post('/performance/goals/', data),

  updateGoal: (id: number, data: Partial<Goal>) =>
    api.patch(`/performance/goals/${id}/`, data),

  deleteGoal: (id: number) =>
    api.delete(`/performance/goals/${id}/`),

  getMyReviews: () =>
    api.get('/performance/my-reviews/'),

  getMyGoals: () =>
    api.get('/performance/my-goals/'),
};
