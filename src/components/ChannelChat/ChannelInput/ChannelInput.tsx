import React, { FormEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { kec, lsa } from '../../..';
import { fetchSendMessage } from '../../../store/chats/thunk';
import Spacer from '../../../templates/Spacer';
import { TStore } from '../../../types/common';
import EmojiMenu from '../../EmojiMenu/EmojiMenu';
import { focusInEnd } from '../../../common/utils/focusInEnd';
import { TMessageContext } from '../../../store/chats/types';
import { addTypingUsers, resetAttachments, setUploadedAttachments } from '../../../store/appdata';
import AttachmentBar from './AttachmentBar/AttachmentBar';
import API from '../../../api';
import AttachmentLoader from './AttachmentLoader/AttachmentLoader';
import MessageSymbolLimit from './MessageSymbolLimit/MessageSymbolLimit';
import s from './channelinput.module.css';
import { MAX_SYMBOLS_LIMIT_DEFAULT } from '../../../common/constants';

type TProps = {
  placeholder?: string;
  chatTitle: string;
  uid: string;
  context: TMessageContext;
  scrollToBottom: Function | MutableRefObject<() => void>;
  openSymbolLimitModal: (payload: [number, number]) => void;
  disable?: boolean;
};

const keyException = [
  'Esc',
  'Tab',
  'CapsLock',
  'Shift',
  'Control',
  'Alt',
  'Insert',
  'Delete',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'PrintScreen',
  'ScrollLock',
  'Pause',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
];

const ChannelInput: React.FC<TProps> = ({
  placeholder,
  uid,
  context,
  scrollToBottom,
  openSymbolLimitModal,
  disable,
}): JSX.Element => {
  const dispatch = useDispatch();

  const disableMessageAutofocus = useSelector((state: TStore) => state.appdata.disableMessageAutofocus);
  const modalIsActive = useSelector((state: TStore) => state.appdata.modalIsActive);
  const uploadedAttachments = useSelector((state: TStore) => state.appdata.uploadedAttachments);

  const [inFocus, setIsFocus] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [symbolLimit, setSymbolLimit] = useState(0);

  const pressedKeysRef = useRef<string[]>([]);
  const inputRef = useRef<HTMLDivElement>(null!);
  const typingSenderRef = useRef<any>();
  const typingCheckerRef = useRef<any>();

  // ? Обработчики нажатия для автофокуса
  useEffect(() => {
    kec.add('onkeydown', 'chatInput', (e: KeyboardEvent) => {
      if (!inFocus && !disableMessageAutofocus && !modalIsActive) {
        addPressedKey(e.key);
        if (
          (!keyException.includes(e.key) || (e.key === 'Enter' && pressedKeysRef.current.includes('Shift'))) &&
          !(e.code === 'KeyC' && pressedKeysRef.current.includes('Control')) &&
          inputRef.current
        ) {
          focusInEnd(inputRef);
        }
      }
    });
    kec.add('onkeyup', 'chatInput', (e: KeyboardEvent) => {
      deletePressedKey(e.key);
    });
  }, [inputRef, pressedKeysRef, inFocus, disableMessageAutofocus, modalIsActive]);

  // ? Проверка на набранное когда-то сообщение в данном чате
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.innerText = lsa.getUnsentMessage(context.chatId)?.text || '';
      handlerSymbolLimit(inputRef.current.innerText.length);
    }
  }, [inputRef, context]);

  // ? Сброс вложений при смене чата
  useEffect(() => {
    setAttachments([]);
  }, [context.chatId]);

  // ? Проверка на сохраненное неотправленное сообщение с вложением
  // ? Сохранение вложения в local storage
  useEffect(() => {
    if (uploadedAttachments) {
      const attachments = uploadedAttachments[context.chatId];

      if (attachments) {
        setAttachments(attachments);
        lsa.saveUnsentMessage({
          content: { attachments: attachments, text: inputRef.current.innerText },
          context,
        });
      }
    }

    const unsentMessage = lsa.getUnsentMessage(context.chatId)?.attachments;
    if (unsentMessage) setAttachments(unsentMessage!);
  }, [uploadedAttachments, inputRef, context]);

  // ? Если было загруженно вложение -> скроллим вниз
  useEffect(() => {
    if (uploadedAttachments[context?.chatId]) {
      typeof scrollToBottom === 'object' ? scrollToBottom.current() : scrollToBottom();
    }
  }, [uploadedAttachments[context?.chatId], scrollToBottom, uploadedAttachments]);

  // ? Контроль за набором текста
  useEffect(() => {
    if (isTyping && !typingSenderRef.current) {
      dispatch(addTypingUsers({ cid: context.chatId, uid }));
      typingSenderRef.current = setInterval(() => {
        dispatch(addTypingUsers({ cid: context.chatId, uid }));
      }, 1000);
    }
    if (!isTyping && typingSenderRef.current) {
      clearInterval(typingSenderRef.current);
      typingSenderRef.current = null;
    }
  }, [isTyping, typingSenderRef.current, context.chatId, uid]);

  // ? Обработчик нажатия на поле ввода
  const keyPressedController = (e: React.KeyboardEvent<HTMLDivElement>) => {
    addPressedKey(e.key);

    switch (e.key) {
      case 'Enter':
        if (!pressedKeysRef.current.includes('Shift')) {
          e.preventDefault();
          onMessageSend();
        }
        break;
    }
  };
  const keyUnpressedController = (e: React.KeyboardEvent<HTMLDivElement>) => {
    deletePressedKey(e.key);
  };
  const addPressedKey = (key: string) => {
    pressedKeysRef.current.push(key);
  };
  const deletePressedKey = (key: string) => {
    pressedKeysRef.current = pressedKeysRef.current.filter((item) => item !== key);
  };

  // ? Контроль за переменной индикации набора текста
  const handleTyping = () => {
    if (!isTyping) setIsTyping(true);
    if (typingCheckerRef.current) {
      clearTimeout(typingCheckerRef.current);
      typingCheckerRef.current = null;
    }
    if (!typingCheckerRef.current) {
      typingCheckerRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };

  // ? Чистим текст от стилей при вставке
  const handlePaste = (e: any) => {
    e.preventDefault();
    let clipboardData = e.clipboardData;
    let pastedData: string = clipboardData.getData('text/plain');
    window.document.execCommand('insertText', false, pastedData);

    if (clipboardData.files.length) handleLoadAttachment({ target: { files: clipboardData.files } });
  };

  const handlerSymbolLimit = (length: number) => {
    if (length > MAX_SYMBOLS_LIMIT_DEFAULT) setSymbolLimit(length);
    if (length <= MAX_SYMBOLS_LIMIT_DEFAULT && symbolLimit) setSymbolLimit(0);
  };

  // ? Обработка ввода текста на поле ввода
  const handleInput = (e: FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.innerHTML === '<br>') target.innerText = '';
    lsa.saveUnsentMessage({ content: { text: target.innerText }, context });
    handleTyping();
    handlerSymbolLimit(target.innerText.length);
  };

  // ? Сеттер эмоджи, прокидываем в emoji menu
  const writeEmoji = useCallback((shortname: string, emoji: string) => {
    inputRef.current.innerText += emoji;

    const len = inputRef.current.innerHTML.length;
    const html = inputRef.current.innerHTML;
    if (html.slice(len - 1 - 5, len - 2) === '<br>') {
      inputRef.current.innerHTML = html.substring(0, len - 1 - 5) + html.substring(len - 2);
    }
  }, []);

  // ? Загрузка файлов из FileList
  const handleLoadAttachment = async (e: any) => {
    const files: File[] = [];
    [...e.target.files].slice(0, 3).forEach((file: File) => {
      if (file.type.startsWith('image/')) files.push(file);
    });
    if (!files) return;

    const urls = await API.files.UploadFiles(files);
    if (urls) {
      setAttachments(urls);
      dispatch(setUploadedAttachments({ cid: context.chatId, urls }));
    }
  };

  // ? Отправка сообщения и сброс всех полей
  const onMessageSend = () => {
    const it = inputRef.current.innerText;
    if (symbolLimit) {
      openSymbolLimitModal([symbolLimit, MAX_SYMBOLS_LIMIT_DEFAULT]);
    } else {
      if ((it && it.trim()) || attachments.length) {
        dispatch(
          fetchSendMessage({
            context,
            content: { text: it.trim(), attachments },
          })
        );
        typeof scrollToBottom === 'object' ? scrollToBottom.current() : scrollToBottom();
        dispatch(resetAttachments(context.chatId));
        lsa.resetUnsentMessage(context.chatId);
        setAttachments([]);
        resetText();
      }
    }
  };

  const resetText = () => {
    inputRef.current.innerText = '';
  };

  return (
    <div className={s.wrapper}>
      {attachments && <AttachmentBar urls={attachments} context={context} />}
      <div className={s.control}>
        {disable ? (
          <div className={s.disable}>Вы не можете писать в этот чат</div>
        ) : (
          <>
            <AttachmentLoader onChange={handleLoadAttachment} />
            <Spacer width={10} />
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
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            ></div>
            <Spacer width={10} />
            <EmojiMenu emojiSetter={writeEmoji} />
          </>
        )}
      </div>
      {symbolLimit > 0 && (
        <MessageSymbolLimit length={inputRef.current?.textContent?.length || 0} limit={MAX_SYMBOLS_LIMIT_DEFAULT} />
      )}
    </div>
  );
};

export default ChannelInput;
