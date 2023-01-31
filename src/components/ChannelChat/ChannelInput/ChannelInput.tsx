import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lsa, shortcut } from '../../..';
import { fetchSendMessage } from '@store/chats/thunk';
import { Store } from '@customTypes/common.types';
import EmojiMenu from '@components/EmojiMenu/EmojiMenu';
import { addTypingUsers, resetAttachments, setModal, setUploadedAttachments } from '@store/appdata';
import AttachmentBar from './AttachmentBar/AttachmentBar';
import API from '@api/index';
import AttachmentLoader from './AttachmentLoader/AttachmentLoader';
import MessageSymbolLimit from './MessageSymbolLimit/MessageSymbolLimit';
import { MAX_SYMBOLS_LIMIT_DEFAULT, MODAL_NAMES } from '@common/constants';
import { MessageContext } from '@customTypes/redux/chats.types';
import 'react-quill/dist/quill.bubble.css';
import ReactQuill from 'react-quill';
import { getQuillText, setQuillText } from '@common/QuillModules/utils';
import { quillModules } from '@common/QuillModules';
import Delta from 'quill-delta';
import s from './channelinput.module.css';
import { DeltaStatic } from 'quill';

const loadAttachmentHandler = async (data: FileList, callback: (urls: string[]) => void) => {
  const files: File[] = [...data].slice(0, 3).filter((file: File) => file.type.startsWith('image/'));
  if (!files.length) return;
  const urls = (await API.files.UploadFiles(files)) as string[];
  if (urls) callback(urls);
};

type Props = {
  placeholder?: string;
  chatTitle: string;
  uid: string;
  context: MessageContext;
  scrollToBottom: Function;
  disable?: boolean;
};

const ChannelInput: React.FC<Props> = ({ placeholder, uid, context, scrollToBottom, disable }): JSX.Element => {
  const dispatch = useDispatch<any>();

  const disableMessageAutofocus = useSelector((state: Store) => state.appdata.disableMessageAutofocus);
  const modalIsActive = useSelector((state: Store) => state.appdata.activeModal.name);
  const attachments = useSelector((state: Store) => state.appdata.uploadedAttachments);

  const [inFocus, setIsFocus] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [value, setValue] = useState('');

  const inputRef = useRef<ReactQuill>(null!);
  const typingSenderRef = useRef<any>();
  const typingCheckerRef = useRef<any>();

  // ? Обработчики нажатия для автофокуса
  useEffect(() => {
    function onChatInputDown(e: KeyboardEvent) {
      if (!inFocus && !disableMessageAutofocus && !modalIsActive) {
        if (
          (!shortcut.isException(e.code) || (e.code === 'Enter' && shortcut.includes('Shift'))) &&
          !(e.code === 'KeyC' && shortcut.includes('Control')) &&
          inputRef.current
        ) {
          inputRef.current.focus();
        }
      }
    }
    window.addEventListener('keydown', onChatInputDown);

    return () => {
      window.removeEventListener('keydown', onChatInputDown);
    };
  }, [inFocus, disableMessageAutofocus, modalIsActive]);

  useEffect(() => {
    const unsentMessage = lsa.getUnsentMessage(context.chatId);
    if (unsentMessage) {
      dispatch(setUploadedAttachments({ cid: context.chatId, urls: unsentMessage.attachments }));
      setValue(unsentMessage.text);
    }
  }, [context.chatId]);

  // ? Проверка на сохраненное неотправленное сообщение с вложением
  // ? Сохранение вложения в local storage
  useEffect(() => {
    lsa.saveUnsentMessage({
      content: { attachments: attachments[context.chatId], text: value },
      context,
    });
  }, [attachments, context.chatId]);

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
  }, [isTyping, context.chatId, uid]);

  useEffect(() => {
    function pasteHandler(e: ClipboardEvent) {
      if (e.clipboardData?.files.length) onLoadAttachmentHandler(e);
    }

    if (!disable) document.addEventListener('paste', pasteHandler);

    return () => {
      document.removeEventListener('paste', pasteHandler);
    };
  }, [disable]);

  const memoModules = useMemo(() => {
    return quillModules;
  }, []);

  // ? Обработчик нажатия на поле ввода
  const keyPressed = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'Enter':
        if (!shortcut.includes('Shift')) {
          e.preventDefault();
          onMessageSend();
        }
        break;
    }
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

  // ? Обработка ввода текста на поле ввода
  const handleChange = (value: string) => {
    lsa.saveUnsentMessage({ content: { text: value }, context });
    handleTyping();
    setValue(value);
  };

  // ? Сеттер эмоджи, прокидываем в emoji menu
  const writeEmoji = useCallback((shortname: string, emoji: string) => {
    const editor = inputRef.current.getEditor();
    const selection = editor.getSelection()?.index;
    editor.updateContents(
      new Delta().retain(selection || editor.getLength() - 1).insert(emoji) as unknown as DeltaStatic,
      'user'
    );
    if (selection) editor.setSelection(selection + 2, 0);
  }, []);

  // ? Отправка сообщения и сброс всех полей
  const onMessageSend = () => {
    if (value.length > MAX_SYMBOLS_LIMIT_DEFAULT) {
      dispatch(
        setModal({
          name: MODAL_NAMES.SYMBOL_LIMIT,
          payload: { length: value.length },
        })
      );
      dispatch();
      return;
    }
    const text = getQuillText(inputRef.current).trim();
    if (text || attachments[context.chatId].length) {
      dispatch(
        fetchSendMessage({
          context,
          content: { text, attachments: attachments[context.chatId] },
        })
      );
      dispatch(resetAttachments(context.chatId));
      lsa.resetUnsentMessage(context.chatId);
      setQuillText(inputRef.current, '');
      scrollToBottom();
    }
  };

  const onLoadAttachmentHandler = (e: ClipboardEvent) => {
    loadAttachmentHandler(e.clipboardData!.files, (urls: string[]) => {
      dispatch(setUploadedAttachments({ cid: context.chatId, urls }));
    });
  };
  const onFocus = () => {
    setIsFocus(true);
  };

  const onBlur = () => {
    setIsFocus(false);
  };

  return (
    <div className={s.wrapper}>
      {attachments[context.chatId] && <AttachmentBar urls={attachments[context.chatId]} context={context} />}
      <div className={s.control}>
        {disable ? (
          <div className={s.disable}>
            <i className="fas fa-ban"></i> Вы не можете писать в этот чат
          </div>
        ) : (
          <>
            <AttachmentLoader onChange={onLoadAttachmentHandler} />
            <ReactQuill
              className={s.input}
              ref={inputRef}
              placeholder={placeholder || 'Напишите что-то...'}
              theme="bubble"
              data-message-input="true"
              onChange={handleChange}
              onKeyDown={keyPressed}
              onFocus={onFocus}
              onBlur={onBlur}
              value={value}
              modules={memoModules}
            />
            <EmojiMenu emojiSetter={writeEmoji} />
          </>
        )}
      </div>
      {value.length > MAX_SYMBOLS_LIMIT_DEFAULT && (
        <MessageSymbolLimit length={value.length} limit={MAX_SYMBOLS_LIMIT_DEFAULT} />
      )}
    </div>
  );
};

export default ChannelInput;
