import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { undefinedUser } from '../../../common/undefinedUser';
import { TMessageContext } from '../../../store/chats/types';
import { TUsersStore } from '../../../store/users/types';
import Spacer from '../../../templates/Spacer';
import { TStore } from '../../../types/common';

import s from './typingindicator.module.css';

type TProps = {
  context: TMessageContext;
  loadedUsers: TUsersStore;
  uid: string;
};

const TypingIndicator: React.FC<TProps> = ({ context, loadedUsers, uid }): JSX.Element => {
  const typingUsers = useSelector((state: TStore) => state.appdata.typingUsers);

  const [show, setShow] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (typingUsers[context.chatId] && typingUsers[context.chatId].filter((typingUid) => typingUid !== uid).length) {
      setShow(true);
    } else {
      setShow(false);
    }
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
          <Spacer width={5} />
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
