import DOMPurify from 'dompurify';
import React, { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { kec } from '../../../..';
import { unwrapAllFormatting } from '../../../../common/utils/contentMessageWrapper';
import { setDisableMessageAutofocus } from '../../../../store/appdata';
import { fetchEditMessage } from '../../../../store/chats/thunk';
import { TMessageContext } from '../../../../store/chats/types';
import Spacer from '../../../../templates/Spacer';
import EmojiMenu from '../../../EmojiMenu/EmojiMenu';
import s from './messageeditor.module.css';

type TProps = {
  placeholder?: string;
  uid: string;
  context: TMessageContext;
  messageContent: string;
  mid: string;
  setEditingMode: (uuid: string | null) => void;
};

const focusInEnd = (ref: MutableRefObject<any>) => {
  ref.current.focus();
  document.execCommand('selectAll', false, undefined);
  document.getSelection()!.collapseToEnd();
};

const ChannelInput: React.FC<TProps> = ({
  placeholder,
  uid,
  context,
  messageContent,
  setEditingMode,
  mid,
}): JSX.Element => {
  const dispatch = useDispatch();

  const pressedKeysRef = useRef<string[]>([]);
  const inputRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    focusInEnd(inputRef);
    kec.add('onkeydown', 'closeMessageEditor', (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        dispatch(setEditingMode(null));
      }
    });

    return () => {
      kec.remove('onkeydown', 'closeMessageEditor');
    };
  }, []);

  const onMessageEdit = () => {
    const it = inputRef.current.innerText;
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
        <Spacer width={10} />
        <EmojiMenu emojiSetter={writeEmoji} />
      </div>
      <Spacer height={5} />
      <div className={s.control}>
        <span onClick={() => setEditingMode(null)}>esc</span> для отмены, <span onClick={onMessageEdit}>enter</span>{' '}
        редактировать
      </div>
    </div>
  );
};

export default ChannelInput;
