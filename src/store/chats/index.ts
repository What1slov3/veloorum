import { fetchUserInit, fetchLeaveChannel } from '@store/user/thunk';
import { fetchCreateChannel } from '@store/channels/thunk';
import { fetchSendMessage, fetchGetHistory, fetchDeleteMessage, fetchCreateChat, fetchDeleteChat } from './thunk';
import { fetchFindChatsForChannel, fetchUpdateChat, fetchEditMessage } from './thunk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Chats, Message, MessageContext } from '@customTypes/redux/chats.types';

const initialState: Chats = {};

const chatsSlice: any = createSlice({
  name: 'textCommunications',
  initialState,
  reducers: {
    chatSendMessage: (state, action: PayloadAction<Message>) => {
      state[action.payload.context.chatId].history.push({ ...action.payload, realtime: true });
    },
    chatDeleteMessage: (state, action: PayloadAction<Message>) => {
      state[action.payload.context.chatId].history.splice(
        state[action.payload.context.chatId].history.findIndex((message) => message.uuid === action.payload.uuid),
        1
      );
    },
    chatEditMessage: (state, action: PayloadAction<Message>) => {
      state[action.payload.context.chatId].history[
        state[action.payload.context.chatId].history.findIndex((message) => message.uuid === action.payload.uuid)
      ] = action.payload;
    },
    resetRealtimeStatus: (state, action: PayloadAction<{ context: MessageContext; uuid: string }>) => {
      state[action.payload.context.chatId].history[
        state[action.payload.context.chatId].history.findIndex((message) => message.uuid === action.payload.uuid)
      ].realtime = false;
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state[action.payload.uuid] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInit.fulfilled, (state, action) => {
      return { ...state, ...action.payload.chats };
    });
    builder.addCase(fetchFindChatsForChannel.fulfilled, (state, action) => {
      const loadedChats: Record<string, any> = {};
      action.payload.forEach((chat: Chat) => (loadedChats[chat.uuid] = chat));
      return { ...state, ...loadedChats };
    });
    builder.addCase(fetchSendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
      state[action.payload.context.chatId].history.push({ ...action.payload, realtime: true });
    });
    builder.addCase(
      fetchGetHistory.fulfilled,
      (state, action: PayloadAction<{ history: Message[]; chatId: string; hasMore: boolean }>) => {
        state[action.payload.chatId].history.unshift(...action.payload.history);
      }
    );
    builder.addCase(fetchDeleteMessage.fulfilled, (state, action: PayloadAction<Message>) => {
      state[action.payload.context.chatId].history.splice(
        state[action.payload.context.chatId].history.findIndex((message) => message.uuid === action.payload.uuid),
        1
      );
    });
    builder.addCase(fetchEditMessage.fulfilled, (state, action: PayloadAction<Message>) => {
      state[action.payload.context.chatId].history[
        state[action.payload.context.chatId].history.findIndex((message) => message.uuid === action.payload.uuid)
      ] = action.payload;
    });
    builder.addCase(fetchCreateChannel.fulfilled, (state, action) => {
      state[action.payload.chat.uuid] = action.payload.chat;
    });
    builder.addCase(fetchLeaveChannel.fulfilled, (state, action) => {
      const newState: Chats = {};
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

export const { chatSendMessage, chatDeleteMessage, chatEditMessage, resetRealtimeStatus, addChat } = chatsSlice.actions;
export default chatsSlice.reducer;
