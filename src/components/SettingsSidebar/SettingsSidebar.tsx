import React from 'react';
import s from './settingssidebar.module.css';
import SidebarButton from './SidebarButton/SidebarButton';
import SidebarCategory from './SidebarCategory/SidebarCategory';

const SettingsSidebar: React.FC = ({}): JSX.Element => {
  const onExit = () => {
    localStorage.clear();
    window.location.pathname = '/login.html';
  };

  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        <div>
          <SidebarCategory title="Профиль">
            <SidebarButton title="Учетная запись" url="/settings/profile" />
          </SidebarCategory>
          <div className={s.line}></div>
          <SidebarCategory title="Приложение">
            <SidebarButton title="Внешний вид" url="/settings/appearance" />
            <SidebarButton title="Текст и изображения" url="/settings/text_images" />
            <SidebarButton title="Уведомления" url="/settings/push" />
          </SidebarCategory>
        </div>
        <div>
          <div className={s.line}></div>
          <div className={s.exit} onClick={onExit}>
            Выйти <i className="fal fa-sign-out"></i>
          </div>
        </div>
      </div>
      <div className={s.version}>Pre-alpha v1.0.0</div>
    </div>
  );
};

export default SettingsSidebar;
