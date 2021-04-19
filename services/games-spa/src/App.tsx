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
import { GamesClient } from './api/games.api';
import { Board, GameOver, Hint, HintDialog } from './components';

export default function App(): JSX.Element {
  const [game, setGame] = useState<Game | null>(null);
  const [promptHint, setPromptHint] = useState<boolean>(false);
  const reconnect = useRef(100);
  const ws = useRef<WebSocket>();
  const route = window.location.pathname.split('/');
  const game_id = route[route.length - 1];
  const player_id = document.cookie
    ?.split('; ')
    ?.find(row => row.startsWith('player_id'))
    ?.split('=')[1];

  const onGuessingTeam = useMemo(() => {
    if (!game || !player_id) {
      return false;
    }
    const team = game.guessing === 'blue_team' ? game.blue_team : game.red_team;
    return team.some(player => player.player_id === player_id);
  }, [game, player_id]);

  const isSpymaster = useMemo(
    () =>
      [game?.blue_team_spymaster, game?.red_team_spymaster].includes(player_id),
    [game, player_id]
  );

  const isSpymasterGuessing = useMemo(() => {
    if (!game) {
      return false;
    }
    const spymasterId =
      game.guessing === 'blue_team'
        ? game.blue_team_spymaster
        : game.red_team_spymaster;
    return player_id === spymasterId && !game.clue.word;
  }, [game, player_id]);

  const getGameSession = useCallback(async () => {
    try {
      const response = await GamesClient.get(game_id);
      setGame(response);
    } catch (error) {
      setGame(null);
    }
  }, [game_id, setGame]);

  const handleGuess = useCallback(
    async (card: Card) => {
      if (!player_id) {
        return;
      }
      await GamesClient.guess(game_id, player_id, card.card_id);
    },
    [game_id, player_id]
  );

  const handleHint = useCallback(
    async (clue: Clue) => {
      if (!player_id) {
        return;
      }
      await GamesClient.hint(game_id, player_id, clue);
    },
    [game_id, player_id]
  );

  const handlePlayAgain = useCallback(async () => {
    if (!player_id) {
      return;
    }
    await GamesClient.playAgain(game_id, player_id);
  }, [game_id, player_id]);

  const handleSkip = useCallback(async () => {
    if (!player_id) {
      return;
    }
    await GamesClient.skip(game_id, player_id);
  }, [game_id, player_id]);

  useEffect(() => {
    function subscribeToGameSession() {
      const url = new URL(
        `/api/games/session?game_id=${game_id}`,
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
      ws.current.onmessage = (message: { data: string }) => {
        setGame(JSON.parse(message.data));
      };
    }
    getGameSession();
    subscribeToGameSession();
    return () => {
      ws.current?.close();
    };
  }, [game_id, getGameSession]);

  useEffect(() => {
    if (!game || !game.clue || !game.clue.word) {
      return;
    }
    setPromptHint(false);
  }, [game]);

  const board: Card[] = (isSpymaster ? game?.key : game?.board) || [];

  const openPrompt = () => setPromptHint(true);
  const closePrompt = () => setPromptHint(false);

  return (
    <Container maxWidth="md">
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        m={2}
        minHeight="100vh"
      >
        {game === null && (
          <div>
            <CircularProgress /> Loading...
          </div>
        )}
        {game && game.winner && (
          <GameOver playAgain={handlePlayAgain} winner={game.winner} />
        )}
        {game && !game.winner && (
          <div>
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
          </div>
        )}
      </Box>
    </Container>
  );
}
