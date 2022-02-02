import React from 'react';
import { useSelector } from 'react-redux';
import reactStringReplace from 'react-string-replace';
import TimeFormatter from '../../../common/utils/TimeFormatter';
import { TMessageContent, TMessageContext, TMessageSystemType } from '../../../store/chats/types';
import { TLoadedUser } from '../../../store/users/types';
import { TStore } from '../../../types/common';
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

const replaceSystemTemplate = (text: string | React.ReactNodeArray, username: string, channelName: string) => {
  return reactStringReplace(text, /(:username:|:channel_name:)/gm, (match) => {
    const replaced = match === ':username:' ? username : channelName;
    return <span className={s.highlight}>{replaced}</span>;
  });
};

const ChannelSystemMessage: React.FC<TProps> = ({
  content,
  context,
  createdAt,
  systemType,
  targetUser,
}): JSX.Element => {
  const channelName = useSelector((state: TStore) => state.channels[context.channelId].title);

  const renderContent = () => {
    if (['userJoin', 'userLeft'].includes(systemType) && targetUser) {
      return [
        systemType === 'userJoin' ? '-->  ' : systemType === 'userLeft' ? '<--  ' : null,
        replaceSystemTemplate(content.text, targetUser.username, channelName),
      ];
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
