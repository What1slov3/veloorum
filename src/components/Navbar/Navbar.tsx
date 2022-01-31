import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { TStore } from '../../types/common';
import Avatar from '../Avatar/Avatar';
import Tooltip from '../TooltipWrapper/Tooltip/Tooltip';
import TooltipWrapper from '../TooltipWrapper/TooltipWrapper';
import ChannelCard from './ChannelCard/ChannelCard';
import s from './navbar.module.css';
import Spacer from '../../templates/Spacer';
import useModal from '../../common/hooks/useModal';
import CreateChannelModal from '../Modals/CreateChannelModal/CreateChannelModal';
import { Link } from 'react-router-dom';

const Navbar: React.FC = (): JSX.Element => {
  const user = useSelector((state: TStore) => state.user);
  const channels = useSelector((state: TStore) => state.channels);

  const channelModal = useModal();

  const serversListRef = useRef<HTMLDivElement>(null!);
  const handleMouseWheel = useCallback(
    (e) => {
      //@ts-ignore
      serversListRef.current.scrollLeft += e.deltaY / 3;
    },
    [serversListRef]
  );

  useEffect(() => {
    if (serversListRef.current) {
      serversListRef.current.addEventListener('mousewheel', handleMouseWheel);
    }

    const serverListCurrent = serversListRef.current;

    return () => {
      if (serverListCurrent) {
        serverListCurrent.removeEventListener('mousewheel', handleMouseWheel);
      }
    };
  }, [serversListRef]);

  const renderChannels = () => {
    const ck = Object.keys(channels); // Channel keys
    const cl = ck.length; // Channel length
    return ck.map((cid, index) => {
      const channel = channels[cid];
      return (
        <div key={channel.uuid} style={{ display: 'flex' }}>
          <TooltipWrapper position="bottom" tooltipContent={<Tooltip>{channel.title}</Tooltip>}>
            <ChannelCard
              uuid={channel.uuid}
              channelName={channel.title || ''}
              type={channel.type}
              iconUrl={channel.iconUrl}
              onlineCount={1}
              usersCount={channel.members.length}
            />
          </TooltipWrapper>
          {index !== cl - 1 && <Spacer width={10} />}
        </div>
      );
    });
  };

  return (
    <>
      <div className={s.wrapper}>
        <div className={s.userData}>
          <div>
            <Avatar url={user.avatarUrl} style={{ height: '45px', width: '45px' }} username={user.username} />
            <Spacer width={10} />
            <TooltipWrapper
              position="bottom"
              tooltipContent={<Tooltip>Нажмите, чтобы скопировать</Tooltip>}
              showingDelay={0.5}
            >
              <div className={s.userData_info}>
                <div className={s.username}>{user.username}</div>
                <div className={s.tag}>#{user.tag}</div>
              </div>
            </TooltipWrapper>
          </div>
          <div className={s.userData_control}>
            <TooltipWrapper position="bottom" tooltipContent={<Tooltip>Настройки</Tooltip>}>
              <Link to="/settings/profile">
                <i className={`fas fa-cog ${s.settings}`}></i>
              </Link>
            </TooltipWrapper>
            <Spacer width={10} />
            <div className={s.line}></div>
          </div>
        </div>
        <div className={s.serversList_wrapper}>
          <div className={s.serversList_control}>
            <Spacer width={20} />
            <TooltipWrapper position="bottom" tooltipContent={<Tooltip>Создать канал</Tooltip>}>
              <i className="fas fa-plus-circle" onClick={channelModal.open}></i>
            </TooltipWrapper>
            <Spacer width={20} />
          </div>
          <div className={s.serversList_list} ref={serversListRef}>
            {renderChannels()}
          </div>
        </div>
      </div>
      {channelModal.isOpen && <CreateChannelModal close={channelModal.close} isFading={channelModal.isFading} />}
    </>
  );
};

export default Navbar;
