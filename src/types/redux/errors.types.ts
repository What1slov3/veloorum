export type ErrorsStore = Record<
  | 'changeUserDataStatus'
  | 'createChannelStatus'
  | 'createChatStatus'
  | 'updateChannelStatus'
  | 'updateChatStatus'
  | 'deleteMessageStatus',
  ErrorStatus
>;

export type ErrorStatus = 'error' | 'success' | null;
