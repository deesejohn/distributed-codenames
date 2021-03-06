import { purple, teal } from '@material-ui/core/colors';
import { Theme } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';

const muiTheme: Theme = createTheme({
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

export default muiTheme;
