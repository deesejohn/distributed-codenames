import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

interface GameOverProps {
  playAgain: () => Promise<void>;
  winner: string;
}

const GameOver = ({ playAgain, winner }: GameOverProps): JSX.Element => (
  <Box display="flex" flexWrap="wrap" p={1} m={1}>
    <h3 style={{ fontSize: '24px' }}>
      {`${winner === 'blue_team' ? 'Blue Team' : 'Red Team'} Wins!`}
    </h3>
    <Button
      color="primary"
      fullWidth
      type="submit"
      variant="contained"
      onClick={playAgain}
    >
      Play Again?
    </Button>
  </Box>
);

export default GameOver;
