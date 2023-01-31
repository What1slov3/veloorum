import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@customTypes/common.types';
import Avatar from '@components/Avatar/Avatar';
import ChannelCard from './ChannelCard/ChannelCard';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { setActiveChannelId, setModal } from '@store/appdata';
import { MODAL_NAMES } from '@common/constants';
import Tooltip from '@components/Tooltip/Tooltip';
import s from './navbar.module.css';

const Navbar: React.FC = (): JSX.Element => {
  const dispatch = useDispatch<any>();

  const user = useSelector((state: Store) => state.user);
  const channels = useSelector((state: Store) => state.channels);
  const activeChannelId = useSelector((state: Store) => state.appdata.activeConnection.channelId);

  const serversListRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    function mouseWheelHandler(e: WheelEvent) {
      serversListRef.current.scrollLeft += e.deltaY / 3;
    }

    serversListRef.current?.addEventListener('wheel', mouseWheelHandler);

    const serverListCurrent = serversListRef.current;

    return () => {
      serverListCurrent?.removeEventListener('wheel', mouseWheelHandler);
    };
  }, [serversListRef]);

  const renderChannels = () => {
    return Object.keys(channels).map((cid) => {
      const channel = channels[cid];

      function selectChannel() {
        dispatch(setActiveChannelId(channel.uuid));
      }

      return (
        <Tooltip key={channel.uuid} position="bottom" text={channel.title}>
          <ChannelCard
            uuid={channel.uuid}
            channelName={channel.title || ''}
            type={channel.type}
            iconUrl={channel.iconUrl}
            onlineCount={1}
            usersCount={channel.members.length}
            mainChatId={channel.chats[0]}
            isActive={activeChannelId === channel.uuid}
            onClick={selectChannel}
          />
        </Tooltip>
      );
    });
  };

  const openCreateChannelModal = () => {
    dispatch(setModal({ name: MODAL_NAMES.CREATE_CHANNEL, payload: {} }));
  };

  return (
    <>
      <div className={s.wrapper}>
        <div className={s.left_side}>
          <NavLink
            to="/"
            className={({ isActive }) => classNames({ [s.logo_wrapper]: true, [s.active_logo]: isActive })}
          >
            <div className={s.logo}></div>
          </NavLink>
          <div className={s.line}></div>
          <div className={s.userData}>
            <div>
              <Avatar
                url={user.avatarUrl}
                style={{ height: '45px', width: '45px' }}
                username={user.username}
                avatarColor={user.avatarColor}
              />
              <Tooltip
                position="bottom"
                text="Нажмите, чтобы скопировать Нажмите, чтобы скопировать Нажмите, чтобы скопировать "
                delay={500}
              >
                <div className={s.userData_info}>
                  <div className={s.username}>{user.username}</div>
                  <div className={s.tag}>#{user.tag}</div>
                </div>
              </Tooltip>
            </div>
            <div className={s.userData_control}>
              <Tooltip position="bottom" text="Настройки">
                <Link to="/settings/profile">
                  <i className={`fas fa-cog ${s.settings}`}></i>
                </Link>
              </Tooltip>
            </div>
          </div>
          <div className={s.line}></div>
        </div>
        <div className={s.serversList_wrapper}>
          <div className={s.serversList_control}>
            <Tooltip position="bottom" text="Создать канал">
              <i className="fas fa-plus-circle" onClick={openCreateChannelModal}></i>
            </Tooltip>
          </div>
          <div className={s.serversList_list} ref={serversListRef}>
            {renderChannels()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
