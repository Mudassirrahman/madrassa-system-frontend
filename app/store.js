import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import teacherReducer from "../features/teacher/teacherSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teacher: teacherReducer,
    // future slices yahan add kar sakte hain
  },
});


