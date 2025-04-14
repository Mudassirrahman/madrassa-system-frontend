import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// LocalStorage se user load karo
let storedUser = null;
const userFromStorage = localStorage.getItem('user');
if (userFromStorage) {
  try {
    storedUser = JSON.parse(userFromStorage);
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    storedUser = null;
  }
}

// Initial state
const initialState = {
  user: storedUser,
  loading: false,
  error: null,
};

// 🔐 LOGIN
export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:8080/auth/login', userData);
    const { userName, role, token } = response.data;
    const user = { userName, role, token };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Login failed:", error);
    return rejectWithValue(error.response?.data?.message || 'Something went wrong');
  }
});

// 📝 REGISTER
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:8080/auth/register', userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Something went wrong');
  }
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
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
        state.error = null;
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
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
