import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { undefinedUser } from '../../common/undefinedUser';
import { TChannel } from '../../store/channels/types';
import InputTitle from '../../templates/Inputs/InputTitle/InputTitle';
import { TStore } from '../../types/common';
import ChannelMemberCard from './ChannelMemberCard/ChannelMemberCard';
import s from './channelmemberslist.module.css';

type TProps = {
  channel: TChannel;
};

const ChannelMembersList: React.FC<TProps> = ({ channel }): JSX.Element => {
  const loadedUsers = useSelector((state: TStore) => state.users);
  const user = useSelector((state: TStore) => state.user);

  const renderUsersCard = useMemo(() => {
    const sortedMembers = [...channel.members].sort((a, b) => {
      if (a === channel.ownerId || b === channel.ownerId) return 1;
      return loadedUsers[a]?.username.localeCompare(loadedUsers[b]?.username);
    });

    return sortedMembers.map((uid, index) => {
      const isMe = user.uuid === uid;
      const member = isMe ? user : loadedUsers[uid] || undefinedUser;
      if (member) {
        if (index === 0) {
          return (
            <ChannelMemberCard
              key={uid}
              username={member.username}
              avatar={member.avatarUrl}
              icon={<i className="fas fa-crown" style={{ color: 'var(--yellow)' }}></i>}
            />
          );
        }
        return <ChannelMemberCard key={uid} username={member.username} avatar={member.avatarUrl} />;
      }
    });
  }, [channel.members, loadedUsers]);

  return (
    <div className={s.wrapper}>
      <InputTitle>Участники - {channel.members.length}</InputTitle>
      <div>{renderUsersCard}</div>
    </div>
  );
};

export default ChannelMembersList;
