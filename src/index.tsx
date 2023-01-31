import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@store/index';
import { LSA } from '@common/utils/LSA';
import { Shortcut } from '@common/utils/Shortcut/shortcut';
import './index.css';

if (window.location.pathname === '/app') {
  window.history.replaceState(null, '', '/');
}

if (!localStorage.getItem('access_token')) {
  window.location.pathname = '/login.html';
}

export const lsa = new LSA();
export const shortcut = new Shortcut();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
