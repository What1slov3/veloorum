import React, { useEffect, useRef, useState } from 'react';
import ModalHeader from '../ModalWindow/ModalHeader/ModalHeader';
import InputTemplate from '../../../templates/Inputs/InputTemplate/InputTemplate';
import ModalError from '../ModalWindow/ModalError/ModalError';
import ModalControl from '../ModalWindow/ModalControl/ModalControl';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@customTypes/common.types';
import useInput from '@common/hooks/useInput';
import { setStatus } from '@store/errors';
import { fetchUpdateChat } from '@store/chats/thunk';
import { ChatSettingsPayload } from '@customTypes/modals.types';
import s from './chatsettingsmodal.module.css';

type Props = {
  onClose: () => void;
};

const titleSetter = (value: string) => {
  return value.slice(0, 32).toLowerCase().replace(/\s+/g, '-');
};

const ChatSettingsModal: React.FC<Props> = ({ onClose }): JSX.Element => {
  const dispatch = useDispatch<any>();

  const updateChatStatus = useSelector((state: Store) => state.errors.updateChatStatus);
  const { chat } = useSelector((state: Store) => state.appdata.activeModal.payload as ChatSettingsPayload);

  const titleInput = useInput({ initial: chat.title, setter: titleSetter });

  const [error, setError] = useState('');

  const titleRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    switch (updateChatStatus) {
      case 'success':
        dispatch(setStatus({ type: 'updateChatStatus', value: null }));
        onClose();
        break;
      case 'error':
        setError('Что-то пошло не так, повторите попытку');
        break;
    }
  }, [updateChatStatus]);

  const saveChat = () => {
    if (!titleInput.value.trim()) return setError('Все поля должны быть заполнены');
    dispatch(fetchUpdateChat({ cid: chat.uuid, chat: { title: titleInput.value } }));
    onClose();
  };

  return (
    <>
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
          <ModalButton onClick={onClose}>Отмена</ModalButton>
          <ModalButton style={{ background: 'var(--astro)' }} onClick={saveChat}>
            Сохранить
          </ModalButton>
        </ModalControl>
      </div>
    </>
  );
};

export default ChatSettingsModal;
