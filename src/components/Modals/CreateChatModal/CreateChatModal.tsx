import React, { useEffect, useRef, useState } from 'react';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateChat } from '@store/chats/thunk';
import ModalHeader from '../ModalWindow/ModalHeader/ModalHeader';
import InputTemplate from '../../../templates/Inputs/InputTemplate/InputTemplate';
import useInput from '@common/hooks/useInput';
import ModalControl from '../ModalWindow/ModalControl/ModalControl';
import ModalError from '../ModalWindow/ModalError/ModalError';
import { Store } from '@customTypes/common.types';
import { setStatus } from '@store/errors';
import { CreateChatPayload } from '@customTypes/modals.types';
import s from './createchatmodal.module.css';

const titleSetter = (value: string) => {
  return value.slice(0, 32).toLowerCase().replace(/\s/g, '-');
};

type Props = {
  onClose: () => void;
};

const CreateChatModal: React.FC<Props> = (props): JSX.Element => {
  const dispatch = useDispatch<any>();

  const createChatStatus = useSelector((state: Store) => state.errors.createChatStatus);
  const { cid } = useSelector((state: Store) => state.appdata.activeModal.payload as CreateChatPayload);

  const title = useInput({ required: true, setter: titleSetter });

  const [error, setError] = useState('');

  const titleRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    switch (createChatStatus) {
      case 'error':
        setError('Что-то пошло не так, повторите попытку');
        break;
      case 'success':
        dispatch(setStatus({ type: 'createChatStatus', value: null }));
        props.onClose();
    }
  }, [createChatStatus]);

  const createChat = () => {
    if (title.value.trim().length) {
      dispatch(fetchCreateChat({ cid, title: title.value }));
    } else {
      setError('Поле не должно быть пустым');
    }
  };

  console.log(props);

  return (
    <div className={s.wrapper}>
      <ModalHeader style={{ padding: '20px' }}>
        <h5>Новый текстовый канал</h5>
      </ModalHeader>
      <div className={s.content}>
        <InputTemplate shadow>
          <div className={s.chat_title_wrapper}>
            <span className={s.hashtag}>#</span>
            <input {...title} className={s.chat_title} placeholder="Название чата" ref={titleRef} autoFocus />
          </div>
        </InputTemplate>
        {error && <ModalError>{error}</ModalError>}
        <ModalControl>
          <ModalButton onClick={props.onClose}>Отмена</ModalButton>
          <ModalButton onClick={createChat} style={{ background: `var(--astro)` }}>
            Создать
          </ModalButton>
        </ModalControl>
      </div>
    </div>
  );
};

export default CreateChatModal;
