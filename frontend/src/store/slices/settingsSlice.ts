import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Types
export interface AppSettings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  company: CompanySettings;
  leave: LeaveSettings;
  attendance: AttendanceSettings;
  payroll: PayrollSettings;
  performance: PerformanceSettings;
}

export interface GeneralSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  fiscalYearStart: string;
  weekStartDay: number;
  theme: 'light' | 'dark' | 'auto';
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notificationCategories: {
    leave: boolean;
    attendance: boolean;
    payroll: boolean;
    performance: boolean;
    announcements: boolean;
    reminders: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  ipWhitelist: string[];
  allowedDomains: string[];
}

export interface CompanySettings {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  registrationNumber: string;
  industry: string;
  size: string;
  founded: string;
}

export interface LeaveSettings {
  leaveTypes: LeaveType[];
  approvalLevels: number;
  carryOverPolicy: 'none' | 'limited' | 'unlimited';
  maxCarryOverDays: number;
  halfDayAllowed: boolean;
  weekendsExcluded: boolean;
  holidaysExcluded: boolean;
  minNoticePeriod: number;
  maxConsecutiveDays: number;
}

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  allowance: number;
  unit: 'days' | 'hours';
  color: string;
  requiresApproval: boolean;
  requiresDocument: boolean;
  paid: boolean;
  enabled: boolean;
}

export interface AttendanceSettings {
  workingHours: {
    start: string;
    end: string;
    breakDuration: number;
  };
  workingDays: number[];
  gracePeriod: number;
  overtimeEnabled: boolean;
  overtimeRate: number;
  geofencing: {
    enabled: boolean;
    locations: GeofenceLocation[];
  };
  biometricEnabled: boolean;
}

export interface GeofenceLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface PayrollSettings {
  paymentCycle: 'weekly' | 'bi-weekly' | 'monthly';
  paymentMethod: 'bank-transfer' | 'cash' | 'check';
  taxCalculation: 'automatic' | 'manual';
  allowances: PayrollComponent[];
  deductions: PayrollComponent[];
  taxBrackets: TaxBracket[];
}

export interface PayrollComponent {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
  taxable: boolean;
  mandatory: boolean;
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface PerformanceSettings {
  reviewCycle: 'quarterly' | 'semi-annual' | 'annual';
  ratingScale: number;
  selfReviewEnabled: boolean;
  peerReviewEnabled: boolean;
  goalSetting: {
    enabled: boolean;
    minGoals: number;
    maxGoals: number;
  };
  competencies: Competency[];
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface SettingsState {
  settings: AppSettings | null;
  userPreferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

export interface UserPreferences {
  dashboardLayout: string;
  defaultView: string;
  emailDigest: 'daily' | 'weekly' | 'monthly' | 'never';
  shortcuts: string[];
  favoriteReports: string[];
}

// Initial state
const initialState: SettingsState = {
  settings: null,
  userPreferences: null,
  loading: false,
  error: null,
  hasUnsavedChanges: false,
};

// Async thunks
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async () => {
    const response = await axios.get('/api/settings');
    return response.data;
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings: Partial<AppSettings>) => {
    const response = await axios.put('/api/settings', settings);
    return response.data;
  }
);

export const fetchUserPreferences = createAsyncThunk(
  'settings/fetchUserPreferences',
  async () => {
    const response = await axios.get('/api/settings/preferences');
    return response.data;
  }
);

export const updateUserPreferences = createAsyncThunk(
  'settings/updateUserPreferences',
  async (preferences: Partial<UserPreferences>) => {
    const response = await axios.put('/api/settings/preferences', preferences);
    return response.data;
  }
);

export const resetSettings = createAsyncThunk(
  'settings/resetSettings',
  async (category?: keyof AppSettings) => {
    const response = await axios.post('/api/settings/reset', { category });
    return response.data;
  }
);

// Slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateLocalSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      if (state.settings) {
        state.settings = { ...state.settings, ...action.payload };
        state.hasUnsavedChanges = true;
      }
    },
    updateLocalPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.userPreferences) {
        state.userPreferences = { ...state.userPreferences, ...action.payload };
        state.hasUnsavedChanges = true;
      }
    },
    discardChanges: (state) => {
      state.hasUnsavedChanges = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch settings
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch settings';
      });

    // Update settings
    builder
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.hasUnsavedChanges = false;
      });

    // Fetch user preferences
    builder
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.userPreferences = action.payload;
      });

    // Update user preferences
    builder
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.userPreferences = action.payload;
        state.hasUnsavedChanges = false;
      });

    // Reset settings
    builder
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.hasUnsavedChanges = false;
      });
  },
});

export const {
  updateLocalSettings,
  updateLocalPreferences,
  discardChanges,
  clearError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
