import React from 'react';
import { Box, Container } from '@mui/material';
import { NicknameForm } from './components';

const App = (): JSX.Element => (
  <Container maxWidth="sm">
    <Box
      alignItems="center"
      display="flex"
      justifyContent="center"
      m={2}
      minHeight="100vh"
    >
      <NicknameForm />
    </Box>
  </Container>
);

export default App;
