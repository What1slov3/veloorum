import { TDefaultAction } from './../../types/reducers';
import { fetchUserInit, fetchLeaveChannel } from './../user/thunk';
import { fetchCreateChannel } from './../channels/thunk';
import {
  fetchSendMessage,
  fetchGetHistory,
  fetchDeleteMessage,
  fetchPreloadAllChats,
  fetchCreateChat,
  fetchDeleteChat,
} from './thunk';
import { fetchFindChatsForChannel, fetchUpdateChat, fetchEditMessage } from './thunk';
import { TChats, TChat, TMessage, TMessageContext } from './types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: TChats = {};

const chatsSlice: any = createSlice({
  name: 'textCommunications',
  initialState,
  reducers: {
    chatSendMessage: (state, action: TDefaultAction<TMessage>) => {
      state[action.payload.context.chatId].history.push({ ...action.payload, realtime: true });
    },
    chatDeleteMessage: (state, action: TDefaultAction<TMessage>) => {
      state[action.payload.context.chatId].history.splice(
        state[action.payload.context.chatId].history.findIndex((message) => message.uuid === action.payload.uuid),
        1
      );
    },
    chatEditMessage: (state, action: TDefaultAction<TMessage>) => {
      state[action.payload.context.chatId].history[
        state[action.payload.context.chatId].history.findIndex((message) => message.uuid === action.payload.uuid)
      ] = action.payload;
    },
    resetRealtimeStatus: (state, action: TDefaultAction<{ context: TMessageContext; uuid: string }>) => {
      state[action.payload.context.chatId].history[
        state[action.payload.context.chatId].history.findIndex((message) => message.uuid === action.payload.uuid)
      ].realtime = false;
    },
    createChat: (state, action: TDefaultAction<TChat>) => {
      state[action.payload.uuid] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInit.fulfilled, (state, action) => {
      return { ...state, ...action.payload.chats };
    });
    builder.addCase(fetchFindChatsForChannel.fulfilled, (state, action) => {
      const loadedChats: Record<string, any> = {};
      action.payload.forEach((chat: TChat) => (loadedChats[chat.uuid] = chat));
      return { ...state, ...loadedChats };
    });
    builder.addCase(fetchSendMessage.fulfilled, (state, action: TDefaultAction<TMessage>) => {
      state[action.payload.context.chatId].history.push({ ...action.payload, realtime: true });
    });
    builder.addCase(
      fetchGetHistory.fulfilled,
      (state, action: TDefaultAction<{ history: TMessage[]; chatId: string; hasMore: boolean }>) => {
        state[action.payload.chatId].history.unshift(...action.payload.history);
      }
    );
    builder.addCase(fetchDeleteMessage.fulfilled, (state, action: TDefaultAction<TMessage>) => {
      state[action.payload.context.chatId].history.splice(
        state[action.payload.context.chatId].history.findIndex((message) => message.uuid === action.payload.uuid),
        1
      );
    });
    builder.addCase(fetchEditMessage.fulfilled, (state, action: TDefaultAction<TMessage>) => {
      state[action.payload.context.chatId].history[
        state[action.payload.context.chatId].history.findIndex((message) => message.uuid === action.payload.uuid)
      ] = action.payload;
    });
    builder.addCase(fetchCreateChannel.fulfilled, (state, action) => {
      state[action.payload.chat.uuid] = action.payload.chat;
    });
    builder.addCase(fetchPreloadAllChats.fulfilled, (state, action) => {});
    builder.addCase(fetchLeaveChannel.fulfilled, (state, action) => {
      const newState: TChats = {};
      for (let cid in state) {
        if (state[cid].owningChannelId !== action.payload.cid) {
          newState[cid] = state[cid];
        }
      }
      return newState;
    });
    builder.addCase(fetchCreateChat.fulfilled, (state, action) => {
      state[action.payload.uuid] = action.payload;
    });
    builder.addCase(fetchDeleteChat.fulfilled, (state, action) => {
      delete state[action.payload.chat.uuid];
    });
    builder.addCase(fetchUpdateChat.fulfilled, (state, action) => {
      state[action.payload.uuid] = { ...state[action.payload.uuid], ...action.payload };
    });
  },
});

export const { chatSendMessage, chatDeleteMessage, chatEditMessage, resetRealtimeStatus, createChat } =
  chatsSlice.actions;
export default chatsSlice.reducer;
