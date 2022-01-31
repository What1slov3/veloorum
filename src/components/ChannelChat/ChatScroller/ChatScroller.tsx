import React, { MutableRefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChatStatus, setEditingMessage, setOpenedAttachment } from '../../../store/appdata';
import { fetchGetHistory } from '../../../store/chats/thunk';
import { TStore } from '../../../types/common';
import InfiniteScroll from '../../InfiniteScroll/InfiniteScroll';
import { ChannelMessageMemo } from '../ChannelMessage/ChannelMessage';
import ChannelSystemMessage from '../ChannelSystemMessage/ChannelSystemMessage';
import ChannelMessageDivider from '../ChannelMessageDivider/ChannelMessageDivider';
import BottomScroller from '../../BottomScroller/BottomScroller';
import { TModalOpenFunc } from '../../../types/hooks';
import { TDeleteMessageModalPayload } from '../../../types/modalsPayload';
import { TUsersStore } from '../../../store/users/types';
import { fetchLoadedUsers } from '../../../store/users/thunk';
import { undefinedUser } from '../../../common/undefinedUser';
import { TMessage, TMessageContext } from '../../../store/chats/types';
import { TUser } from '../../../store/user/types';
import classNames from 'classnames';
import MessagePreloader from '../../Preloaders/MessagePreloader/MessagePreloader';
import s from './chatscroller.module.css';

type TProps = {
  context: TMessageContext;
  history: TMessage[];
  user: TUser;
  loadedUsers: TUsersStore;
  openDeleteModal: TModalOpenFunc<TDeleteMessageModalPayload>;
  setAnchorRef: (ref: MutableRefObject<HTMLDivElement>) => void;
};

const ChatScroller: React.FC<TProps> = ({
  history,
  context,
  user,
  loadedUsers,
  openDeleteModal,
  setAnchorRef,
}): JSX.Element => {
  const dispatch = useDispatch();

  const loadingStatus = useSelector((state: TStore) => state.appdata.currentChatStatus.loading);
  const fullLoadedChats = useSelector((state: TStore) => state.appdata.fullLoadedChats);
  const editingMessage = useSelector((state: TStore) => state.appdata.editingMessage);

  const anchorRef = useRef<HTMLDivElement>(null!);
  const scrollerRef = useRef<HTMLDivElement>(null!);
  const scrollHeightRef = useRef<number>(0);
  const historyLengthRef = useRef<[number, number]>([0, 0]);

  const [showScroller, setShowScroller] = useState<boolean>(false);
  const [scrollIsBottom, setScrollIsBottom] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useLayoutEffect(() => {
    setAnchorRef(anchorRef);
  }, []);

  useLayoutEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [context.chatId, scrollerRef]);

  useEffect(() => {
    const curHistory = historyLengthRef.current[1];
    const newHistory = history.length;
    historyLengthRef.current = [curHistory, newHistory];
  }, [history]);

  // Подзагрузка пользователей, если в сообщении есть неизвестный пользователь
  // TODO оптимизировать алгоритм
  useEffect(() => {
    if (loadingStatus.isLoaded) {
      const usersSet: Set<string> = new Set();
      history.forEach((message) => {
        if (message.ownerId === user.uuid || message.content.targetUser === user.uuid) return;
        if (message.ownerId && !loadedUsers[message.ownerId]) {
          usersSet.add(message.ownerId);
          return;
        }
        if (message.content.targetUser && !loadedUsers[message.content.targetUser]) {
          usersSet.add(message.content.targetUser);
          return;
        }
      });
      if (usersSet.size) dispatch(fetchLoadedUsers([...usersSet]));
    }
  }, [history, loadingStatus.isLoaded, loadedUsers]);

  const smoothScrollToBottom = () => {
    anchorRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const saveCurrentScroll = (): void => {
    scrollHeightRef.current = scrollerRef.current.scrollHeight;
  };

  // gt - режим сравнения
  // true - текущий размер больше предыдущего
  // false - текущий размер меньше предыдущего
  const compareCurrentHistorySize = (gt: boolean) => {
    const result = historyLengthRef.current[1] > historyLengthRef.current[0];
    if (gt) return result;
    return !result;
  };

  const setEditingMode = useCallback((uuid: string | null) => {
    dispatch(setEditingMessage(uuid));
  }, []);

  const openAttachment = useCallback((url: string) => {
    dispatch(setOpenedAttachment(url));
  }, []);

  const renderMessages = useMemo((): JSX.Element[] => {
    let renderedHistory = history.map((message: TMessage, index) => {
      let { uuid, createdAt, updatedAt, content, context, ownerId, realtime } = message;
      let isShort = false;

      if (message.type !== 'system') {
        isShort =
          index >= 1 &&
          new Date(createdAt).getTime() - new Date(history[index - 1].createdAt).getTime() <= 30 * 1000 &&
          history[index - 1].ownerId === message.ownerId;
      }

      return (
        <React.Fragment key={uuid}>
          {index >= 1 && new Date(history[index - 1].createdAt).getDate() !== new Date(createdAt).getDate() && (
            <ChannelMessageDivider date={createdAt} />
          )}
          {index === 0 && <ChannelMessageDivider date={createdAt} />}
          {message.type === 'system' && message.systemType ? (
            <ChannelSystemMessage
              uuid={uuid}
              content={content}
              context={context}
              createdAt={createdAt}
              systemType={message.systemType}
              targetUser={
                // ? Если пользователь есть, и он есть в загруженных - ставим, если нету, смотрим, может они и есть юзер иначе ставим undefined user'a
                message.content.targetUser && loadedUsers[message.content.targetUser]
                  ? loadedUsers[message.content.targetUser]
                  : message.content.targetUser === user.uuid
                  ? user
                  : undefinedUser
              }
            />
          ) : (
            <ChannelMessageMemo
              uuid={uuid}
              content={content}
              context={context}
              createdAt={createdAt}
              updatedAt={updatedAt}
              isOwner={ownerId === user.uuid}
              username={
                user.uuid === ownerId
                  ? user.username
                  : loadedUsers[ownerId]
                  ? loadedUsers[ownerId].username
                  : 'Undefined User'
              }
              openDeleteModal={openDeleteModal}
              uid={user.uuid}
              isEditing={uuid === editingMessage}
              setEditingMode={setEditingMode}
              short={isShort}
              openAttachment={openAttachment}
              realtime={!!realtime}
            />
          )}
        </React.Fragment>
      );
    });
    if (!isRendered && (history.length || (!history.length && !loadingStatus.hasMore))) setIsRendered(true);
    return renderedHistory;
  }, [history, loadedUsers, editingMessage, isRendered]);

  const loadNextMessages = (): void => {
    dispatch(
      fetchGetHistory({
        shift: history.length,
        chatId: context.chatId,
      })
    );
  };

  const resizeObserver = useRef<ResizeObserver>();
  const resizeObserverRef = (node: any) => {
    if (resizeObserver.current) resizeObserver.current.disconnect();
    resizeObserver.current = new ResizeObserver((entries) => {
      if (compareCurrentHistorySize(true) && loadingStatus.isLoaded) {
        scrollerRef.current.scrollTop = node.scrollHeight - scrollHeightRef.current;
        dispatch(setCurrentChatStatus({ loading: { ...loadingStatus, isLoaded: null } }));
      }
    });
    if (node) resizeObserver.current.observe(node);
  };

  const handleScroll = (e: any) => {
    const elem = e.target as HTMLDivElement;
    elem.scrollHeight - elem.scrollTop - elem.clientHeight > 1000 ? setShowScroller(true) : setShowScroller(false);
    elem.scrollTop >> 0 === elem.scrollHeight - elem.clientHeight ? setScrollIsBottom(true) : setScrollIsBottom(false);
  };

  const renderPreloader = () => {
    let result = [];
    for (let i = 0; i * 80 < document.body.clientHeight; i++) {
      result.push(<MessagePreloader key={i} />);
    }
    return result;
  };

  return (
    <div className={s.wrapper}>
      <div
        className={classNames({ [s.scroller_inner]: true, [s.is_bottom]: scrollIsBottom })}
        ref={scrollerRef}
        onScroll={handleScroll}
      >
        <div className={s.resizer} ref={resizeObserverRef}>
          <InfiniteScroll
            next={loadNextMessages}
            hasMore={loadingStatus.hasMore || !fullLoadedChats.includes(context.chatId)}
            loading={!!loadingStatus.isLoading}
            getScroll={saveCurrentScroll}
            end={
              <div className={s.greetings}>
                Добро пожаловать! <br /> Ниже начинается ваша история
              </div>
            }
          >
            {isRendered ? renderMessages : <div>{renderPreloader()}</div>}
          </InfiniteScroll>
        </div>
        <div className={classNames({ [s.overflow_anchor]: true, [s.is_bottom]: scrollIsBottom })} ref={anchorRef}></div>
      </div>
      {showScroller && <BottomScroller scroll={smoothScrollToBottom} />}
    </div>
  );
};

export default ChatScroller;
