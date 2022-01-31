import React from 'react';
import { TModalWindowArgs } from '../../../types/hooks';
import ModalWindow from '../ModalWindow/ModalWindow';
import MainPage from './Pages/MainPage/MainPage';
import s from './channelsettingsmodal.module.css';
import { useSelector } from 'react-redux';
import { TStore } from '../../../types/common';

type TProps = {
  channelId: string;
} & TModalWindowArgs;

const ChannelSettingsModal: React.FC<TProps> = ({ isFading, close, channelId }): JSX.Element => {
  const channel = useSelector((state: TStore) => state.channels[channelId]);

  return (
    <ModalWindow close={close} isFading={isFading}>
      <div className={s.wrapper}>
        <div className={s.page_wrapper}>
          {/* ? Вероятно, позже будет разделение на страницы категорий */}
          <MainPage channel={channel} close={close} />
        </div>
      </div>
    </ModalWindow>
  );
};

export default ChannelSettingsModal;
