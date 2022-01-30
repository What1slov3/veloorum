import { fetchCreateChat, fetchDeleteMessage, fetchUpdateChat } from './../chats/thunk';
import { fetchCreateChannel, fetchUpdateChannel } from './../channels/thunk';
import { fetchChangeUserData } from './../user/thunk';
import { TDefaultAction } from './../../types/reducers';
import { createSlice } from '@reduxjs/toolkit';
import { TErrorsStore } from './types';

const initialState: TErrorsStore = {
  changeUserDataStatus: null,
  createChannelStatus: null,
  createChatStatus: null,
  updateChannelStatus: null,
  updateChatStatus: null,
  deleteMessageStatus: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setStatus: (state, action: TDefaultAction<{ type: keyof TErrorsStore; value: 'error' | 'success' | null }>) => {
      state[action.payload.type] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChangeUserData.rejected, (state, action) => {
      state.changeUserDataStatus = 'error';
    });
    builder.addCase(fetchChangeUserData.fulfilled, (state, action) => {
      state.changeUserDataStatus = 'success';
    });
    builder.addCase(fetchCreateChannel.rejected, (state, action) => {
      state.createChannelStatus = 'error';
    });
    builder.addCase(fetchCreateChannel.fulfilled, (state, action) => {
      state.createChannelStatus = 'success';
    });
    builder.addCase(fetchCreateChat.rejected, (state, action) => {
      state.createChatStatus = 'error';
    });
    builder.addCase(fetchCreateChat.fulfilled, (state, action) => {
      state.createChatStatus = 'success';
    });
    builder.addCase(fetchUpdateChannel.rejected, (state, action) => {
      state.updateChannelStatus = 'error';
    });
    builder.addCase(fetchUpdateChannel.fulfilled, (state, action) => {
      state.updateChannelStatus = 'success';
    });
    builder.addCase(fetchUpdateChat.rejected, (state, action) => {
      state.updateChatStatus = 'error';
    });
    builder.addCase(fetchUpdateChat.fulfilled, (state, action) => {
      state.updateChatStatus = 'success';
    });
    builder.addCase(fetchDeleteMessage.rejected, (state, action) => {
      state.deleteMessageStatus = 'error';
    });
    builder.addCase(fetchDeleteMessage.fulfilled, (state, action) => {
      state.deleteMessageStatus = 'success';
    });
  },
});

export const { setStatus } = errorSlice.actions;
export default errorSlice.reducer;
