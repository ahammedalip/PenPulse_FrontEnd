// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: '',
    name: '',
    role: '',
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
    clearUserDetails: (state) => {
      state.id = '';
      state.name = '';
      state.role = '';
    },
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
