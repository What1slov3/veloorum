import React from 'react';
import s from './apppreloader.module.css';

type TProps = {
  show: boolean;
  loadError: boolean;
};

const AppPreloader: React.FC<TProps> = ({ show, loadError }): JSX.Element => {
  return (
    <div className={s.wrapper} id={show ? undefined : s.fade}>
      <div className={s.logo_wrapper}>
        <div className={s.name}>eloorum</div>
        <div className={s.logo}></div>
      </div>
      {loadError && (
        <div className={s.load_error}>
          <div>Ошибка подключения к серверу</div>
          <div>Попытка переподключения</div>
        </div>
      )}
    </div>
  );
};

export default AppPreloader;
