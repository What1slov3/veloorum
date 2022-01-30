import React, { useEffect } from 'react';
import s from './channelname.module.css';
import ChannelDropMenu from './ChannelDropmenu/ChannelDropMenu';
import { useDispatch, useSelector } from 'react-redux';
import { setChannelDropmenu } from '../../../store/appdata';
import { TStore } from '../../../types/common';
import { TModalOpenFunc } from '../../../types/hooks';

type TProps = {
  channelName: string;
  channelId: string;
  openInvite: TModalOpenFunc<string>;
  openChannelSettings: TModalOpenFunc<string>;
};

const ChannelName: React.FC<TProps> = ({ channelName, channelId, openInvite, openChannelSettings }): JSX.Element => {
  const dispatch = useDispatch();

  const dropmenuIsOpen = useSelector((state: TStore) => state.appdata.channelDropmenuIsOpen);

  useEffect(() => {
    if (dropmenuIsOpen) {
      document.onclick = (e: MouseEvent) => {
        if (!(e.target instanceof HTMLElement)) return;
        if (!e.target.dataset.dropmenu) closeMenu();
      };
    }
    if (!dropmenuIsOpen) document.onclick = null;
  }, [dropmenuIsOpen]);

  const openMenu = () => {
    dispatch(setChannelDropmenu(true));
  };

  const closeMenu = () => {
    dispatch(setChannelDropmenu(false));
  };

  return (
    <div className={s.wrapper}>
      <div className={s.wrapper_data} onClick={openMenu}>
        <div className={s.name}>{channelName}</div>
        <i className={`far fa-chevron-down ${s.arrow}`}></i>
      </div>
      {dropmenuIsOpen && (
        <div className={s.dropmenu_wrapper} data-dropmenu="true">
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
