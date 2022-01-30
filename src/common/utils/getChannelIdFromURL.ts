export const getChannelIdFromURL = () => {
  return window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1);
}