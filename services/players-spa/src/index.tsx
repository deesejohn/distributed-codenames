import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { purple, teal } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[800],
    },
    secondary: {
      main: teal[800],
    },
    type: 'dark',
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
