import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { startScheduler } from './scheduler';

startScheduler();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);