import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '@api/index';

export const fetchCreateChannelInvite = createAsyncThunk(
  'channel/createInvite',
  async (cid: string, { rejectWithValue }) => {
    const response = await API.invites.CreateInvite(cid);
    if ((response.response && response.response.status >= 300) || response.name === 'Error') {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);
