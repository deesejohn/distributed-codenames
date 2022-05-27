import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import './App.css';
import { Card, Clue, Game } from './types';
import { get, guess, hint, playAgain, skip } from './api/games.api';
import Board from './components/Board/Board';
import GameOver from './components/GameOver/GameOver';
import Hint from './components/Hint/Hint';
import HintDialog from './components/HintDialog/HintDialog';

const route = window.location.pathname.split('/');
const gameId = route[2];
const playerId = document.cookie
  ?.split('; ')
  ?.find(row => row.startsWith('player_id'))
  ?.split('=')[1];

const handleGuess = async (card: Card) => {
  if (!playerId) {
    return;
  }
  await guess(gameId, playerId, card.card_id);
};

const handleHint = async (clue: Clue) => {
  if (!playerId) {
    return;
  }
  await hint(gameId, playerId, clue);
};

const handlePlayAgain = async () => {
  if (!playerId) {
    return;
  }
  await playAgain(gameId, playerId);
};

const handleSkip = () => {
  if (!playerId) {
    return;
  }
  (async () => {
    await skip(gameId, playerId);
  })().catch(() => {});
};

const sessionUrl = new URL(
  `/api/games/session?game_id=${gameId}`,
  window.location.href
);
sessionUrl.protocol = sessionUrl.protocol.replace('http', 'ws');

const Content = ({ game }: { game: Game | null }): JSX.Element => {
  const [promptHint, setPromptHint] = useState<boolean>(false);

  useEffect(() => {
    if (!game || !game.clue || !game.clue.word) {
      return;
    }
    setPromptHint(false);
  }, [game]);

  const openPrompt = useCallback(() => setPromptHint(true), [setPromptHint]);
  const closePrompt = useCallback(() => setPromptHint(false), [setPromptHint]);

  const onGuessingTeam = useMemo(() => {
    if (!game || !playerId) {
      return false;
    }
    const team = game.guessing === 'blue_team' ? game.blue_team : game.red_team;
    return team.some(player => player.player_id === playerId);
  }, [game]);

  const isSpymaster = useMemo(
    () =>
      [game?.blue_team_spymaster, game?.red_team_spymaster].includes(playerId),
    [game]
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
  }, [game]);

  const board: Card[] = useMemo(
    () => (isSpymaster ? game?.key : game?.board) || [],
    [game, isSpymaster]
  );

  const onTeam = useMemo(() => {
    if (game?.blue_team.some(player => player.player_id === playerId)) {
      return 'Blue';
    }
    if (game?.red_team.some(player => player.player_id === playerId)) {
      return 'Red';
    }
    return 'Spectator';
  }, [game]);

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
      <Hint clue={game.clue} team={onTeam} />
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

const App = (): JSX.Element => {
  const [game, setGame] = useState<Game | null>(null);
  const [ws, setWs] = useState<WebSocket>(() => new WebSocket(sessionUrl.href));

  useEffect(() => {
    (async () => {
      const response = await get(gameId);
      setGame(response);
    })().catch(() => setGame(null));
  }, [setGame]);

  useEffect(() => {
    ws.onclose = () => {
      setWs(() => new WebSocket(sessionUrl.href));
    };
    ws.onmessage = ({ data }) => {
      if (typeof data === 'string') {
        setGame(JSON.parse(data) as Game);
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
        <Content game={game} />
      </Box>
    </Container>
  );
};

export default App;
