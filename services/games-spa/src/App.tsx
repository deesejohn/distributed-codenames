import React, {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import './App.css';
import { Card, Clue, Game } from './types';
import GamesClient from './api/games.api';
import { Board, GameOver, Hint, HintDialog } from './components';

export default function App(): JSX.Element {
  const [game, setGame] = useState<Game | null>(null);
  const [promptHint, setPromptHint] = useState<boolean>(false);
  const reconnect = useRef(100);
  const ws = useRef<WebSocket>();
  const route = window.location.pathname.split('/');
  const gameId = route[route.length - 1];
  const playerId = document.cookie
    ?.split('; ')
    ?.find(row => row.startsWith('player_id'))
    ?.split('=')[1];

  const onGuessingTeam = useMemo(() => {
    if (!game || !playerId) {
      return false;
    }
    const team = game.guessing === 'blue_team' ? game.blue_team : game.red_team;
    return team.some(player => player.player_id === playerId);
  }, [game, playerId]);

  const isSpymaster = useMemo(
    () =>
      [game?.blue_team_spymaster, game?.red_team_spymaster].includes(playerId),
    [game, playerId]
  );

  const isSpymasterGuessing = useMemo(() => {
    if (!game) {
      return false;
    }
    const spymasterId =
      game.guessing === 'blue_team'
        ? game.blue_team_spymaster
        : game.red_team_spymaster;
    return playerId === spymasterId && !game.clue.word;
  }, [game, playerId]);

  const getGameSession = useCallback(async () => {
    try {
      const response = await GamesClient.get(gameId);
      setGame(response);
    } catch (error) {
      setGame(null);
    }
  }, [gameId, setGame]);

  const handleGuess = useCallback(
    async (card: Card) => {
      if (!playerId) {
        return;
      }
      await GamesClient.guess(gameId, playerId, card.card_id);
    },
    [gameId, playerId]
  );

  const handleHint = useCallback(
    async (clue: Clue) => {
      if (!playerId) {
        return;
      }
      await GamesClient.hint(gameId, playerId, clue);
    },
    [gameId, playerId]
  );

  const handlePlayAgain = useCallback(async () => {
    if (!playerId) {
      return;
    }
    await GamesClient.playAgain(gameId, playerId);
  }, [gameId, playerId]);

  const handleSkip = useCallback(async () => {
    if (!playerId) {
      return;
    }
    await GamesClient.skip(gameId, playerId);
  }, [gameId, playerId]);

  useEffect(() => {
    function subscribeToGameSession() {
      const url = new URL(
        `/api/games/session?game_id=${gameId}`,
        window.location.href
      );
      url.protocol = url.protocol.replace('http', 'ws');
      ws.current = new WebSocket(url.href);
      ws.current.onopen = () => {
        reconnect.current = 100;
      };
      ws.current.onclose = () => {
        setTimeout(subscribeToGameSession, reconnect.current);
        reconnect.current = Math.max(5000, reconnect.current * 1.2);
      };
      ws.current.onmessage = ({ data }) => {
        setGame(JSON.parse(data));
      };
    }
    getGameSession().catch(() => {});
    subscribeToGameSession();
    return () => {
      ws.current?.close();
    };
  }, [gameId, getGameSession]);

  useEffect(() => {
    if (!game || !game.clue || !game.clue.word) {
      return;
    }
    setPromptHint(false);
  }, [game]);

  const board: Card[] = (isSpymaster ? game?.key : game?.board) || [];

  const openPrompt = () => setPromptHint(true);
  const closePrompt = () => setPromptHint(false);

  const Content = (): JSX.Element => {
    if (!game) {
      return (
        <>
          <CircularProgress /> Loading...
        </>
      );
    }
    if (game.winner) {
      return <GameOver playAgain={handlePlayAgain} winner={game.winner} />;
    }
    return (
      <>
        <Hint clue={game.clue} />
        <HintDialog
          handleHint={handleHint}
          open={promptHint}
          handleClose={closePrompt}
        />
        <Board board={board} guess={handleGuess} />
        {isSpymaster ? (
          <Button
            color="primary"
            fullWidth
            type="submit"
            variant="contained"
            onClick={openPrompt}
            disabled={!isSpymasterGuessing}
          >
            Hint
          </Button>
        ) : (
          <Button
            color="primary"
            fullWidth
            type="submit"
            variant="contained"
            onClick={handleSkip}
            disabled={!onGuessingTeam}
          >
            Skip
          </Button>
        )}
      </>
    );
  };
  return (
    <Container maxWidth="md">
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        minHeight="100vh"
      >
        <Content />
      </Box>
    </Container>
  );
}
