import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser, checkAuth } from "../features/auth/authThunks";

const initialState = {
  user: null,
  loading: false,
  error: null,
  authChecked: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    //Register User
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //Login User
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.user = null;
      state.accessToken = null;
    })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.user || null;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.authChecked = true;
      });
  },
});

export const { resetAuthState, logout } = authSlice.actions;
export default authSlice.reducer;
