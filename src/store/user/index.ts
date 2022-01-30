import { TDefaultAction } from './../../types/reducers';
import { TUser } from './types';
import { fetchUserInit, fetchUploadAvatar, fetchLeaveChannel, fetchChangeUserData } from './thunk';
import { createSlice } from '@reduxjs/toolkit';

const initialState: TUser = {
  uuid: '',
  email: '',
  tag: '',
  avatarUrl: '',
  channels: [],
  username: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userAddChannel(state, action) {
      state.channels.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInit.fulfilled, (state, action) => {
      return action.payload.user
    });
    builder.addCase(fetchUploadAvatar.fulfilled, (state, action: TDefaultAction<TUser>) => {
      state.avatarUrl = action.payload.avatarUrl;
    });
    builder.addCase(fetchLeaveChannel.fulfilled, (state, action) => {
      state.channels = action.payload.channels;
    });
    builder.addCase(fetchChangeUserData.fulfilled, (state, action: TDefaultAction<TUser>) => {
      return action.payload;
    });
  },
});

const {} = userSlice.actions;
export default userSlice.reducer;
