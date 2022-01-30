import React, { MouseEventHandler } from 'react';
import { TEmoji } from '../../../assets/emojis';
import s from './emojiicon.module.css';

type TProps = {
  onClick: (shortname: string, emoji: string) => void;
  hover: (emoji: TEmoji) => void;
  emoji: TEmoji;
};

const EmojiIcon: React.FC<TProps> = ({ onClick, emoji, hover }): JSX.Element => {
  const handleHover = () => {
    hover(emoji);
  };

  const handleClick = () => {
    onClick(emoji.shortname, emoji.emoji);
  }

  return (
    <div className={s.emoji_icon} onClick={handleClick} onMouseEnter={handleHover}>
      {emoji.emoji}
    </div>
  );
};

export default EmojiIcon;
