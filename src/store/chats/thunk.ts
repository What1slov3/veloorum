import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '@api/index';
import { MessageContent, MessageContext, UpdatableFieldsChat } from '@customTypes/redux/chats.types';

export const fetchFindChatsForChannel = createAsyncThunk(
  'chats/findChatsForChannel',
  async (cid: string, { rejectWithValue }) => {
    const response = await API.chats.findChatsForChannel(cid);
    if (response.response && response.response.status >= 300) {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);

export const fetchSendMessage = createAsyncThunk(
  'chats/sendMessage',
  async ({ content, context }: { content: MessageContent; context: MessageContext }, { rejectWithValue }) => {
    const response = await API.messages.sendMessage({ content, context });
    if (response.response && response.response.status >= 300) {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);

export const fetchGetHistory = createAsyncThunk(
  'chats/getHistory',
  async ({ shift, chatId }: { shift: number; chatId: string }, { rejectWithValue }) => {
    const response = await API.messages.getHistory({ shift, chatId });
    if ((response.response && response.response.status >= 300) || response.name === 'Error') {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);

export const fetchDeleteMessage = createAsyncThunk(
  'chats/deleteMessage',
  async ({ chatId, messageId }: { chatId: string; messageId: string }, { rejectWithValue }) => {
    const response = await API.messages.deleteMessage({ cid: chatId, mid: messageId });
    if ((response.response && response.response.status >= 300) || response.name === 'Error') {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);

export const fetchEditMessage = createAsyncThunk(
  'chats/editMessage',
  async (
    { chatId, messageId, content }: { chatId: string; messageId: string; content: MessageContent },
    { rejectWithValue }
  ) => {
    const response = await API.messages.editMessage({ cid: chatId, mid: messageId, content });
    if ((response.response && response.response.status >= 300) || response.name === 'Error') {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);

export const fetchPreloadAllChats = createAsyncThunk(
  'chats/preloadAllChats',
  async (cid: string[], { rejectWithValue }) => {
    const response = await API.chats.preloadAllChats(cid);
    if ((response.response && response.response.status >= 300) || response.name === 'Error') {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);

export const fetchCreateChat = createAsyncThunk(
  'chats/createChat',
  async ({ cid, title }: { cid: string; title: string }, { rejectWithValue }) => {
    const response = await API.chats.createChat(cid, title);
    if ((response.response && response.response.status >= 300) || response.name === 'Error') {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);

export const fetchDeleteChat = createAsyncThunk('chats/deleteChat', async (cid: string, { rejectWithValue }) => {
  const response = await API.chats.deleteChat(cid);
  if ((response.response && response.response.status >= 300) || response.name === 'Error') {
    return rejectWithValue('Something broke');
  }
  return response;
});

export const fetchUpdateChat = createAsyncThunk(
  'chats/updateChat',
  async (data: { cid: string; chat: UpdatableFieldsChat }, { rejectWithValue }) => {
    const response = await API.chats.updateChat(data);
    if ((response.response && response.response.status >= 300) || response.name === 'Error') {
      return rejectWithValue('Something broke');
    }
    return response;
  }
);
