import React, { useCallback, useEffect, useMemo, useState } from 'react';
import emojisShort from '../../assets/emojiList';
import { emojis, TEmoji } from '../../assets/emojis';
import Spacer from '../../templates/Spacer';
import EmojiCategoryBlock from './EmojiCategoryBlock/EmojiCategoryBlock';
import EmojiIcon from './EmojiIcon/EmojiIcon';
import { emojiListPreview } from '../../assets/emojiListPreview';
import { kec } from '../..';
import useInput from '../../common/hooks/useInput';
import { findDatasetInParents } from '../../common/utils/findDataInParents';
import s from './emojimenu.module.css';

const precalculatedDefaultEmojiHeight = [723, 1953, 969, 600, 395, 641, 1092, 1010];

type TProps = {
  emojiSetter: (shortname: string, emoji: string) => void;
};

const EmojiMenu: React.FC<TProps> = ({ emojiSetter }): JSX.Element => {
  const emojiSearch = useInput({ disableAstrofocus: true });

  const getRandomEmoji = (): string => {
    return emojiListPreview[(Math.random() * emojiListPreview.length) >> 0];
  };

  const [previewEmoji, setPreviewEmoji] = useState<string>(getRandomEmoji());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [reviewEmoji, setReviewEmoji] = useState<TEmoji>();

  useEffect(() => {
    kec.add('onmousedown', 'emoji_close', (e: any) => {
      if (isOpen && !findDatasetInParents(e.target, 'emoji')) setIsOpen(false);
    });
  }, [isOpen]);

  const handlePreviewHover = () => {
    if (!isOpen) setPreviewEmoji(getRandomEmoji());
  };

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const showEmojiReview = useCallback((emoji: TEmoji | { shortname: string; emoji: string }) => {
    setReviewEmoji(emoji);
  }, []);

  const renderEmoji = useMemo(() => {
    return emojis.map((ec, index) => {
      return (
        <EmojiCategoryBlock
          key={ec[Object.keys(ec)[0]][0].shortname}
          ec={ec}
          hover={showEmojiReview}
          emojiSetter={emojiSetter}
          precalculatedHeight={precalculatedDefaultEmojiHeight[index]}
        />
      );
    });
  }, []);

  const renderMatchingEmoji = () => {
    const result: JSX.Element[] = [];
    Object.keys(emojisShort).forEach((name: string) => {
      if (name.includes(emojiSearch.value)) {
        result.push(
          <EmojiIcon
            //@ts-ignore
            emoji={{ shortname: name, emoji: emojisShort[name] }}
            hover={showEmojiReview}
            onClick={emojiSetter}
          />
        );
      }
    });
    return result;
  };

  return (
    <div className={s.wrapper}>
      <div className={s.emoji_menu} id={isOpen ? s.open : undefined} data-emoji="true">
        <div className={s.search_block}>
          <input {...emojiSearch} type="text" className={s.searcher} placeholder="Потеряли эмодзи? Найдите!" />
        </div>
        <div
          className={s.emoji_list}
          style={{
            display: emojiSearch.value.trim() ? 'flex' : 'block',
          }}
        >
          {emojiSearch.value.trim() ? renderMatchingEmoji() : renderEmoji}
        </div>
        <div className={s.emoji_review}>
          <div className={s.emoji_review_emoji}>{reviewEmoji?.emoji}</div>
          <Spacer width={10} />
          <div className={s.emoji_review_name}>{reviewEmoji?.shortname}</div>
        </div>
      </div>
      <div
        className={s.emoji_btn}
        id={isOpen ? s.open : undefined}
        onMouseEnter={handlePreviewHover}
        onClick={handleIsOpen}
        data-emoji="true"
      >
        {previewEmoji}
      </div>
    </div>
  );
};

export default EmojiMenu;
