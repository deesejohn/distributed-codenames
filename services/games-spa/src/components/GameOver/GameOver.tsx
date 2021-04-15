import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const GameOver = (props: {
  playAgain: () => Promise<void>;
  winner: string;
}) => {
  const { playAgain, winner } = props;
  const message = `${winner === 'red_team' ? 'Red Team' : 'Blue Team'} Wins!`;
  return (
    <Box display="flex" flexWrap="wrap" p={1} m={1}>
      <h3 style={{ fontSize: '24px' }}>{message}</h3>
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
};

export default GameOver;
