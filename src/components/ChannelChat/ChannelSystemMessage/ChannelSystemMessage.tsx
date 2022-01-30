import React, { useState } from 'react';
import TimeFormatter from '../../../common/utils/TimeFormatter';
import { TMessageContent, TMessageContext, TMessageSystemType } from '../../../store/chats/types';
import { TLoadedUser } from '../../../store/users/types';
import Tooltip from '../../TooltipWrapper/Tooltip/Tooltip';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';
import s from './channelsystemmessage.module.css';

type TProps = {
  content: TMessageContent | { text: React.ReactNodeArray };
  uuid: string;
  context: TMessageContext;
  createdAt: number;
  systemType: TMessageSystemType;
  targetUser?: TLoadedUser;
};

const ChannelSystemMessage: React.FC<TProps> = ({
  content,
  context,
  createdAt,
  systemType,
  targetUser,
}): JSX.Element => {
  const renderContent = () => {
    //TODO расширение системных типов
    if (systemType === 'new_user' && targetUser) {
      return (
        <>
          {content.text} <span className={s.username}>{targetUser.username}</span>
        </>
      );
    }
  };

  return (
    <div className={`${s.wrapper} ${s[systemType]}`}>
      <div className={s.time_wrapper}>
        <TooltipWrapper
          position="top"
          tooltipContent={<Tooltip>{new TimeFormatter(createdAt).getFullMessageTime()}</Tooltip>}
        >
          <div className={s.time}>{new TimeFormatter(createdAt).getMessageTimeShort()}</div>
        </TooltipWrapper>
      </div>
      <div className={s.content_wrapper}>
        <div className={s.content}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default ChannelSystemMessage;
