import { ModalName } from '@customTypes/modals.types';
import { fetchFindChatsForChannel, fetchGetHistory } from '@store/chats/thunk';
import { fetchUserInit } from '@store/user/thunk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppData, CurrentChatStatus } from '@customTypes/redux/appdata.types';
import { Message } from '@customTypes/redux/chats.types';

const initialState: AppData = {
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
  fullLoadedChannels: [],
  disableMessageAutofocus: false,
  editingMessage: null,
  fullLoadedChats: [],
  preloadedChannels: [],
  failedToLoad: [],
  typingUsers: {},
  uploadedAttachments: {},
  openedAttachment: '',
  openedUserCard: null,
  activeModal: {
    name: null,
    payload: {},
  },
};

const appdataSlice: any = createSlice({
  name: 'appdata',
  initialState,
  reducers: {
    setActiveChannelId(state: AppData, action: PayloadAction<string | null>) {
      state.activeConnection.channelId = action.payload;
    },
    setActiveChatId(state: AppData, action: PayloadAction<string | null>) {
      state.activeConnection.chatId = action.payload;
    },
    setActiveVoiceCommunication(state: AppData, action) {
      state.activeConnection.voiceCommunication = {
        channelId: action.payload.channelId,
        voiceId: action.payload.voiceId,
      };
    },
    setCurrentChatStatus(state: AppData, action: PayloadAction<CurrentChatStatus>) {
      state.currentChatStatus = action.payload;
    },
    setDisableMessageAutofocus(state: AppData, action: PayloadAction<boolean>) {
      state.disableMessageAutofocus = action.payload;
    },
    setEditingMessage(state: AppData, action: PayloadAction<string | null>) {
      state.editingMessage = action.payload;
    },
    setWsConnected(state: AppData, action: PayloadAction<boolean>) {
      state.wsData.wsConnected = action.payload;
    },
    setWsConnectionError(state: AppData, action: PayloadAction<boolean>) {
      state.wsData.wsConnectionError = action.payload;
    },
    setModal(state, action: PayloadAction<{ name: ModalName; payload: any }>) {
      state.activeModal = action.payload;
    },
    setFailedToLoad(state, action: PayloadAction<string | string[]>) {
      typeof action.payload === 'string'
        ? state.failedToLoad.push(action.payload)
        : state.failedToLoad.concat(action.payload);
    },
    addTypingUsers(state, action: PayloadAction<{ uid: string; cid: string }>) {
      const { uid, cid } = action.payload;

      if (!state.typingUsers[cid]) state.typingUsers[cid] = [];
      if (!state.typingUsers[cid].includes(uid)) state.typingUsers[cid].push(uid);
    },
    pullTypingUsers(state, action: PayloadAction<{ uid: string; cid: string }>) {
      const { uid, cid } = action.payload;

      if (state.typingUsers[cid]) {
        state.typingUsers[cid].splice(
          state.typingUsers[cid].findIndex((typingUid: string) => typingUid === uid),
          1
        );
        if (!state.typingUsers[cid].length) delete state.typingUsers[cid];
      }
    },
    setUploadedAttachments(state, action: PayloadAction<{ urls: string[]; cid: string }>) {
      state.uploadedAttachments[action.payload.cid] = action.payload.urls;
    },
    resetAttachments(state, action: PayloadAction<string>) {
      delete state.uploadedAttachments[action.payload];
    },
    setOpenedAttachment(state, action: PayloadAction<string>) {
      state.openedAttachment = action.payload;
    },
    setOpenedUserCard(state, action: PayloadAction<string | null>) {
      state.openedUserCard = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInit.fulfilled, (state: AppData, action) => {
      state.init = {
        ...state.init,
        fulfilled: true,
        rejected: false,
      };
    });
    builder.addCase(fetchUserInit.rejected, (state: AppData, action) => {
      state.init.rejected = true;
      if (action.error) state.init.rejectedWithError = true;
    });
    builder.addCase(fetchFindChatsForChannel.fulfilled, (state: AppData, action) => {
      state.preloadedChannels.push(action.meta.arg);
    });
    builder.addCase(fetchGetHistory.pending, (state: AppData, action) => {
      state.currentChatStatus.loading = {
        isLoading: true,
        hasMore: null,
        isLoaded: false,
      };
    });
    builder.addCase(
      fetchGetHistory.fulfilled,
      (state: AppData, action: PayloadAction<{ history: Message[]; chatId: string; hasMore: boolean }>) => {
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
  setCurrentChatStatus,
  setDisableMessageAutofocus,
  setEditingMessage,
  setWsConnected,
  setModal,
  setFailedToLoad,
  addTypingUsers,
  pullTypingUsers,
  setWsConnectionError,
  setUploadedAttachments,
  resetAttachments,
  setOpenedAttachment,
  setOpenedUserCard,
} = appdataSlice.actions;
export default appdataSlice.reducer;
