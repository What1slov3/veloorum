import isUUID from './isUUID';

/**
 * @description Returns an array [channelId, chatId] or null;
 */
export default (pathname: string = '') => {
  const splitted = (pathname || window.location.pathname).split('/');
  const channelTagIndex = splitted.indexOf('channel');
  const channelId = isUUID(splitted[channelTagIndex + 1]) && splitted[channelTagIndex + 1];
  const chatId = isUUID(splitted[channelTagIndex + 2]) && splitted[channelTagIndex + 2];
  return channelId && chatId ? [channelId, chatId] : null;
};
  