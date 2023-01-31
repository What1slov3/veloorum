import React from 'react';
import s from './messagesymbollimit.module.css';

type Props = {
  length: number;
  limit: number;
};

const MessageSymbolLimit: React.FC<Props> = ({ length, limit }): JSX.Element => {
  return (
    <div className={s.wrapper}>
      {length}/{limit}
    </div>
  );
};

export default MessageSymbolLimit;
