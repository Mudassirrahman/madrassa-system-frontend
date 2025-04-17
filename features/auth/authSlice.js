import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

let storedUser = null;
const userFromStorage = localStorage.getItem("user");
if (userFromStorage) {
  try {
    storedUser = JSON.parse(userFromStorage);
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    storedUser = null;
  }
}

const initialState = {
  user: storedUser,
  loading: false,
  error: null,
  teachers: [], // NEW
};

// 🔐 LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://madrassa-system-backend.vercel.app/auth/login",
        userData
      );
      const { userName, role, token } = response.data;
      const user = { userName, role, token };
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// 📝 REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://madrassa-system-backend.vercel.app/auth/register",
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ✅ NEW: GET TEACHERS
export const fetchTeachers = createAsyncThunk(
  "auth/fetchTeachers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://madrassa-system-backend.vercel.app/auth/teachers"
      );
      return response.data.teachers;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch teachers"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Teachers list
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.teachers = [];
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
