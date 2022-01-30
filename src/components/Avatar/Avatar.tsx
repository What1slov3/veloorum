import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import s from './avatar.module.css';

type TProps = {
  url: string;
  style?: CSSProperties;
  username?: string;
  saveColor?: boolean;
};

const randomColor = () => {
  return `rgb(${(Math.random() * 255) >> 0}, ${(Math.random() * 255) >> 0}, ${(Math.random() * 255) >> 0})`;
};

const Avatar: React.FC<TProps> = ({ url, style, username, saveColor = false }): JSX.Element => {
  const [color, setColor] = useState<string>('');
  const [fz, setFz] = useState<string>('16px');

  const stubRef = useRef<HTMLDivElement>(null!);

  // TODO сделать сохранение цвета под каждого юзера отдельно

  useEffect(() => {
    if (!url && username) {
      const color = randomColor();
      setColor(color);
    }
  }, [url]);

  useEffect(() => {
    if (stubRef) setFz(`${(stubRef.current?.getBoundingClientRect().width || 100) * 0.4}px`);
  }, [stubRef]);

  //TODO Добавить генерацию пре-аватаров на бекенде и их удаление после смены авы
  return url ? (
    <img src={url} alt="avatar" style={style} className={s.avatar} />
  ) : (
    <div className={s.stub} ref={stubRef} style={{ ...style, background: color, fontSize: fz }}>
      {username?.slice(0, 2)}
    </div>
  );
};

export default Avatar;
