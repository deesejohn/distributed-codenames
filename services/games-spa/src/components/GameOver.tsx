import { Box, Button } from '@mui/material';
import { useCallback } from 'react';

interface GameOverProps {
  playAgain: () => Promise<void>;
  winner: string;
}

const GameOver = ({ playAgain, winner }: GameOverProps): JSX.Element => {
  const handlePlayAgain = useCallback(() => {
    (async () => {
      await playAgain();
    })().catch(() => {});
  }, [playAgain]);
  return (
    <Box display="flex" flexWrap="wrap" p={1} m={1}>
      <h3 style={{ fontSize: '24px' }}>
        {`${winner === 'blue_team' ? 'Blue Team' : 'Red Team'} Wins!`}
      </h3>
      <Button
        color="primary"
        fullWidth
        type="submit"
        variant="contained"
        onClick={handlePlayAgain}
      >
        Play Again?
      </Button>
    </Box>
  );
};

export default GameOver;
