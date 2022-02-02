import React from 'react';
import s from './messagesymbollimit.module.css';

type TProps = {
  length: number;
  limit: number;
};

const MessageSymbolLimit: React.FC<TProps> = ({ length, limit }): JSX.Element => {
  return (
    <div className={s.wrapper}>
      {length}/{limit}
    </div>
  );
};

export default MessageSymbolLimit;
