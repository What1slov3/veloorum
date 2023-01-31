import React from 'react';
import { Emoji } from '@customTypes/emoji.types';
import s from './emojiicon.module.css';

type Props = {
  onClick: (shortname: string, emoji: string) => void;
  hover: (emoji: Emoji) => void;
  emoji: Emoji;
};

const EmojiIcon: React.FC<Props> = ({ onClick, emoji, hover }): JSX.Element => {
  const handleHover = () => {
    hover(emoji);
  };

  const handleClick = () => {
    onClick(emoji.shortname, emoji.emoji);
  };

  return (
    <div className={s.emoji_icon} onClick={handleClick} onMouseEnter={handleHover}>
      {emoji.emoji}
    </div>
  );
};

export default EmojiIcon;
