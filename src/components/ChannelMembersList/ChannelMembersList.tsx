import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { undefinedUser } from '@common/undefinedUser';
import InputTitle from '../../templates/Inputs/InputTitle/InputTitle';
import { Store } from '@customTypes/common.types';
import { Channel } from '@customTypes/redux/channels.types';
import UserCardWrapper from '../UserCardWrapper/UserCardWrapper';
import ChannelMemberCard from './ChannelMemberCard/ChannelMemberCard';
import s from './channelmemberslist.module.css';

type Props = {
  channel: Channel;
};

const ChannelMembersList: React.FC<Props> = ({ channel }): JSX.Element => {
  const loadedUsers = useSelector((state: Store) => state.users);
  const user = useSelector((state: Store) => state.user);

  //TODO вынести данные о карточке сюда

  const renderUsersCard = useMemo(() => {
    const collator = new Intl.Collator('ru-RU');

    const sortedMembers: any = [...channel.members].sort((a, b) => {
      if (a === channel.ownerId || b === channel.ownerId) return 1;
      return collator.compare(loadedUsers[a]?.username, loadedUsers[b]?.username);
    });

    return sortedMembers.map((uid: string) => {
      const isMe = user.uuid === uid;
      const member = (isMe ? user : loadedUsers[uid]) || undefinedUser;
      if (uid === channel.ownerId) {
        return (
          <UserCardWrapper user={member} key={uid}>
            <ChannelMemberCard
              key={uid}
              username={member.username}
              avatarUrl={member.avatarUrl}
              avatarColor={member.avatarColor}
              icon={<i className="fas fa-crown" style={{ color: 'var(--yellow)' }}></i>}
            />
          </UserCardWrapper>
        );
      }
      return (
        <UserCardWrapper user={member} key={uid}>
          <ChannelMemberCard
            key={uid}
            username={member.username}
            avatarUrl={member.avatarUrl}
            avatarColor={member.avatarColor}
          />
        </UserCardWrapper>
      );
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
