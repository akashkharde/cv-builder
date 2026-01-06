import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser, checkAuth, logoutUser } from "../features/auth/authThunks";

// Safely read persisted auth data (access token + basic user info)
const loadPersistedAuth = () => {
  try {
    const raw = localStorage.getItem("authState");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const persistAuth = (state) => {
  try {
    localStorage.setItem(
      "authState",
      JSON.stringify({
        accessToken: state.accessToken,
        user: state.user,
      })
    );
  } catch {
    // ignore storage errors
  }
};

const clearPersistedAuth = () => {
  try {
    localStorage.removeItem("authState");
  } catch {
    // ignore storage errors
  }
};

const persisted = loadPersistedAuth();

const initialState = {
  user: persisted.user || null,
  loading: false,
  error: null,
  authChecked: false,
  accessToken: persisted.accessToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      clearPersistedAuth();
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      persistAuth(state);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      persistAuth(state);
    }
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
        persistAuth(state);
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
        persistAuth(state);
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.authChecked = true;
        clearPersistedAuth();
      });

    //Logout User
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
    })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        clearPersistedAuth();
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        // Even if the backend call fails, we clear state to prevent being stuck
        state.user = null;
        state.accessToken = null;
        clearPersistedAuth();
      });
  },
});

export const { resetAuthState, clearAuth, setAccessToken, setUser } = authSlice.actions;
export default authSlice.reducer;
