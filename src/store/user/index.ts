import { fetchUserInit, fetchUploadAvatar, fetchLeaveChannel, fetchChangeUserData } from './thunk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@customTypes/redux/user.types';

const initialState: User = {
  uuid: '',
  email: '',
  tag: '',
  avatarUrl: '',
  channels: [],
  username: '',
  avatarColor: '',
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
      return action.payload.user;
    });
    builder.addCase(fetchUploadAvatar.fulfilled, (state, action: PayloadAction<User>) => {
      state.avatarUrl = action.payload.avatarUrl;
    });
    builder.addCase(fetchLeaveChannel.fulfilled, (state, action) => {
      state.channels = action.payload.channels;
    });
    builder.addCase(fetchChangeUserData.fulfilled, (state, action: PayloadAction<User>) => {
      return action.payload;
    });
  },
});

const {} = userSlice.actions;
export default userSlice.reducer;
