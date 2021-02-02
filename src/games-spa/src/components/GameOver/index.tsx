import Box from '@material-ui/core/Box';

const GamerOver = (props: { winner: string }) => {
  const message = `${
    props.winner === 'red_team' ? 'Red Team' : 'Blue Team'
  } Wins!`;

  return (
    <Box display="flex" flexWrap="wrap" p={1} m={1}>
      <h3 style={{ fontSize: '24px' }}>{message}</h3>
    </Box>
  );
};

export default GamerOver;
