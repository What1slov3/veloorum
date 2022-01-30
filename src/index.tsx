import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import KEC from './common/utils/KEC/index';
import { LSA } from './common/utils/LSA';

if (window.location.pathname === '/app') {
  window.history.replaceState(null, '', '/');
}

if (!localStorage.getItem('access_token')) {
  window.location.pathname = '/login.html';
}

export const kec = new KEC();
kec.init();
export const lsa = new LSA();
lsa.init();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
