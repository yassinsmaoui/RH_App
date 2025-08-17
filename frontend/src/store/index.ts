import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import leaveRequestReducer from './slices/leaveSlice';
import attendanceReducer from './slices/attendanceSlice';
import performanceReducer from './slices/performanceSlice';
import payrollReducer from './slices/payrollSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    leaveRequest: leaveRequestReducer,
    attendance: attendanceReducer,
    performance: performanceReducer,
    payroll: payrollReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
export default store;