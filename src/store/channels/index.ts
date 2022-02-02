import { TChat } from './../chats/types';
import { TDefaultAction } from './../../types/reducers';
import { fetchCreateChat } from './../chats/thunk';
import { fetchLeaveChannel } from './../user/thunk';
import { fetchCreateChannel, fetchUpdateChannel, fetchUpdateChannelIcon } from './thunk';
import { createSlice } from '@reduxjs/toolkit';
import { fetchUserInit } from '../user/thunk';
import { TChannel } from './types';

const initialState: Record<string, TChannel> = {};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: (state, action) => {
      state[action.payload.uuid] = action.payload;
    },
    addChannelMember: (state, action: TDefaultAction<{ cid: string; uid: string }>) => {
      state[action.payload.cid].members.push(action.payload.uid);
    },
    pullChannelMember: (state, action: TDefaultAction<{ cid: string; uid: string }>) => {
      const deletingIndex = state[action.payload.cid].members.findIndex((uid) => uid === action.payload.uid)!;
      state[action.payload.cid].members.splice(deletingIndex, 1);
    },
    updateChannel: (state, action: TDefaultAction<TChannel>) => {
      state[action.payload.uuid] = action.payload;
    },
    pushNewChat: (state, action: TDefaultAction<TChat>) => {
      state[action.payload.owningChannelId].chats.push(action.payload.uuid);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInit.fulfilled, (state, action) => {
      const newState: Record<string, TChannel> = {};
      action.payload.channels.forEach((channel: TChannel) => (newState[channel.uuid] = channel));
      return newState;
    });
    builder.addCase(fetchCreateChannel.fulfilled, (state, action) => {
      state[action.payload.channel.uuid] = action.payload.channel;
    });
    builder.addCase(fetchLeaveChannel.fulfilled, (state, action) => {
      delete state[action.payload.cid];
    });
    builder.addCase(fetchCreateChat.fulfilled, (state, action: TDefaultAction<TChat>) => {
      state[action.payload.owningChannelId].chats.push(action.payload.uuid);
    });
    builder.addCase(fetchUpdateChannelIcon.fulfilled, (state, action: TDefaultAction<TChannel>) => {
      state[action.payload.uuid] = action.payload;
    });
    builder.addCase(fetchUpdateChannel.fulfilled, (state, action: TDefaultAction<TChannel>) => {
      state[action.payload.uuid] = action.payload;
    });
  },
});

export const { addChannel, addChannelMember, updateChannel, pushNewChat, pullChannelMember } = channelsSlice.actions;
export default channelsSlice.reducer;
