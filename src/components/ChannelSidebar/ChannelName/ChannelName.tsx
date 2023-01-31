import React, { useEffect, useState } from 'react';
import ChannelDropMenu from './ChannelDropmenu/ChannelDropMenu';
import { findDatasetInParents } from '@common/utils/findDataInParents';
import s from './channelname.module.css';

type Props = {
  channelName: string;
  channelId: string;
  openInvite: () => void;
  openChannelSettings: (channelId: string) => void;
};

const ChannelName: React.FC<Props> = ({ channelName, channelId, openInvite, openChannelSettings }): JSX.Element => {
  const [dropmenuIsOpen, setDropmenuIsOpen] = useState(false);

  useEffect(() => {
    function onChannelDropmenu(e: any) {
      if (dropmenuIsOpen && !findDatasetInParents(e.target, 'dropmenu')) {
        closeMenu();
      }
    }

    document.addEventListener('click', onChannelDropmenu);

    return () => {
      document.removeEventListener('click', onChannelDropmenu);
    };
  }, [dropmenuIsOpen]);

  const closeMenu = () => {
    setDropmenuIsOpen(false);
  };

  const toggleMenu = () => {
    setDropmenuIsOpen(!dropmenuIsOpen);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.wrapper_data} onClick={toggleMenu} data-dropmenu="true">
        <div className={s.name}>{channelName}</div>
        <i className={`fas fa-chevron-down ${s.arrow}`}></i>
      </div>
      {dropmenuIsOpen && (
        <div className={s.dropmenu_wrapper}>
          <ChannelDropMenu
            close={closeMenu}
            openInvite={openInvite}
            channelId={channelId}
            openChannelSettings={openChannelSettings}
          />
        </div>
      )}
    </div>
  );
};

export default ChannelName;
