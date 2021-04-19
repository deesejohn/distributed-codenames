import React from 'react';
import { render } from 'react-dom';
import {
  CssBaseline,
  MuiThemeProvider,
  StylesProvider,
} from '@material-ui/core';
import { ThemeProvider } from 'styled-components';

import muiTheme from './theme';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ThemeProvider theme={muiTheme}>
          <App />
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
