import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import GridMain from './templates/Grids/GridMain';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@components/Navbar/Navbar';
import Preloader from '@components/Preloaders/Preloader/Preloader';
import ChannelPage from './pages/ChannelPage/ChannelPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import { Store } from '@customTypes/common.types';
import { fetchUserInit } from '@store/user/thunk';
import DropAreaWrapper from '@components/DropAreaWrapper/DropAreaWrapper';
import MainPage from './pages/MainPage/MainPage';
import ActiveModal from '@components/Modals';
import './App.css';

function App() {
  const dispatch = useDispatch<any>();

  const [showPreloader, setShowPreloader] = useState(true);
  const [inited, setInited] = useState(false);

  const init = useSelector((state: Store) => state.appdata.init); // Загруженны ли основные данные юзера
  const wsConnected = useSelector((state: Store) => state.appdata.wsData.wsConnected);
  const wsConnectionError = useSelector((state: Store) => state.appdata.wsData.wsConnectionError);

  const reInitRef = useRef<any>();

  function handlePreloaderAnimation() {
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
      handlePreloaderAnimation();
    }
    if (wsConnectionError) {
      setInited(false);
      setShowPreloader(true);
    }
    if (init.rejectedWithError) {
      reInitRef.current = setInterval(() => dispatch(fetchUserInit()), 1000 * 5);
    }
  }, [init, wsConnected, wsConnectionError]);

  return (
    <>
      {showPreloader && (
        <Preloader show={!init.fulfilled || !wsConnected} loadError={init.rejectedWithError || wsConnectionError} />
      )}
      <ActiveModal />
      <DropAreaWrapper>
        <GridMain>
          {inited && (
            <Routes>
              <Route
                path="/channel/:channelId/:chatId"
                element={
                  <>
                    <Navbar />
                    <ChannelPage />
                  </>
                }
              />
              <Route
                path="/settings/*"
                element={
                  <>
                    <Navbar />
                    <SettingsPage />
                  </>
                }
              />
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <MainPage />
                  </>
                }
              />
            </Routes>
          )}
        </GridMain>
      </DropAreaWrapper>
    </>
  );
}

export default App;
