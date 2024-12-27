import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { BrowserRouter, HashRouter } from 'react-router-dom';
import { MercadoApp } from './MercadoApp';

import './index.css';
import { store } from './store/store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {
        process.env.REACT_APP_DEV
        ?
          <BrowserRouter>
            <MercadoApp/>
          </BrowserRouter >
        :
          <HashRouter>
            <MercadoApp/>
          </HashRouter >
      }
    </Provider>
  </React.StrictMode>
);