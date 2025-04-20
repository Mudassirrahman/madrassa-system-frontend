import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Reports Thunk
export const fetchStudentReports = createAsyncThunk(
  "student/fetchReports",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.user?.token;
    try {
      const res = await axios.get(
        "https://madrassa-system-backend.vercel.app/reports/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch reports");
    }
  }
);

// ✅ Comments Thunks
export const fetchComments = createAsyncThunk(
  "student/fetchComments",
  async (reportId, { getState, rejectWithValue }) => {
    const token = getState().auth.user?.token;
    try {
      const res = await axios.get(
        `https://madrassa-system-backend.vercel.app/comments/${reportId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { reportId, comments: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch comments");
    }
  }
);

export const submitComment = createAsyncThunk(
  "student/submitComment",
  async ({ reportId, text }, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.user?.token;
    try {
      await axios.post(
        `https://madrassa-system-backend.vercel.app/comments/${reportId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(fetchComments(reportId)); // auto-refresh comments
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to submit comment");
    }
  }
);

// ✅ Initial State
const initialState = {
  reports: [],
  comments: {}, // reportId -> comments[]
  loading: false,
  error: null,
};

// ✅ Slice
const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {},
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
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        const { reportId, comments } = action.payload;
        state.comments[reportId] = comments;
      });
  },
});

export default studentSlice.reducer;
