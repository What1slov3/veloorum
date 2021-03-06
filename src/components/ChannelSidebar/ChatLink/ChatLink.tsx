import React from 'react';
import { useDispatch } from 'react-redux';
import { setActiveChatId } from '../../../store/appdata';
import Spacer from '../../../templates/Spacer';
import { TModalOpenFunc } from '../../../types/hooks';
import Tooltip from '../../TooltipWrapper/Tooltip/Tooltip';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';
import s from './chatlink.module.css';

type TProps = {
  title: string;
  uuid: string;
  active?: boolean;
  openChatSettings: TModalOpenFunc<string>;
  isAdmin: boolean;
};

const ChatLink: React.FC<TProps> = ({ title, uuid, active, openChatSettings, isAdmin }): JSX.Element => {
  const dispatch = useDispatch();

  const selectChat = () => {
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
          <TooltipWrapper position="top" tooltipContent={<Tooltip>Настройки</Tooltip>}>
            <i className={`fas fa-ellipsis-h ${s.chat_settings}`} onClick={openChatSettingsHandle}></i>
          </TooltipWrapper>
        </div>
      )}
    </div>
  );
};

export default ChatLink;
