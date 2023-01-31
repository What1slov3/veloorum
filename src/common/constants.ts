import { ModalName, ModalNameKeys } from '../types/modals.types';

export const MAX_SYMBOLS_LIMIT_DEFAULT = 2000;
export const SHORT_MESSAGE_TIMEOUT = 30 * 1000;
export const MODAL_NAMES: Record<ModalNameKeys, ModalName> = {
  ATTACHMENT: 'attachment',
  CHANGE_PASSWORD: 'changePassword',
  CHANGE_USER_DATA: 'changeUserData',
  CHANNEL_SETTINGS: 'channelSettings',
  CREATE_CHANNEL: 'createChannel',
  CREATE_CHAT: 'createChat',
  DELETE_MESSAGE: 'deleteMessage',
  INVITE_LINK: 'inviteLink',
  SYMBOL_LIMIT: 'symbolLimit',
  CHAT_SETTINGS: 'chatSettings',
};
