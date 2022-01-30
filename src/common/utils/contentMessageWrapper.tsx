import reactStringReplace from 'react-string-replace';
import emojiList from '../../assets/emojiList';
import Tooltip from '../../components/TooltipWrapper/Tooltip/Tooltip';
import TooltipWrapper from '../../components/TooltipWrapper/TooltipWrapper';

export const wrapUrl = (text: string) => {
  return reactStringReplace(text, /(https?:\/\/\S+)/gim, (match, i) => {
    return (
      <a key={match + i} href={match} target="_blank" className="message_content_url">
        {match}
      </a>
    );
  });
};

export const wrapEmoji = (text: any) => {
  const regex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gm;

  return reactStringReplace(text, regex, (match, i) => {
    //@ts-ignore
    const shortname = Object.keys(emojiList).find((key: string) => emojiList[key] === match);
    return (
      <TooltipWrapper
        key={match + i}
        style={{ display: 'inline-block' }}
        position="top"
        tooltipContent={
          <Tooltip>
            {shortname || 'Данный символ не имеет полной поддержки Unicode \n Поэтому может быть видоизменен'}
          </Tooltip>
        }
      >
        {match}
      </TooltipWrapper>
    );
  });
};

export const wrapEmojiShortname = (text: any) => {
  const regex = /\:(.*?)\:/gm;

  return reactStringReplace(text, regex, (match, i) => {
    //@ts-ignore
    const emoji = emojiList[`:${match}:`];
    if (emoji) {
      return (
        <TooltipWrapper
          key={match + i}
          style={{ display: 'inline-block' }}
          position="top"
          tooltipContent={
            <Tooltip>
              {match || 'Данный символ не имеет полной поддержки Unicode \n Поэтому может быть видоизменен'}
            </Tooltip>
          }
        >
          {emoji}
        </TooltipWrapper>
      );
    }
    return text;
  });
};

export const wrapBoldText = (text: any, saveSymbols?: boolean) => {
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
};

export const wrapItalicText = (text: any, saveSymbols?: boolean) => {
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
};

export const wrapStrikeText = (text: any, saveSymbols?: boolean) => {
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
};

// TODO рефактор
// TODO сделать независимым от ненужных атрибутов
export const wrapAllFormatting = (text: any) => {
  return wrapStrikeText(wrapItalicText(wrapBoldText(wrapEmojiShortname(wrapEmoji(wrapUrl(text))))));
};

export const wrapAllFormattingInput = (text: any) => {
  return wrapStrikeText(wrapItalicText(wrapBoldText(wrapEmojiShortname(wrapEmoji(text)), true), true), true);
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
