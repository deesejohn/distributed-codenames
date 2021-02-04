import { ScDefaultTheme } from 'styled-components';

import { purple, teal } from '@material-ui/core/colors';

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createMuiTheme } from '@material-ui/core/styles';

const scTheme: ScDefaultTheme = {
  colors: {
    blue: '#25769f',
    red: '#d54542',
    tan: '#d3c699',
    black: '#454042',
  },
};

const muiTheme: Theme = createMuiTheme({
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

export { scTheme, muiTheme };
