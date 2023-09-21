import { CircularProgress, Container, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { get, guess, hint, playAgain, skip } from './api/games.api';
import { Board } from './components';
import { Card, Clue, Game } from './types';

const route = window.location.pathname.split('/');
const gameId = route[2];
const playerId = document.cookie
  .split('; ')
  .find(row => row.startsWith('player_id'))
  ?.split('=')[1];

if (!playerId) {
  document.location.assign(
    `/players?redirect_uri=${document.location.pathname}`,
  );
}

const handleGuess = (card: Card) => guess(gameId, playerId!, card.card_id);
const handleHint = (clue: Clue) => hint(gameId, playerId!, clue);
const handlePlayAgain = () => playAgain(gameId, playerId!);
const handleSkip = () => skip(gameId, playerId!);

const sessionUrl = new URL(
  `/api/games/session?game_id=${gameId}`,
  window.location.href,
);
sessionUrl.protocol = sessionUrl.protocol.replace('http', 'ws');

const App = (): JSX.Element => {
  const [ws, setWs] = useState<WebSocket>(() => new WebSocket(sessionUrl.href));
  const [game, setGame] = useState<Game | null | undefined>(undefined);

  useEffect(() => {
    get(gameId)
      .then(result => setGame(result))
      .catch(() => setGame(null));
  }, []);

  useEffect(() => {
    ws.onclose = () => {
      setWs(() => new WebSocket(sessionUrl.href));
    };
    ws.onmessage = ({ data }) => {
      if (typeof data === 'string') {
        setGame(JSON.parse(data));
      }
    };
    return () => {
      ws.close();
    };
  }, [ws, setGame, setWs]);

  return (
    <Container maxWidth="md">
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        minHeight="100vh"
      >
        {game === undefined ? (
          <>
            <CircularProgress /> Loading...
          </>
        ) : (
          <Board
            game={game}
            handleGuess={handleGuess}
            handleHint={handleHint}
            handlePlayAgain={handlePlayAgain}
            handleSkip={handleSkip}
            playerId={playerId!}
          />
        )}
      </Box>
    </Container>
  );
};

export default App;
