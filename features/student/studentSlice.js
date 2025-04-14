// features/student/studentSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Thunk: Student ki reports fetch karna
export const fetchStudentReports = createAsyncThunk(
  "student/fetchReports",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.user?.token;
    try {
      const res = await axios.get("madrassa-system-backend.vercel.app/reports/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch student reports");
    }
  }
);

// ✅ Initial State
const initialState = {
  reports: [],
  loading: false,
  error: null,
};

// ✅ Slice
const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    // Yahan future reducers add ho saktay hain
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchStudentReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export
export default studentSlice.reducer;
