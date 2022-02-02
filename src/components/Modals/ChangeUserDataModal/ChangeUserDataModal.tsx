import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../common/hooks/useInput';
import { fetchChangeUserData } from '../../../store/user/thunk';
import InputTemplate from '../../../templates/Inputs/InputTemplate/InputTemplate';
import InputTitle from '../../../templates/Inputs/InputTitle/InputTitle';
import { TModalWindowArgs } from '../../../types/hooks';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import ModalHeader from '../ModalWindow/ModalHeader/ModalHeader';
import ModalWindow from '../ModalWindow/ModalWindow';
import ModalError from '../ModalWindow/ModalError/ModalError';
import { TStore } from '../../../types/common';
import ModalControl from '../ModalWindow/ModalControl/ModalControl';
import { setStatus } from '../../../store/errors/index';
import ModalLine from '../ModalWindow/ModalLine/ModalLine';
import s from './changeuserdatamodal.module.css';

type TProps = {
  username: string;
  email: string;
  type: 'username' | 'email';
} & TModalWindowArgs;

const UserChangeDataModal: React.FC<TProps> = ({ isFading, close, username, email, type }): JSX.Element => {
  const dispatch = useDispatch();

  const changeUserDataStatus = useSelector((state: TStore) => state.errors.changeUserDataStatus);

  const newData = useInput({ initial: type === 'email' ? email : username, required: true });
  const password = useInput({ required: true });

  const [error, setError] = useState('');

  useEffect(() => {
    switch (changeUserDataStatus) {
      case 'error':
        setError('Что-то пошло не так, проверьте данные и повторите');
        break;
      case 'success':
        dispatch(setStatus({ type: 'changeUserDataStatus', value: null }));
        setError('');
        close();
        break;
    }
  }, [changeUserDataStatus]);

  const saveData = () => {
    if (!newData.value.trim() || !password.value.trim()) {
      setError('Все поля должны быть заполнены');
    } else {
      dispatch(fetchChangeUserData({ username, email, [type]: newData.value, password: password.value }));
    }
  };

  return (
    <ModalWindow isFading={isFading} close={close}>
      <ModalHeader style={{ padding: '20px' }}>
        {type === 'email' ? (
          <>
            <h5>Переехали?</h5>
            <div>Введите новый адрес и ваш пароль</div>
          </>
        ) : (
          <>
            <h5>А кто ты?</h5>
            <div>Введите новое имя и ваш пароль</div>
          </>
        )}
      </ModalHeader>
      <div className={s.content}>
        <div className={s.field_wrapper}>
          <InputTitle>{type === 'email' ? 'Новый адрес' : 'Новое имя'}</InputTitle>
          <InputTemplate>
            <input {...newData} autoFocus />
          </InputTemplate>
        </div>
        <ModalLine />
        <div className={s.field_wrapper}>
          <InputTitle>Текущий пароль</InputTitle>
          <InputTemplate>
            <input {...password} type="password" placeholder="Вводить сюда <--" />
          </InputTemplate>
        </div>
        {error && <ModalError>{error}</ModalError>}
        <ModalControl>
          <ModalButton onClick={close}>Отмена</ModalButton>
          <ModalButton onClick={saveData} style={{ background: 'var(--astro)' }}>
            Сохранить
          </ModalButton>
        </ModalControl>
      </div>
    </ModalWindow>
  );
};

export default UserChangeDataModal;
