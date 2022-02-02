import React, { useEffect, useState } from 'react';
import GridChannelPage from '../../templates/Grids/GridChannelPage';
import ChannelSidebar from '../../components/ChannelSidebar/ChannelSidebar';
import ChannelChat from '../../components/ChannelChat/ChannelChat';
import { useDispatch, useSelector } from 'react-redux';
import { TStore } from '../../types/common';
import { getChannelIdFromURL } from '../../common/utils/getChannelIdFromURL';
import { setActiveChannelId, setActiveChatId } from '../../store/appdata/index';
import { fetchFindChatsForChannel, fetchGetHistory } from '../../store/chats/thunk';
import { fetchLoadedUsers } from '../../store/users/thunk';
import { TChat } from '../../store/chats/types';
import ChannelMembersList from '../../components/ChannelMembersList/ChannelMembersList';
import { TChannel } from '../../store/channels/types';
import s from './channelpage.module.css';

type TProps = {};

const ChannelPage: React.FC<TProps> = ({}): JSX.Element => {
  const dispatch = useDispatch();

  const activeConnection = useSelector((state: TStore) => state.appdata.activeConnection);
  const channels = useSelector((state: TStore) => state.channels);
  const user = useSelector((state: TStore) => state.user);
  const chats = useSelector((state: TStore) => state.chats);
  const preloadedChannels = useSelector((state: TStore) => state.appdata.preloadedChannels);
  const loadedUsers = useSelector((state: TStore) => state.users);
  const fullLoadedChats = useSelector((state: TStore) => state.appdata.fullLoadedChats);

  const [currentChannel, setCurrentChannel] = useState<TChannel | null | undefined>(null); // Объект открытого канала

  const [chatList, setChatList] = useState<TChat[]>([]); // Список объектов его чатов

  // ? При маунте чекаем, перешел ли пользователь по url'у канала
  // ? Если да, то сразу ставим в активный канал
  // ? Обнуляем стейт при анмаунте
  useEffect(() => {
    const idFromURl = getChannelIdFromURL();
    if (!activeConnection.channelId && idFromURl) {
      dispatch(setActiveChannelId(idFromURl));
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
    if (currentChannel) {
      dispatch(setActiveChatId(null));
    }
  }, [currentChannel?.uuid]);

  useEffect(() => {
    if (currentChannel?.uuid && activeConnection.channelId) {
      // dispatch(setActiveChatId(currentChannel.))
    }
  }, [currentChannel?.uuid, chats, activeConnection.channelId, activeConnection.chatId]);

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
      if (needToLoadUsers.length) {
        dispatch(fetchLoadedUsers(needToLoadUsers));
      }
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

      const loadedChats: TChat[] = [];
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
          {activeConnection.channelId && activeConnection.chatId && chats[activeConnection.chatId] ? (
            <ChannelChat
              chat={chats[activeConnection.chatId]}
              user={user}
              loadedUsers={loadedUsers}
              context={{ channelId: activeConnection.channelId, chatId: activeConnection.chatId }}
              systemChatId={currentChannel.systemChat}
            />
          ) : (
            <div></div>
          )}
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
