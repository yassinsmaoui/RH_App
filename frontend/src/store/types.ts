import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import leaveReducer from './slices/leaveSlice';
import attendanceReducer from './slices/attendanceSlice';
import performanceReducer from './slices/performanceSlice';
import payrollReducer from './slices/payrollSlice';

type RootState = {
  auth: ReturnType<typeof authReducer>;
  employees: ReturnType<typeof employeeReducer>;
  leaveRequest: ReturnType<typeof leaveReducer>;
  attendance: ReturnType<typeof attendanceReducer>;
  performance: ReturnType<typeof performanceReducer>;
  payroll: ReturnType<typeof payrollReducer>;
}

type AppDispatch = any; // Will be updated after store is created

export type { RootState, AppDispatch };