import React, { useCallback, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useDispatch } from 'react-redux';
import { MAX_SYMBOLS_LIMIT_DEFAULT } from '@common/constants';
import { unwrapAllFormatting } from '@common/utils/contentMessageWrapper';
import { setDisableMessageAutofocus } from '@store/appdata';
import { fetchEditMessage } from '@store/chats/thunk';
import { MessageContext } from '@customTypes/redux/chats.types';
import EmojiMenu from '@components/EmojiMenu/EmojiMenu';
import { LimitModal } from '@components/ChannelChat/ChannelChat';
import s from './messageeditor.module.css';

// ! НЕ ИСПОЛЬЗОВАТЬ
// TODO переделать под quill и новую логику работы

type Props = {
  placeholder?: string;
  uid: string;
  context: MessageContext;
  messageContent: string;
  mid: string;
  setEditingMode: (uuid: string | null) => void;
  openSymbolLimitModal: (payload: LimitModal) => void;
};

const ChannelInput: React.FC<Props> = ({
  placeholder,
  uid,
  context,
  messageContent,
  setEditingMode,
  mid,
  openSymbolLimitModal,
}): JSX.Element => {
  const dispatch = useDispatch<any>();

  const pressedKeysRef = useRef<string[]>([]);
  const inputRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    inputRef.current.focus();

    function closeMessageEditor(e: KeyboardEvent) {
      e.code === 'Escape' && setEditingMode(null);
    }

    window.addEventListener('keydown', closeMessageEditor);

    return () => {
      window.removeEventListener('keydown', closeMessageEditor);
    };
  }, []);

  const onMessageEdit = () => {
    const it = inputRef.current.innerText;
    if (it.length > MAX_SYMBOLS_LIMIT_DEFAULT) {
      openSymbolLimitModal({ length: it.length, limit: MAX_SYMBOLS_LIMIT_DEFAULT });
    } else {
      if (it && it.trim() && it.trim() !== DOMPurify.sanitize(messageContent, { USE_PROFILES: { html: false } })) {
        dispatch(
          fetchEditMessage({
            chatId: context.chatId,
            messageId: mid,
            content: { text: it.trim() },
          })
        );
      }
      setEditingMode(null);
    }
  };

  const keyPressedController = (e: React.KeyboardEvent) => {
    addPressedKey(e.key);

    switch (e.key) {
      case 'Enter':
        if (!pressedKeysRef.current.includes('Shift')) {
          e.preventDefault();
          onMessageEdit();
        }
        break;
    }
  };

  const keyUnpressedController = (e: React.KeyboardEvent) => {
    deletePressedKey(e.key);
  };

  const addPressedKey = (key: string) => {
    pressedKeysRef.current.push(key);
  };

  const deletePressedKey = (key: string) => {
    pressedKeysRef.current = pressedKeysRef.current.filter((item) => item !== key);
  };

  const writeEmoji = useCallback((shortname: string, emoji: string) => {
    inputRef.current.innerText += emoji;

    const len = inputRef.current.innerHTML.length;
    const html = inputRef.current.innerHTML;
    if (html.slice(len - 1 - 5, len - 2) === '<br>') {
      inputRef.current.innerHTML = html.substring(0, len - 1 - 5) + html.substring(len - 2);
    }
  }, []);

  const handlePaste = (e: any) => {
    e.preventDefault();
    let clipboardData = e.clipboardData;
    let pastedData: string = clipboardData.getData('text/plain');
    window.document.execCommand('insertText', false, pastedData);
  };

  const handleInput = (e: any) => {
    if (e.target.innerHTML === '<br>') e.target.innerText = '';
  };

  return (
    <div className={s.wrapper}>
      <div className={s.message_wrapper}>
        <div
          className={s.input}
          ref={inputRef}
          contentEditable
          data-text={placeholder || 'Напишите что-то...'}
          data-message-input="true"
          onPaste={handlePaste}
          onInput={handleInput}
          onKeyDown={keyPressedController}
          onKeyUp={keyUnpressedController}
          onFocus={() => dispatch(setDisableMessageAutofocus(true))}
          onBlur={() => dispatch(setDisableMessageAutofocus(false))}
        >
          {DOMPurify.sanitize(unwrapAllFormatting(messageContent.toString()), { USE_PROFILES: { html: false } })}
        </div>
        <EmojiMenu emojiSetter={writeEmoji} />
      </div>
      <div className={s.control}>
        <span onClick={() => setEditingMode(null)}>esc</span> для отмены, <span onClick={onMessageEdit}>enter</span>{' '}
        редактировать
      </div>
    </div>
  );
};

export default ChannelInput;
