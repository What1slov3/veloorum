import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

export const fetchLoadedUsers = createAsyncThunk(
  'users/getLoadedUsers',
  async (users: string[], { rejectWithValue }) => {
    const response = await API.users.getLoadedUsers(users);
    if (response.response && response.response.status >= 300 || response.name === 'Error') {
      localStorage.clear();
      return rejectWithValue('Something broke');
    }
    return response;
  }
);
