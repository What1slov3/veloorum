import { fetchCreateChat } from '@store/chats/thunk';
import { fetchLeaveChannel } from '@store/user/thunk';
import { fetchCreateChannel, fetchUpdateChannel, fetchUpdateChannelIcon } from './thunk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUserInit } from '@store/user/thunk';
import { Channel } from '@customTypes/redux/channels.types';
import { Chat } from '@customTypes/redux/chats.types';

const initialState: Record<string, Channel> = {};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: (state, action) => {
      state[action.payload.uuid] = action.payload;
    },
    addChannelMember: (state, action: PayloadAction<{ cid: string; uid: string }>) => {
      state[action.payload.cid].members.push(action.payload.uid);
    },
    pullChannelMember: (state, action: PayloadAction<{ cid: string; uid: string }>) => {
      const deletingIndex = state[action.payload.cid].members.findIndex((uid) => uid === action.payload.uid)!;
      state[action.payload.cid].members.splice(deletingIndex, 1);
    },
    updateChannel: (state, action: PayloadAction<Channel>) => {
      state[action.payload.uuid] = action.payload;
    },
    pushNewChat: (state, action: PayloadAction<Chat>) => {
      state[action.payload.owningChannelId].chats.push(action.payload.uuid);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInit.fulfilled, (state, action) => {
      const newState: Record<string, Channel> = {};
      action.payload.channels.forEach((channel: Channel) => (newState[channel.uuid] = channel));
      return newState;
    });
    builder.addCase(fetchCreateChannel.fulfilled, (state, action) => {
      state[action.payload.channel.uuid] = action.payload.channel;
    });
    builder.addCase(fetchLeaveChannel.fulfilled, (state, action) => {
      delete state[action.payload.cid];
    });
    builder.addCase(fetchCreateChat.fulfilled, (state, action: PayloadAction<Chat>) => {
      state[action.payload.owningChannelId].chats.push(action.payload.uuid);
    });
    builder.addCase(fetchUpdateChannelIcon.fulfilled, (state, action: PayloadAction<Channel>) => {
      state[action.payload.uuid] = action.payload;
    });
    builder.addCase(fetchUpdateChannel.fulfilled, (state, action: PayloadAction<Channel>) => {
      state[action.payload.uuid] = action.payload;
    });
  },
});

export const { addChannel, addChannelMember, updateChannel, pushNewChat, pullChannelMember } = channelsSlice.actions;
export default channelsSlice.reducer;
