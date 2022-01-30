import { TDefaultAction } from './../../types/reducers';
import { fetchFindChatsForChannel, fetchGetHistory } from './../chats/thunk';
import { fetchUserInit } from './../user/thunk';
import { TAppData, TCurrentChatStatus } from './types';
import { createSlice } from '@reduxjs/toolkit';
import { TMessage } from '../chats/types';

const initialState: TAppData = {
  activeConnection: {
    channelId: null,
    chatId: null,
    voiceCommunication: {
      channelId: null,
      voiceId: null,
    },
  },
  wsData: {
    wsConnected: false,
    wsConnectedPing: null,
    wsConnectionError: false,
  },
  init: {
    fulfilled: false,
    rejected: false,
    rejectedWithError: false,
  },
  currentChatStatus: {
    loading: {
      hasMore: null,
      isLoading: null,
      isLoaded: null,
    },
  },
  channelDropmenuIsOpen: false,
  fullLoadedChannels: [],
  disableMessageAutofocus: false,
  editingMessage: null,
  fullLoadedChats: [],
  preloadedChannels: [],
  modalIsActive: false,
  failedToLoad: [],
  typingUsers: {},
  uploadedAttachments: {},
  openedAttachment: '',
};

const appdataSlice: any = createSlice({
  name: 'appdata',
  initialState,
  reducers: {
    setActiveChannelId(state: TAppData, action: TDefaultAction<string | null>) {
      state.activeConnection.channelId = action.payload;
    },
    setActiveChatId(state: TAppData, action: TDefaultAction<string | null>) {
      state.activeConnection.chatId = action.payload;
    },
    setActiveVoiceCommunication(state: TAppData, action) {
      state.activeConnection.voiceCommunication = {
        channelId: action.payload.channelId,
        voiceId: action.payload.voiceId,
      };
    },
    setCurrentChatStatus(state: TAppData, action: TDefaultAction<TCurrentChatStatus>) {
      state.currentChatStatus = action.payload;
    },
    setChannelDropmenu(state: TAppData, action: TDefaultAction<boolean>) {
      state.channelDropmenuIsOpen = action.payload;
    },
    setDisableMessageAutofocus(state: TAppData, action: TDefaultAction<boolean>) {
      state.disableMessageAutofocus = action.payload;
    },
    setEditingMessage(state: TAppData, action: TDefaultAction<string | null>) {
      state.editingMessage = action.payload;
    },
    setWsConnected(state: TAppData, action: TDefaultAction<boolean>) {
      state.wsData.wsConnected = action.payload;
    },
    setWsConnectionError(state: TAppData, action: TDefaultAction<boolean>) {
      state.wsData.wsConnectionError = action.payload;
    },
    setModalIsActive(state, action: TDefaultAction<boolean>) {
      state.modalIsActive = action.payload;
    },
    setFailedToLoad(state, action: TDefaultAction<string | string[]>) {
      typeof action.payload === 'string'
        ? state.failedToLoad.push(action.payload)
        : state.failedToLoad.concat(action.payload);
    },
    addTypingUsers(state, action: TDefaultAction<{ uid: string; cid: string }>) {
      const { uid, cid } = action.payload;

      if (!state.typingUsers[cid]) state.typingUsers[cid] = [];
      if (!state.typingUsers[cid].includes(uid)) state.typingUsers[cid].push(uid);
    },
    pullTypingUsers(state, action: TDefaultAction<{ uid: string; cid: string }>) {
      const { uid, cid } = action.payload;

      if (state.typingUsers[cid]) {
        state.typingUsers[cid].splice(
          state.typingUsers[cid].findIndex((typingUid) => typingUid === uid),
          1
        );
        if (!state.typingUsers[cid].length) delete state.typingUsers[cid];
      }
    },
    setUploadedAttachments(state, action: TDefaultAction<{ urls: string[]; cid: string }>) {
      state.uploadedAttachments[action.payload.cid] = action.payload.urls;
    },
    resetAttachments(state, action: TDefaultAction<string>) {
      delete state.uploadedAttachments[action.payload];
    },
    setOpenedAttachment(state, action: TDefaultAction<string>) {
      state.openedAttachment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInit.fulfilled, (state: TAppData, action) => {
      state.init = {
        ...state.init,
        fulfilled: true,
        rejected: false,
      };
    });
    builder.addCase(fetchUserInit.rejected, (state: TAppData, action) => {
      state.init.rejected = true;
      if (action.error) state.init.rejectedWithError = true;
    });
    builder.addCase(fetchFindChatsForChannel.fulfilled, (state: TAppData, action) => {
      state.preloadedChannels.push(action.meta.arg);
    });
    builder.addCase(fetchGetHistory.pending, (state: TAppData, action) => {
      state.currentChatStatus.loading = {
        isLoading: true,
        hasMore: null,
        isLoaded: false,
      };
    });
    builder.addCase(
      fetchGetHistory.fulfilled,
      (state: TAppData, action: TDefaultAction<{ history: TMessage[]; chatId: string; hasMore: boolean }>) => {
        state.currentChatStatus.loading = {
          isLoading: false,
          hasMore: action.payload.hasMore,
          isLoaded: true,
        };
        if (!action.payload.hasMore && !state.fullLoadedChats.includes(action.payload.chatId))
          state.fullLoadedChats.push(action.payload.chatId);
      }
    );
  },
});

export const {
  setActiveChannelId,
  setActiveChatId,
  setActiveVoiceCommunication,
  setChannelDropmenu,
  setCurrentChatStatus,
  setDisableMessageAutofocus,
  setEditingMessage,
  setWsConnected,
  setModalIsActive,
  setFailedToLoad,
  addTypingUsers,
  pullTypingUsers,
  setWsConnectionError,
  setUploadedAttachments,
  resetAttachments,
  setOpenedAttachment,
} = appdataSlice.actions;
export default appdataSlice.reducer;
