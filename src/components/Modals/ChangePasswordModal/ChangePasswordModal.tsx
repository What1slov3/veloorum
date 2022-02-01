import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import API from '../../../api';
import useInput from '../../../common/hooks/useInput';
import InputTemplate from '../../../templates/Inputs/InputTemplate/InputTemplate';
import InputTitle from '../../../templates/Inputs/InputTitle/InputTitle';
import { TModalWindowArgs } from '../../../types/hooks';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import ModalControl from '../ModalWindow/ModalControl/ModalControl';
import ModalError from '../ModalWindow/ModalError/ModalError';
import ModalHeader from '../ModalWindow/ModalHeader/ModalHeader';
import ModalLine from '../ModalWindow/ModalLine/ModalLine';
import ModalWindow from '../ModalWindow/ModalWindow';
import s from './changepasswordmodal.module.css';

type TProps = {} & TModalWindowArgs;

const ChangePasswordModal: React.FC<TProps> = ({ isFading, close }): JSX.Element => {
  const currentPassword = useInput({});
  const newPassword = useInput({});
  const repeatNewPassword = useInput({});

  const [error, setError] = useState('');

  const saveData = async () => {
    const cpv = currentPassword.value.trim();
    const npv = newPassword.value.trim();
    const rnpv = repeatNewPassword.value.trim();
    if (!cpv || !npv || !rnpv) {
      return setError('Все поля должны быть заполнены');
    }
    if (npv !== rnpv) {
      return setError('Пароли не совпадают');
    }
    if (cpv === npv) {
      return setError('Новый и старый пароли не могут совпадать');
    }
    const response = await API.user.changePassword({
      newPassword: npv,
      currentPassword: cpv,
    });
    if (response.name === 'Error' && response.toString().includes('401')) {
      return setError('Неверный текущий пароль');
    }
    if (response.name === 'Error') {
      return setError('Что-то пошло не так');
    }
    localStorage.removeItem('access_token');
    window.location.pathname = '/login.html';
  };

  return (
    <ModalWindow close={close} isFading={isFading}>
      <ModalHeader style={{ padding: '20px' }}>
        <h5>Введите новый пароль</h5>
        <div>Если не забыли старый, конечно...</div>
      </ModalHeader>
      <div className={s.content}>
        <div className={s.field_wrapper}>
          <InputTitle>Текущий пароль</InputTitle>
          <InputTemplate>
            <input {...currentPassword} autoFocus type="password" />
          </InputTemplate>
        </div>
        <ModalLine />
        <div className={s.field_wrapper}>
          <InputTitle>Новый пароль</InputTitle>
          <InputTemplate>
            <input {...newPassword} type="password" />
          </InputTemplate>
        </div>
        <div className={s.field_wrapper}>
          <InputTitle>Повторите пароль</InputTitle>
          <InputTemplate>
            <input {...repeatNewPassword} type="password" />
          </InputTemplate>
        </div>
        {error && <ModalError>{error}</ModalError>}
        <ModalControl>
          <ModalButton onClick={close}>Отмена</ModalButton>
          <ModalButton style={{ background: 'var(--astro)' }} onClick={saveData} onEnterPress>
            Сохранить
          </ModalButton>
        </ModalControl>
      </div>
    </ModalWindow>
  );
};

export default ChangePasswordModal;
