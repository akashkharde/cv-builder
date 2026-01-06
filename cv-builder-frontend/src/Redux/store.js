import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cvReducer from './slices/cvSlice';
import templateReducer from './slices/templateSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cv: cvReducer,
    template: templateReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
