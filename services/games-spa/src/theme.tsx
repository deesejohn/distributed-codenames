import { Theme, createTheme } from '@mui/material';
import { purple, teal } from '@mui/material/colors';

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: purple[800],
    },
    secondary: {
      main: teal[800],
    },
    mode: 'dark',
  },
});

export default theme;
