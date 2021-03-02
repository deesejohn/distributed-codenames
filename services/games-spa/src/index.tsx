import React from 'react';
import { render } from 'react-dom';

import CssBaseline from '@material-ui/core/CssBaseline';

// Theme Components
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import { muiTheme } from './theme';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

render(
  <React.StrictMode>
    <MuiThemeProvider theme={muiTheme}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
