import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';
import { AxiosUpdateChannel, AxiosUpdateChannelIcon } from '../../types/api.types';

export const fetchCreateChannel = createAsyncThunk(
  'channels/createChannel',
  async ({ title, icon }: { title: string; icon: File }, { rejectWithValue }) => {
    const response = await API.channels.createChannel({ title, icon });
    if ((response.response && response.response.status >= 300) || response.name === 'Error') {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);

export const fetchUpdateChannelIcon = createAsyncThunk(
  'channels/updateChannelIcon',
  async (data: AxiosUpdateChannelIcon, { rejectWithValue }) => {
    const response = await API.channels.updateChannelIcon(data);
    if ((response.response && response.response.status >= 300) || response.name === 'Error') {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);

export const fetchUpdateChannel = createAsyncThunk(
  'channels/updateChannel',
  async (data: AxiosUpdateChannel, { rejectWithValue }) => {
    const response = await API.channels.updateChannel(data);
    if ((response.response && response.response.status >= 300) || response.name === 'Error') {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);
