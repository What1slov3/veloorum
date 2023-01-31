import React, { CSSProperties, useEffect } from 'react';
import s from './avatar.module.css';

type Props = {
  url: string;
  style?: CSSProperties;
  username?: string;
  avatarColor?: string;
};

const Avatar: React.FC<Props> = ({ url, style, username, avatarColor }): JSX.Element => {
  const resizeFont = (node: any) => {
    if (node && username) {
      node.style.fontSize = `${(node.getBoundingClientRect().width - 10) / 2}px`;
    }
  };

  return url ? (
    <img src={url} alt="avatar" style={style} className={s.avatar} />
  ) : (
    <div className={s.stub} ref={resizeFont} style={{ ...style, background: avatarColor }}>
      {username?.slice(0, 2)}
    </div>
  );
};

export default Avatar;
