import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TAxiosUpdateChannel } from '../../../../../api/types';
import useInput from '../../../../../common/hooks/useInput';
import { fetchUpdateChannel, fetchUpdateChannelIcon } from '../../../../../store/channels/thunk';
import { TChannel } from '../../../../../store/channels/types';
import { setStatus } from '../../../../../store/errors';
import InputTemplate from '../../../../../templates/Inputs/InputTemplate/InputTemplate';
import { TStore } from '../../../../../types/common';
import Avatar from '../../../../Avatar/Avatar';
import DropMenu from '../../../../DropMenu/DropMenu';
import ModalButton from '../../../ModalWindow/ModalButton/ModalButton';
import ModalError from '../../../ModalWindow/ModalError/ModalError';
import ModalHeader from '../../../ModalWindow/ModalHeader/ModalHeader';
import ModalInputTitle from '../../../ModalWindow/ModalInputTitle/ModalInputTitle';
import ModalLine from '../../../ModalWindow/ModalLine/ModalLine';
import s from './mainpage.module.css';

type TProps = {
  channel: TChannel;
  close: () => void;
};

const titleSetter = (value: string) => {
  return value.slice(0, 42);
};

const descriptionSetter = (value: string) => {
  return value.replace(/\s\s+/g, ' ').replace(/\n/g, '').slice(0, 200);
};

const MainPage: React.FC<TProps> = ({ channel, close }): JSX.Element => {
  const dispatch = useDispatch();

  const updateChannelStatus = useSelector((state: TStore) => state.errors.updateChannelStatus);
  const chats = useSelector((state: TStore) => state.chats);

  const titleRef = useRef<HTMLInputElement>(null!);

  // TODO переделать все под один объект вместо тысячи стейтов
  const title = useInput({ initial: channel.title, setter: titleSetter });
  const channelDescription = useInput({ initial: channel.description, setter: descriptionSetter });

  const [newIconURL, setNewIconURL] = useState('');
  const [newIcon, setNewIcon] = useState<File>();
  const [currentSystemChat, setCurrentSystemChat] = useState(channel.systemChat);
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

  const renderChats = () => {
    return [...channel.chats]
      .filter((chat) => chat !== currentSystemChat)
      .map((cid) => (
        <div key={cid} className={s.chat_selector} onClick={() => setCurrentSystemChat(cid)}>
          <span>#</span>
          {chats[cid].title}
        </div>
      ));
  };

  const updateChannel = () => {
    if (!title.value.trim()) return setError('Все поля должны быть заполнены');

    const data: TAxiosUpdateChannel = {
      cid: channel.uuid,
      title: title.value,
      description: channelDescription.value,
      systemChat: currentSystemChat,
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
        <div className={s.content_inner}>
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
                <input {...title} ref={titleRef} autoFocus />
              </div>
            </InputTemplate>
          </div>
          <ModalLine />
          <InputTemplate shadow>
            <ModalInputTitle style={{ marginBottom: '5px' }}>Описание канала</ModalInputTitle>
            <div className={s.desc_wrapper}>
              <textarea {...channelDescription} className={s.channel_description}></textarea>
              <div className={s.desc_length}>{channelDescription.value.length}/200</div>
            </div>
          </InputTemplate>
          <ModalLine />
          <ModalInputTitle style={{ marginBottom: '5px' }}>Канал системных сообщений</ModalInputTitle>
          <DropMenu
            current={
              (
                <div className={s.current_chat_selector}>
                  <span>#</span>
                  {chats[currentSystemChat].title}
                </div>
              ) || 'Нет активного канала'
            }
          >
            {renderChats()}
          </DropMenu>
        </div>
      </div>
      {error && <ModalError>{error}</ModalError>}
      <div className={s.control}>
        <ModalButton onClick={close}>Отмена</ModalButton>
        <ModalButton style={{ background: 'var(--astro)' }} onClick={updateChannel}>
          Сохранить
        </ModalButton>
      </div>
    </div>
  );
};

export default MainPage;
