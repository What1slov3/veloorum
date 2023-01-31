import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveChatId } from '@store/appdata';
import Tooltip from '@components/Tooltip/Tooltip';
import s from './chatlink.module.css';

type Props = {
  title: string;
  uuid: string;
  active?: boolean;
  openChatSettings: (chatId: string) => void;
  isAdmin: boolean;
  activeChannelId: string;
};

const ChatLink: React.FC<Props> = ({
  title,
  uuid,
  active,
  openChatSettings,
  isAdmin,
  activeChannelId,
}): JSX.Element => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const setChatHistoryLink = () => {
    navigate(`/channel/${activeChannelId}/${uuid}`);
  };

  const selectChat = () => {
    setChatHistoryLink();
    dispatch(setActiveChatId(uuid));
  };

  const openChatSettingsHandle = () => {
    openChatSettings(uuid);
  };

  return (
    <div className={s.wrapper} id={active ? s.active : undefined}>
      <div className={s.chat_name} onClick={selectChat}>
        <span>#</span>
        <span>{title}</span>
      </div>
      {isAdmin && (
        <div className={s.context_menu}>
          <Tooltip position="top" text="Настройки">
            <i className={`fas fa-ellipsis-h ${s.chat_settings}`} onClick={openChatSettingsHandle}></i>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default ChatLink;
