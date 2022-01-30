import React, { useEffect, useRef, useState } from 'react';
import { TModalWindowArgs } from '../../../types/hooks';
import ModalWindow from '../ModalWindow/ModalWindow';
import s from './chatsettingsmodal.module.css';
import { TChat } from '../../../store/chats/types';
import ModalHeader from '../ModalWindow/ModalHeader/ModalHeader';
import InputTemplate from '../../../templates/Inputs/InputTemplate/InputTemplate';
import ModalError from '../ModalWindow/ModalError/ModalError';
import ModalControl from '../ModalWindow/ModalControl/ModalControl';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import { useDispatch, useSelector } from 'react-redux';
import { TStore } from '../../../types/common';
import useInput from '../../../common/hooks/useInput';
import { setStatus } from '../../../store/errors';
import { fetchUpdateChat } from '../../../store/chats/thunk';

type TProps = {
  chat: TChat;
} & TModalWindowArgs;

const ChatSettingsModal: React.FC<TProps> = ({ isFading, close, chat }): JSX.Element => {
  const dispatch = useDispatch();

  const updateChatStatus = useSelector((state: TStore) => state.errors.updateChatStatus);

  const titleInput = useInput({ initial: chat.title });

  const titleRef = useRef<HTMLInputElement>(null!);
  const [error, setError] = useState('');

  useEffect(() => {
    switch (updateChatStatus) {
      case 'success':
        dispatch(setStatus({ type: 'updateChatStatus', value: null }));
        close();
        break;
      case 'error':
        setError('Что-то пошло не так, повторите попытку');
        break;
    }
  }, [updateChatStatus]);

  const saveChat = () => {
    if (!titleInput.value.trim()) return setError('Все поля должны быть заполнены');
    dispatch(fetchUpdateChat({ cid: chat.uuid, chat: { title: chat.title } }));
    close();
  };

  return (
    <ModalWindow isFading={isFading} close={close}>
      <ModalHeader style={{ padding: '20px' }}>
        <h5>Управление чатом</h5>
      </ModalHeader>
      <div className={s.content}>
        <InputTemplate>
          <div className={s.title_wrapper}>
            <span className={s.hashtag}>#</span>
            <input {...titleInput} className={s.chat_title} placeholder="название-чата" ref={titleRef} autoFocus />
          </div>
        </InputTemplate>
        {error && <ModalError>{error}</ModalError>}
        <ModalControl>
          <ModalButton onClick={close}>Отмена</ModalButton>
          <ModalButton style={{ background: 'var(--astro)' }} onClick={saveChat} onEnterPress>
            Сохранить
          </ModalButton>
        </ModalControl>
      </div>
    </ModalWindow>
  );
};

export default ChatSettingsModal;
