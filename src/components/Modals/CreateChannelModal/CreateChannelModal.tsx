import React, { useEffect, useRef, useState } from 'react';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import ModalWindow from '../ModalWindow/ModalWindow';
import { TModalWindowArgs } from '../../../types/hooks';
import Spacer from '../../../templates/Spacer';
import { fetchCreateChannel } from '../../../store/channels/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { TStore } from '../../../types/common';
import { focusInEnd } from '../../../common/utils/focusInEnd';
import ModalHeader from '../ModalWindow/ModalHeader/ModalHeader';
import ModalInputTitle from '../ModalWindow/ModalInputTitle/ModalInputTitle';
import s from './createchannelmodal.module.css';
import useInput from '../../../common/hooks/useInput';
import ModalControl from '../ModalWindow/ModalControl/ModalControl';
import ModalError from '../ModalWindow/ModalError/ModalError';
import { setStatus } from '../../../store/errors';

const preparedPhrases = [
  'Какой-то',
  'Клёвый',
  'Веселый',
  'Стильный',
  'Популярный',
  'Кринжовый',
  'Красивый',
  'Уютный',
  'Милый',
  'Ламповый',
  'Очередной',
  'Хайповый',
];

type TProps = TModalWindowArgs;

const CreateChannelModal: React.FC<TProps> = ({ isFading, close }): JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector((state: TStore) => state.user);
  const createChannelStatus = useSelector((state: TStore) => state.errors.createChannelStatus);
  const createRandomName = () => {
    return `${preparedPhrases[(Math.random() * preparedPhrases.length) >> 0]} сервер ${user.username}`;
  };

  const channelTitle = useInput({ initial: createRandomName(), required: true });

  const [channelIcon, setServerIcon] = useState<File>();
  const [iconURL, setIconURl] = useState('');
  const [error, setError] = useState('');

  const titleRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    focusInEnd(titleRef);
  }, []);

  useEffect(() => {
    if (channelIcon) {
      setIconURl(URL.createObjectURL(channelIcon));
    }

    return () => {
      URL.revokeObjectURL(iconURL);
    };
  }, [channelIcon]);

  useEffect(() => {
    switch (createChannelStatus) {
      case 'error':
        setError('Что-то пошло не так, повторите попытку');
        break;
      case 'success':
        dispatch(setStatus({ type: 'createChannelStatus', value: null }));
        close();
    }
  }, [createChannelStatus]);

  useEffect(() => {
    errorSetter('');
  }, [channelIcon, channelTitle.value]);

  const errorSetter = (err: string) => {
    if (error) setError(err);
  };

  const uploadIcon = (e: any) => {
    if (!e.target.files[0] || !e.target.files[0].type.startsWith('image/')) return;
    setServerIcon(e.target.files[0]);
  };

  const onDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    let file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    setServerIcon(file);
  };

  const onCreate = () => {
    if (channelTitle.value && channelIcon) {
      dispatch(fetchCreateChannel({ title: channelTitle.value, icon: channelIcon }));
    } else {
      setError('Все поля должны быть заполнены');
    }
  };

  return (
    <ModalWindow isFading={isFading} close={close}>
      <div className={s.wrapper}>
        <ModalHeader style={{ padding: '20px' }}>
          <h4>Создаете сервер?</h4>
          <div className={s.tagline}>Персонализируйте его!</div>
        </ModalHeader>
        <div className={s.content}>
          <div className={s.circle} style={{ backgroundImage: iconURL ? `url(${iconURL})` : '' }}>
            <input
              className={s.file_loader}
              multiple={false}
              type="file"
              accept="image/*"
              onChange={uploadIcon}
              onDrop={onDrop}
              title=""
            />
            {!channelIcon && (
              <div className={s.circle_icon}>
                <i className="fas fa-camera-alt"></i>
              </div>
            )}
          </div>
          <div>
            <ModalInputTitle style={{ marginTop: '25px', marginBottom: '5px' }}>Название канала</ModalInputTitle>
            <input
              {...channelTitle}
              className={s.server_title}
              autoComplete="off"
              type="text"
              placeholder="Введите его тут"
              ref={titleRef}
              value={channelTitle.value}
              spellCheck="false"
            />
          </div>
          {error && <ModalError>{error}</ModalError>}
          <ModalControl>
            <ModalButton onClick={close}>Закрыть</ModalButton>
            <Spacer width={10} />
            <ModalButton onClick={onCreate} style={{ background: 'var(--astro)' }}>
              Создать
            </ModalButton>
          </ModalControl>
        </div>
      </div>
    </ModalWindow>
  );
};

export default CreateChannelModal;
