import React, { useCallback, useMemo, useRef, useState } from 'react';
import { TEmoji } from '../../../assets/emojis';
import EmojiIcon from '../EmojiIcon/EmojiIcon';
import s from './emojicategoryblock.module.css';

type TProps = {
  ec: Record<string, TEmoji[]>;
  hover: (emoji: TEmoji) => void;
  emojiSetter: (shortname: string, emoji: string) => void;
  precalculatedHeight: number;
};

const categoryNameRu: Record<string, string> = {
  'Smileys & Emotion': 'Смайлы и эмоции',
  'People & Body': 'Люди',
  Symbols: 'Символы',
  'Food & Drink': 'Еда и напитки',
  Activities: 'Спорт',
  'Animals & Nature': 'Животные и природа',
  Objects: 'Объекты',
  'Travel & Places': 'Путешествия',
};

const EmojiCategoryBlock: React.FC<TProps> = ({ ec, hover, emojiSetter, precalculatedHeight }): JSX.Element => {
  const [show, setShow] = useState(false);

  const intersectionObserver = useRef<IntersectionObserver>();
  const observer = useCallback((node) => {
    if (intersectionObserver.current) intersectionObserver.current.disconnect();
    intersectionObserver.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
    if (node) intersectionObserver.current.observe(node);
  }, []);

  const renderEmojis = useMemo(() => {
    return ec[Object.keys(ec)[0]].map((emoji) => {
      return <EmojiIcon emoji={emoji} hover={hover} onClick={emojiSetter} />;
    });
  }, []);

  return (
    <div className={s.wrapper} ref={observer}>
      {show ? (
        <>
          <div className={s.emoji_category_name}>{categoryNameRu[Object.keys(ec)[0]]}</div>
          <div className={s.emoji_category_list}>{renderEmojis}</div>
        </>
      ) : (
        <div style={{ height: `${precalculatedHeight}px` }}></div>
      )}
    </div>
  );
};

export default React.memo(EmojiCategoryBlock);
