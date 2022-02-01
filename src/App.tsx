import React, { useEffect, useRef, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import GridMain from './templates/Grids/GridMain';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar/Navbar';
import AppPreloader from './components/Preloaders/AppPreloader/AppPreloader';
import ChannelPage from './pages/ChannelPage/ChannelPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import { TStore } from './types/common';
import { fetchUserInit } from './store/user/thunk';
import { setWsConnectionError } from './store/appdata';
import DropAreaWrapper from './components/DropAreaWrapper/DropAreaWrapper';
import MainPage from './pages/MainPage/MainPage';
import './App.css';

// TODO глобальный рефакторинг

function App() {
  const dispatch = useDispatch();

  const [showPreloader, setShowPreloader] = useState(true);
  const [inited, setInited] = useState(false);

  const init = useSelector((state: TStore) => state.appdata.init); // Загруженны ли основные данные юзера
  const wsConnected = useSelector((state: TStore) => state.appdata.wsData.wsConnected);
  const wsConnectionError = useSelector((state: TStore) => state.appdata.wsData.wsConnectionError);

  const reInitRef = useRef<any>();

  function handlePreloaderAnim() {
    setTimeout(() => {
      setShowPreloader(false);
    }, 1000);
  }

  useEffect(() => {
    dispatch(fetchUserInit()); // Вызываем инициализацию юзера по токену
  }, []);

  useEffect(() => {
    if (init.fulfilled && wsConnected) {
      if (reInitRef.current) clearInterval(reInitRef.current);
      setInited(true);
      handlePreloaderAnim();
    }
    if (wsConnectionError) {
      setInited(false);
      setShowPreloader(true);
      dispatch(setWsConnectionError(true));
    }
    if (wsConnectionError && wsConnected) dispatch(setWsConnectionError(false));
    if (init.rejectedWithError) {
      reInitRef.current = setInterval(() => dispatch(fetchUserInit()), 1000 * 5);
    }
  }, [init, reInitRef, wsConnected, wsConnectionError]);

  return (
    <DropAreaWrapper>
      <GridMain>
        {showPreloader && (
          <AppPreloader
            show={!init.fulfilled || !wsConnected}
            loadError={init.rejectedWithError || wsConnectionError}
          />
        )}
        {inited && (
          <Switch>
            <Route
              path="/channel/:id"
              render={() => {
                return (
                  <>
                    <Navbar />
                    <Route path="/channel/:id" render={() => <ChannelPage />} />
                  </>
                );
              }}
            />
            <Route
              path="/settings"
              render={() => (
                <>
                  <Navbar />
                  <SettingsPage />
                </>
              )}
            />
            <Route path="/" render={() => <><Navbar /><MainPage /></>} />
          </Switch>
        )}
      </GridMain>
    </DropAreaWrapper>
  );
}

export default App;
