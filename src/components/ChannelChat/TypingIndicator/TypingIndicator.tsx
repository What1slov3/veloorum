import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { undefinedUser } from '@common/undefinedUser';
import { Store } from '@customTypes/common.types';
import { MessageContext } from '@customTypes/redux/chats.types';
import { UsersStore } from '@customTypes/redux/users.types';

import s from './typingindicator.module.css';

type Props = {
  context: MessageContext;
  loadedUsers: UsersStore;
  uid: string;
};

const TypingIndicator: React.FC<Props> = ({ context, loadedUsers, uid }): JSX.Element => {
  const typingUsers = useSelector((state: Store) => state.appdata.typingUsers);

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(Boolean(typingUsers[context.chatId]?.filter((typingUid) => typingUid !== uid).length));
  }, [context, typingUsers]);

  const renderTypingUser = () => {
    if (typingUsers[context.chatId]) {
      const slicedTyping = typingUsers[context.chatId].filter((typingUid) => typingUid !== uid).slice(0, 5);
      return slicedTyping.map((uid, index) => {
        return (
          <>
            <span>
              {loadedUsers[uid]?.username || undefinedUser.username}
              {index !== slicedTyping.length - 1 && ', '}
            </span>
            {index === slicedTyping.length - 1 &&
              ` ${slicedTyping.length == 1 ? 'что-то печатает' : 'что-то печатают'}`}
          </>
        );
      });
    }
  };

  return (
    <div className={s.wrapper}>
      {show && (
        <>
          <div className={s.users}>{renderTypingUser()}</div>
          <div className={s.indicator_animation}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </>
      )}
    </div>
  );
};

export default TypingIndicator;
