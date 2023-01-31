import React from 'react';
import MainPage from './Pages/MainPage/MainPage';
import { useSelector } from 'react-redux';
import { Store } from '@customTypes/common.types';
import { ChannelSettingsPayload } from '@customTypes/modals.types';
import s from './channelsettingsmodal.module.css';

type Props = {
  onClose: () => void;
};

const ChannelSettingsModal: React.FC<Props> = ({ onClose }): JSX.Element => {
  const { channelId } = useSelector((state: Store) => state.appdata.activeModal.payload as ChannelSettingsPayload);
  const channel = useSelector((state: Store) => state.channels[channelId]);

  return (
    <div className={s.wrapper}>
      <div className={s.page_wrapper}>
        {/* ? Вероятно, позже будет разделение на страницы категорий */}
        <MainPage channel={channel} close={onClose} />
      </div>
    </div>
  );
};

export default ChannelSettingsModal;
