import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import leaveRequestReducer from './slices/leaveSlice';
import attendanceReducer from './slices/attendanceSlice';
import performanceReducer from './slices/performanceSlice';
import payrollReducer from './slices/payrollSlice';

export interface RootState {
  auth: ReturnType<typeof authReducer>;
  employees: ReturnType<typeof employeeReducer>;
  attendance: ReturnType<typeof attendanceReducer>;
  leaveRequest: ReturnType<typeof leaveRequestReducer>;
  performance: ReturnType<typeof performanceReducer>;
  payroll: ReturnType<typeof payrollReducer>;
}

export type AppDispatch = any;