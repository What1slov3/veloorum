import { ModalName } from '@customTypes/modals.types';

export type AppData = {
  activeConnection: ActiveConnection;
  wsData: WSData;
  init: InitStatus;
  currentChatStatus: CurrentChatStatus;
  fullLoadedChannels: string[];
  disableMessageAutofocus: boolean; // Выключить автофокус на ввод сообщения при нажатии неисключенной кнопки
  editingMessage: string | null; // ID реадиктируемого сообщения
  fullLoadedChats: string[]; // Полностью загруженные чаты
  preloadedChannels: string[];
  activeModal: {
    name: ModalName;
    payload: any;
  }; // Активно ли сейчас модальное окно
  failedToLoad: string[];
  typingUsers: Record<string, string[]>; // {[chatId: string]: uid[]}
  uploadedAttachments: UploadedAttachments;
  openedAttachment: string;
  openedUserCard: string | null;
};

export type ActiveConnection = {
  channelId: string | null; // ID открытого канала
  chatId: string | null; // ID открытого чата в канале
  voiceCommunication: ActiveVoiceConnection; // ID текущего RTC соединения
};

export type ActiveVoiceConnection = {
  channelId: string | null;
  voiceId: string | null;
};

export type WSData = {
  wsConnected: boolean; // Подключен ли WebSocket
  wsConnectedPing: number | null; // Пинг текущего WS соединения с основным сервером
  wsConnectionError: boolean; // Ошибка WS подключения
};

export type InitStatus = {
  fulfilled: boolean; // Инициализация прошла успешно
  rejected: boolean; // Отклонено
  rejectedWithError: boolean; // Отклонено по причине ошибки сервера
};

export type CurrentChatStatus = {
  loading: {
    // Данные об истории текущего чата
    hasMore: boolean | null; // Осталась ли еще недозагруженная история
    isLoading: boolean | null; // Идет загрузка истории чата
    isLoaded: boolean | null; // Новая порция данных загрузилась
  };
};

export type UploadedAttachments = Record<string, string[]>;
