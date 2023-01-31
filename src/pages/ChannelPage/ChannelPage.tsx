import React, { useEffect, useState } from 'react';
import GridChannelPage from '../../templates/Grids/GridChannelPage';
import ChannelSidebar from '@components/ChannelSidebar/ChannelSidebar';
import ChannelChat from '@components/ChannelChat/ChannelChat';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@customTypes/common.types';
import getChannelFromURL from '@common/utils/getChannelFromURL';
import { setActiveChannelId, setActiveChatId } from '../../store/appdata/index';
import { fetchFindChatsForChannel, fetchGetHistory } from '../../store/chats/thunk';
import { fetchLoadedUsers } from '../../store/users/thunk';
import ChannelMembersList from '@components/ChannelMembersList/ChannelMembersList';
import { Channel } from '@customTypes/redux/channels.types';
import { Chat } from '@customTypes/redux/chats.types';
import s from './channelpage.module.css';

const ChannelPage: React.FC = ({}): JSX.Element => {
  const dispatch = useDispatch<any>();

  const activeConnection = useSelector((state: Store) => state.appdata.activeConnection);
  const channels = useSelector((state: Store) => state.channels);
  const user = useSelector((state: Store) => state.user);
  const chats = useSelector((state: Store) => state.chats);
  const preloadedChannels = useSelector((state: Store) => state.appdata.preloadedChannels);
  const loadedUsers = useSelector((state: Store) => state.users);
  const fullLoadedChats = useSelector((state: Store) => state.appdata.fullLoadedChats);

  const [currentChannel, setCurrentChannel] = useState<Channel | null | undefined>(null); // Объект открытого канала

  const [chatList, setChatList] = useState<Chat[]>([]); // Список объектов его чатов

  // ? При маунте чекаем, перешел ли пользователь по url'у канала
  // ? Если да, то сразу ставим в активный канал
  // ? Обнуляем стейт при анмаунте
  useEffect(() => {
    const channelFromURL = getChannelFromURL();
    if (!activeConnection.channelId && channelFromURL) {
      dispatch(setActiveChannelId(channelFromURL[0]));
      dispatch(setActiveChatId(channelFromURL[1]));
    }

    return () => {
      dispatch(setActiveChannelId(null));
      dispatch(setActiveChatId(null));
    };
  }, []);

  // ? Следим за активным каналом и за изменениями в нем, чтобы оперативно менять стейт
  // TODO переделать, возможно возникает лишний рендер
  useEffect(() => {
    if (activeConnection.channelId) setCurrentChannel(channels[activeConnection.channelId]);
  }, [activeConnection.channelId, channels]);

  // ? При смене текущего канала
  useEffect(() => {
    if (currentChannel) dispatch(setActiveChatId(getChannelFromURL()![1]));
  }, [currentChannel?.uuid]);

  // ? В канале поменялись чаты или поменялись чаты в целом
  useEffect(() => {
    if (currentChannel) {
      setChatList(currentChannel.chats.map((uuid) => chats[uuid]));
    }
  }, [currentChannel?.chats, chats]);

  useEffect(() => {
    if (currentChannel) {
      const needToLoadUsers: string[] = currentChannel.members.filter(
        (member) => !loadedUsers[member] && member !== user.uuid
      );
      // TODO пределать после бекенда
      // if (needToLoadUsers.length) {
      //   dispatch(fetchLoadedUsers(needToLoadUsers));
      // }
    }
  }, [currentChannel?.members, loadedUsers]);

  // ? Поменялся текущий канал, чекаем предзагрузку
  useEffect(() => {
    let isPreloaded;
    if (currentChannel) isPreloaded = preloadedChannels.includes(currentChannel.uuid);

    if (currentChannel && !isPreloaded) {
      const needToLoadUsers: string[] = currentChannel.members.filter(
        (member) => !loadedUsers[member] && member !== user.uuid
      );
      if (needToLoadUsers) {
        dispatch(fetchLoadedUsers(needToLoadUsers));
      }

      const loadedChats: Chat[] = [];
      currentChannel.chats.forEach((uuid) => {
        if (chats[uuid]) loadedChats.push(chats[uuid]);
        return;
      });
      setChatList(loadedChats);

      if (loadedChats.length === 0 && currentChannel.chats.length > 0) {
        dispatch(fetchFindChatsForChannel(currentChannel.uuid));
      }
    }

    if (currentChannel && isPreloaded) {
      setChatList(currentChannel.chats.map((uuid) => chats[uuid]));
    }
  }, [currentChannel?.uuid, preloadedChannels]);

  // ? Начальная загрузка чата, загружается, если в стейте меньше 30 сообщений для данного чата
  // ? Сообщения в чате берутся после загрузки приложения, которые приходят через сокет
  useEffect(() => {
    if (
      activeConnection.chatId &&
      !fullLoadedChats.includes(activeConnection.chatId) &&
      chats[activeConnection.chatId].history.length < 30
    ) {
      dispatch(
        fetchGetHistory({
          shift: chats[activeConnection.chatId].history.length,
          chatId: activeConnection.chatId!,
        })
      );
    }
  }, [activeConnection.chatId, fullLoadedChats]);

  return (
    <>
      {currentChannel && (
        <GridChannelPage>
          <ChannelSidebar
            channelName={currentChannel.title || ''}
            chats={chatList || []}
            connection={activeConnection}
            channelId={currentChannel.uuid}
            isAdmin={currentChannel.ownerId === user.uuid}
          />
          <div>
            {activeConnection.channelId && activeConnection.chatId && chats[activeConnection.chatId] && (
              <ChannelChat
                chat={chats[activeConnection.chatId]}
                user={user}
                loadedUsers={loadedUsers}
                context={{ channelId: activeConnection.channelId, chatId: activeConnection.chatId }}
                systemChatId={currentChannel.systemChat}
              />
            )}
          </div>
          <ChannelMembersList channel={currentChannel} />
        </GridChannelPage>
      )}
      {currentChannel === undefined && (
        <div className={s.warning}>Похоже, что такого канала не существует или вы не состоите в нем</div>
      )}
    </>
  );
};

export default ChannelPage;
