export type TAppData = {
  activeConnection: TActiveConnection;
  wsData: TWSData;
  init: TInitStatus;
  currentChatStatus: TCurrentChatStatus;
  channelDropmenuIsOpen: boolean;
  fullLoadedChannels: string[];
  disableMessageAutofocus: boolean; // Выключить автофокус на ввод сообщения при нажатии неисключенной кнопки
  editingMessage: string | null; // ID реадиктируемого сообщения
  fullLoadedChats: string[]; // Полностью загруженные чаты
  preloadedChannels: string[];
  modalIsActive: boolean; // Активно ли сейчас модальное окно
  failedToLoad: string[];
  typingUsers: Record<string, string[]>; // {[chatId: string]: uid[]}
  uploadedAttachments: TUploadedAttachments;
  openedAttachment: string;
};
export type TActiveConnection = {
  channelId: string | null; // ID открытого канала
  chatId: string | null; // ID открытого чата в канале
  voiceCommunication: TActiveVoiceConnection; // ID текущего RTC соединения
};
export type TActiveVoiceConnection = {
  channelId: string | null;
  voiceId: string | null;
};
export type TWSData = {
  wsConnected: boolean; // Подключен ли WebSocket
  wsConnectedPing: number | null; // Пинг текущего WS соединения с основным сервером
  wsConnectionError: boolean; // Ошибка WS подключения
};
export type TInitStatus = {
  fulfilled: boolean; // Инициализация прошла успешно
  rejected: boolean; // Отклонено
  rejectedWithError: boolean; // Отклонено по причине ошибки сервера
};
export type TCurrentChatStatus = {
  loading: {
    // Данные об истории текущего чата
    hasMore: boolean | null; // Осталась ли еще недозагруженная история
    isLoading: boolean | null; // Идет загрузка истории чата
    isLoaded: boolean | null; // Новая порция данных загрузилась
  };
};
export type TUploadedAttachments = Record<string, string[]>;