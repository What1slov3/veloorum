import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import reactStringReplace from 'react-string-replace';
import TimeFormatter from '@common/utils/TimeFormatter';
import { Store } from '@customTypes/common.types';
import { MessageContent, MessageContext, MessageSystemType } from '@customTypes/redux/chats.types';
import { LoadedUser } from '@customTypes/redux/users.types';
import Tooltip from '@components/Tooltip/Tooltip';
import s from './channelsystemmessage.module.css';

type Props = {
  content: MessageContent | { text: ReactNode[] };
  uuid: string;
  context: MessageContext;
  createdAt: number;
  systemType: MessageSystemType;
  targetUser?: LoadedUser;
};

const replaceSystemTemplate = (text: string | ReactNode[], username: string, channelName: string) => {
  return reactStringReplace(text, /(:username:|:channel_name:)/gm, (match) => {
    const replaced = match === ':username:' ? username : channelName;
    return <span className={s.highlight}>{replaced}</span>;
  });
};

const ChannelSystemMessage: React.FC<Props> = ({
  content,
  context,
  createdAt,
  systemType,
  targetUser,
}): JSX.Element => {
  const channelName = useSelector((state: Store) => state.channels[context.channelId].title);

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
        <Tooltip position="top" text={new TimeFormatter(createdAt).getFullMessageTime()}>
          <div className={s.time}>{new TimeFormatter(createdAt).getMessageTimeShort()}</div>
        </Tooltip>
      </div>
      <div className={s.content_wrapper}>
        <div className={s.content}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default ChannelSystemMessage;
