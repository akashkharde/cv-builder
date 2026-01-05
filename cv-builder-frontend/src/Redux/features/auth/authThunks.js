import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMeAPI, registerAPI } from "./authAPI";
import { loginAPI } from "./authAPI";


export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      return await registerAPI(payload);
    } catch (error) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";
      return rejectWithValue(message);
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await loginAPI(payload);
    } catch (error) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      return rejectWithValue(message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      return await getMeAPI();
    } catch {
      return rejectWithValue(null);
    }
  }
);
