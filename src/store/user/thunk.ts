import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '@api/index';
import { AxiosChangeUserData } from '@customTypes/api.types';

export const fetchUserInit = createAsyncThunk('user/userInit', async (undefined, { rejectWithValue }) => {
  const response = await API.user.init();
  if (response.name === 'Error') {
    return rejectWithValue('Something broke');
  }
  if (response.response && response.response.status >= 300) {
    localStorage.clear();
    window.location.pathname = '/login.html';
    return rejectWithValue('Something broke');
  }
  return response;
});

export const fetchLeaveChannel = createAsyncThunk('user/leaveChannel', async (cid: string, { rejectWithValue }) => {
  const response = await API.user.leaveChannel(cid);
  if ((response.response && response.response.status >= 300) || response.name === 'Error') {
    return rejectWithValue('Something broke');
  }
  return response;
});

export const fetchUploadAvatar = createAsyncThunk('user/uploadAvatar', async (avatar: File, { rejectWithValue }) => {
  const response = await API.user.uploadAvatar(avatar);
  if ((response.response && response.response.status >= 300) || response.name === 'Error') {
    return rejectWithValue('Something broke');
  }
  return response;
});

export const fetchChangeUserData = createAsyncThunk(
  'user/changeUserData',
  async (userData: AxiosChangeUserData, { rejectWithValue }) => {
    const response = await API.user.changeUserData(userData);
    if ((response.response && response.response.status >= 300) || response.name === 'Error') {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);
