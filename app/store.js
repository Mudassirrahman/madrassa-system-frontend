import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import teacherReducer from "../features/teacher/teacherSlice";
import studentReducer from "../features/student/studentSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teacher: teacherReducer,
    student: studentReducer,
    // future slices yahan add kar sakte hain
  },
});


