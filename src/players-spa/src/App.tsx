import React from 'react';
import Container from '@material-ui/core/Container';
import './App.css';
import NicknameForm from './NicknameForm';
import Box from '@material-ui/core/Box';

function App() {
  return (
    <Container maxWidth="sm">
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        m={2}
        minHeight="100vh"
      >
        <NicknameForm></NicknameForm>
      </Box>
    </Container>
  );
}

export default App;
