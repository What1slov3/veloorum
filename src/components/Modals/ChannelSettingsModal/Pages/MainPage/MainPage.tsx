import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../../../common/hooks/useInput';
import { fetchUpdateChannel, fetchUpdateChannelIcon } from '../../../../../store/channels/thunk';
import { TChannel } from '../../../../../store/channels/types';
import { setStatus } from '../../../../../store/errors';
import InputTemplate from '../../../../../templates/Inputs/InputTemplate/InputTemplate';
import { TStore } from '../../../../../types/common';
import Avatar from '../../../../Avatar/Avatar';
import ModalButton from '../../../ModalWindow/ModalButton/ModalButton';
import ModalError from '../../../ModalWindow/ModalError/ModalError';
import ModalHeader from '../../../ModalWindow/ModalHeader/ModalHeader';
import ModalInputTitle from '../../../ModalWindow/ModalInputTitle/ModalInputTitle';
import s from './mainpage.module.css';

type TProps = {
  channel: TChannel;
  close: () => void;
};

const titleSetter = (value: string) => {
  return value.slice(0, 42);
};

const MainPage: React.FC<TProps> = ({ channel, close }): JSX.Element => {
  const dispatch = useDispatch();

  const updateChannelStatus = useSelector((state: TStore) => state.errors.updateChannelStatus);

  const titleRef = useRef<HTMLInputElement>(null!);

  const title = useInput({ initial: channel.title, setter: titleSetter });

  const [newIconURL, setNewIconURL] = useState('');
  const [newIcon, setNewIcon] = useState<File>();
  const [error, setError] = useState('');

  const uploadIcon = (e: any) => {
    if (!e.target.files[0] || !e.target.files[0].type.startsWith('image/')) return;
    setNewIcon(e.target.files[0]);
    setNewIconURL(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    switch (updateChannelStatus) {
      case 'success':
        dispatch(setStatus({ type: 'updateChannelStatus', value: null }));
        close();
        break;
      case 'error':
        setError('Что-то пошло не так, повторите попытку');
        break;
    }
  }, [updateChannelStatus]);

  const updateChannel = () => {
    if (!title.value.trim()) return setError('Все поля должны быть заполнены');
    
    const data = {
      cid: channel.uuid,
      title: title.value,
    };

    if (newIcon) dispatch(fetchUpdateChannelIcon({ cid: channel.uuid, icon: newIcon }));
    if (Object.values(data).reduce((prev, curr) => prev + curr.trim()) !== channel.uuid) {
      dispatch(fetchUpdateChannel(data));
    }
  };

  return (
    <div className={s.wrapper}>
      <ModalHeader style={{ padding: '20px' }}>
        <h4>Настройки канала</h4>
        <div>Создайте уютное место общения</div>
      </ModalHeader>
      <div className={s.content}>
        <div className={s.main_wrapper}>
          <div className={s.icon_changer}>
            <div className={s.overlay}></div>
            <input
              className={s.file_loader}
              multiple={false}
              type="file"
              accept="image/*"
              onChange={uploadIcon}
              id="icon"
              title=""
            />
            <label htmlFor="icon">
              <i className="fas fa-camera" id={s.channel_icon}></i>
            </label>
            <Avatar url={newIconURL || channel.iconUrl} style={{ height: '100px', width: '100px' }} />
          </div>
          <InputTemplate shadow>
            <ModalInputTitle style={{ marginBottom: '5px' }}>Название канала</ModalInputTitle>
            <div className={s.title_wrapper}>
              <input {...title} className={s.chat_title} ref={titleRef} value={title.value} autoFocus />
            </div>
          </InputTemplate>
        </div>
        <div className={s.line}></div>
      </div>
      {error && <ModalError>{error}</ModalError>}
      <div className={s.control}>
        <ModalButton onClick={close}>Отмена</ModalButton>
        <ModalButton style={{ background: 'var(--astro)' }} onClick={updateChannel} onEnterPress>
          Сохранить
        </ModalButton>
      </div>
    </div>
  );
};

export default MainPage;
