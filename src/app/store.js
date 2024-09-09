
import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../features/adminSlice';
// import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    // user: userReducer
  }
});