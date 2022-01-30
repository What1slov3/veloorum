import React, { useEffect, useRef, useState } from 'react';
import ModalWindow from '../ModalWindow/ModalWindow';
import { TModalWindowArgs } from '../../../types/hooks';
import s from './createchatmodal.module.css';
import Spacer from '../../../templates/Spacer';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateChat } from '../../../store/chats/thunk';
import ModalHeader from '../ModalWindow/ModalHeader/ModalHeader';
import InputTemplate from '../../../templates/Inputs/InputTemplate/InputTemplate';
import useInput from '../../../common/hooks/useInput';
import ModalControl from '../ModalWindow/ModalControl/ModalControl';
import ModalError from '../ModalWindow/ModalError/ModalError';
import { TStore } from '../../../types/common';
import { setStatus } from '../../../store/errors';

type TProps = {
  cid: string;
} & TModalWindowArgs;

const titleSetter = (value: string) => {
  return value.slice(0, 32).toLowerCase().replace(/\s/g, '-');
};

const CreateChatModal: React.FC<TProps> = ({ isFading, close, cid }): JSX.Element => {
  const dispatch = useDispatch();

  const createChatStatus = useSelector((state: TStore) => state.errors.createChatStatus);

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
        close();
    }
  }, [createChatStatus]);

  const createChat = () => {
    if (title.value.trim().length) {
      dispatch(fetchCreateChat({ cid, title: title.value }));
    } else {
      setError('Поле не должно быть пустым');
    }
  };

  return (
    <ModalWindow isFading={isFading} close={close}>
      <div className={s.wrapper}>
        <ModalHeader style={{ padding: '20px' }}>
          <h5>Новый текстовый канал</h5>
        </ModalHeader>
        <div className={s.content}>
          <Spacer height={10} />
          <InputTemplate shadow>
            <div className={s.chat_title_wrapper}>
              <span className={s.hashtag}>#</span>
              <input {...title} className={s.chat_title} placeholder="Название чата" ref={titleRef} autoFocus />
            </div>
          </InputTemplate>
          <Spacer height={10} />
          {error && <ModalError>{error}</ModalError>}
          <ModalControl>
            <ModalButton onClick={close}>Отмена</ModalButton>
            <Spacer width={10} />
            <ModalButton onClick={createChat} style={{ background: `var(--astro)` }} onEnterPress>
              Создать
            </ModalButton>
          </ModalControl>
        </div>
      </div>
    </ModalWindow>
  );
};

export default CreateChatModal;
