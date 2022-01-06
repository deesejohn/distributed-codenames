import React from 'react';
import { Box, Container } from '@material-ui/core';
import './App.css';
import NicknameForm from './NicknameForm';

const App: React.FC = () => (
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
