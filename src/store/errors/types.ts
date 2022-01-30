
export type TErrorsStore = {
  changeUserDataStatus: TErrorStatus;
  createChannelStatus: TErrorStatus;
  createChatStatus: TErrorStatus;
  updateChannelStatus: TErrorStatus;
  updateChatStatus: TErrorStatus;
  deleteMessageStatus: TErrorStatus;
};

export type TErrorStatus = 'error' | 'success' | null;
