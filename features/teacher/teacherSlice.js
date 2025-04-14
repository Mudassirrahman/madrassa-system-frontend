import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🟢 Fetch Students
export const fetchStudents = createAsyncThunk("teacher/fetchStudents", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.user?.token;
  try {
    const res = await axios.get("http://localhost:8080/auth/students", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.students;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Failed to fetch students");
  }
});

// 🟢 Fetch Reports
export const fetchReports = createAsyncThunk("teacher/fetchReports", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.user?.token;
  try {
    const res = await axios.get("http://localhost:8080/reports/teacher", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.reports;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Failed to fetch reports");
  }
});

// 🟢 Create Report
export const createReport = createAsyncThunk("teacher/createReport", async (formData, { getState, rejectWithValue }) => {
  const token = getState().auth.user?.token;
  try {
    const res = await axios.post("http://localhost:8080/reports/teacher", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.report;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Failed to create report");
  }
});

// Slice
const teacherSlice = createSlice({
  name: "teacher",
  initialState: {
    students: [],
    reports: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload);
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teacherSlice.reducer;
