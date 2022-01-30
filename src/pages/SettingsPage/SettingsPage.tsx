import React, { useEffect } from 'react';
import GridSettingsPage from '../../templates/Grids/GridSettings';
import SettingsSidebar from '../../components/SettingsSidebar/SettingsSidebar';
import { Route, Switch, useHistory } from 'react-router-dom';
import ProfileCategory from '../../components/SettingsCategories/ProfileCategory/ProfileCategory';
import AppearanceCategory from '../../components/SettingsCategories/AppearanceCategory/AppearanceCategory';
import s from './settingspage.module.css';

const SettingsPage: React.FC = ({}): JSX.Element => {
  const history = useHistory();

  useEffect(() => {
    if (window.location.pathname === '/settings' || window.location.pathname === '/settings/') {
      history.push('/settings/profile');
    }
  }, []);

  return (
    <GridSettingsPage>
      <SettingsSidebar />
      <Switch>
        <Route exact path="/settings/profile" render={() => <ProfileCategory />} />
        <Route exact path="/settings/appearance" render={() => <AppearanceCategory />} />
      </Switch>
    </GridSettingsPage>
  );
};

export default SettingsPage;
