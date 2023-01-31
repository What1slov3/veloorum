import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import GridSettingsPage from '../../templates/Grids/GridSettings';
import SettingsSidebar from '@components/SettingsSidebar/SettingsSidebar';
import ProfileCategory from '@components/SettingsCategories/ProfileCategory/ProfileCategory';
import AppearanceCategory from '@components/SettingsCategories/AppearanceCategory/AppearanceCategory';
import s from './settingspage.module.css';

const SettingsPage: React.FC = ({}): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/settings') {
      navigate('/settings/profile');
    }
  }, []);

  return (
    <GridSettingsPage>
      <SettingsSidebar />
      <Routes>
        <Route path="/profile" element={<ProfileCategory />} />
        <Route path="/appearance" element={<AppearanceCategory />} />
      </Routes>
    </GridSettingsPage>
  );
};

export default SettingsPage;
