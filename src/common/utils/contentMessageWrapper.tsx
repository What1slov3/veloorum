import reactStringReplace from 'react-string-replace';
import emojiList from '../../assets/emojiList';
import Tooltip from '@components/Tooltip/Tooltip';

// TODO переписать с нуля на лучшее решение
export const contentWrappers = {
  wrapUrl: (text: string) => {
    return reactStringReplace(text, /(https?:\/\/\S+)/gim, (match, i) => {
      return (
        <a key={match + i} href={match} target="_blank" className="message_content_url">
          {match}
        </a>
      );
    });
  },
  wrapEmoji: (text: string) => {
    const regex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gm;

    return reactStringReplace(text, regex, (match, i) => {
      const shortname = Object.keys(emojiList).find(
        (key: string) => emojiList[key as keyof typeof emojiList] === match
      );
      return (
        <Tooltip
          key={match + i}
          style={{ display: 'inline-block' }}
          position="top"
          text={shortname || 'Данный символ не имеет полной поддержки Unicode \n Поэтому может быть видоизменен'}
        >
          {match}
        </Tooltip>
      );
    });
  },
  wrapEmojiShortname: (text: any) => {
    const regex = /\:(.*?)\:/gm;

    return reactStringReplace(text, regex, (match, i) => {
      const emoji = emojiList[`:${match}:` as keyof typeof emojiList];
      if (emoji) {
        return (
          <Tooltip
            key={match + i}
            style={{ display: 'inline-block' }}
            position="top"
            text={match || 'Данный символ не имеет полной поддержки Unicode \n Поэтому может быть видоизменен'}
          >
            {emoji}
          </Tooltip>
        );
      }
      return text;
    });
  },
  wrapBoldText: (text: any, saveSymbols?: boolean) => {
    const regex = /\*\*(.*?)\*\*/gm;

    return reactStringReplace(text, regex, (match, i) => {
      return saveSymbols ? (
        <span style={{ color: 'var(--campfire)' }}>
          **<b key={match + i}>{match}</b>**
        </span>
      ) : (
        <b key={match + i}>{match}</b>
      );
    });
  },
  wrapItalicText: (text: any, saveSymbols?: boolean) => {
    const regex = /\*(.*?)\*/gm;

    return reactStringReplace(text, regex, (match, i) => {
      return saveSymbols ? (
        <span style={{ color: 'var(--campfire)' }}>
          *<i key={match + i}>{match}</i>*
        </span>
      ) : (
        <i key={match + i}>{match}</i>
      );
    });
  },
  wrapStrikeText: (text: any, saveSymbols?: boolean) => {
    const regex = /\~\~(.*?)\~\~/gm;

    return reactStringReplace(text, regex, (match, i) => {
      return saveSymbols ? (
        <span style={{ color: 'var(--campfire)' }}>
          ~~
          <span key={match + i} style={{ textDecoration: 'line-through' }}>
            {match}
          </span>
          ~~
        </span>
      ) : (
        <span key={match + i} style={{ textDecoration: 'line-through' }}>
          {match}
        </span>
      );
    });
  },
};

export const wrapAllFormatting = (text: any) => {
  for (let key in contentWrappers) {
    text = contentWrappers[key as keyof typeof contentWrappers](text);
  }
  return text;
};

export const wrapAllFormattingInput = (text: any) => {
  for (let key in contentWrappers) {
    //@ts-ignore
    text = contentWrappers[key as keyof typeof contentWrappers](text, true);
  }
  return text;
};

const unwrapBold = (text: string) => {
  return text.replaceAll(/\<b data-reactroot="">(.*?)\<\/b>/gm, (match: string) => {
    return `**${match}**`;
  });
};

const unwrapItalic = (text: string) => {
  return text.replaceAll(/\<i data-reactroot="">(.*?)\<\/i>/gm, (match: string) => {
    return `*${match}*`;
  });
};

const unwrapStrike = (text: string) => {
  return text.replaceAll(
    /\<span style="text-decoration:line-through" data-reactroot="">(.*?)\<\/span>/gm,
    (match: string) => {
      return `~~${match}~~`;
    }
  );
};

export const unwrapAllFormatting = (text: string) => {
  return unwrapBold(unwrapItalic(unwrapStrike(text)));
};
