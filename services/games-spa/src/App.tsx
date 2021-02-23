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

//API
import gameApi from './api/games.api';

//Components
import Board from './components/Board';
import GameOver from './components/GameOver';
import Hint from './components/Hint';
import HintDialog from './components/HintDialog';

//Types
import { Card, Clue, Game } from './types';

//Styles
import './App.css';
import Button from '@material-ui/core/Button';

export default function App() {
  const [game, setGame] = useState<Game | null>(null);
  const [promptHint, setPromptHint] = useState<boolean>(false);
  const reconnect = useRef(100);
  const ws = useRef<WebSocket>();
  const route = window.location.pathname.split('/');

  //Memos
  const game_id = useMemo(() => {
    return route[route.length - 1];
  }, [route]);

  const player_id = useMemo(() => {
    return document.cookie
      ?.split('; ')
      ?.find(row => row.startsWith('player_id'))
      ?.split('=')[1];
  }, []);

  //Callbacks
  const handleOnClickGuess = useCallback(
    async (card: Card) => {
      if (!player_id) {
        return;
      }
      try {
        await gameApi.guess(game_id, player_id, card.card_id);
      } catch (error) {
        console.warn(error);
      }
    },
    [game_id, player_id]
  );

  const getGameSession = useCallback(async () => {
    try {
      const response = await gameApi.get(game_id);
      setGame(response);
    } catch (error) {
      console.warn(error);
    }
  }, [game_id, setGame]);

  //Effects
  useEffect(() => {
    function subscribeToGameSession() {
      const url = new URL(
        `/api/games/session?game_id=${game_id}`,
        window.location.href
      );
      url.protocol = url.protocol.replace('http', 'ws');
      ws.current = new WebSocket(url.href);
      ws.current.onopen = () => {
        console.log('opened');
        reconnect.current = 100;
      };
      ws.current.onclose = () => {
        console.log('closed, reconnecting...');
        setTimeout(subscribeToGameSession, reconnect.current);
        reconnect.current = Math.max(5000, reconnect.current * 1.2);
      };
      ws.current.onmessage = (message: any) => {
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
    if (!game || !player_id) {
      return;
    }
    const spymaster =
      game.guessing === 'blue_team'
        ? game.blue_team_spymaster
        : game.red_team_spymaster;
    setPromptHint(player_id === spymaster && !game.clue.word);
    console.log(game);
  }, [game, player_id]);

  const handleHint = async (clue: Clue) => {
    if (!player_id) {
      return;
    }
    await gameApi.hint(game_id, player_id, clue);
  };

  const handleSkip = async () => {
    if (!player_id) {
      return;
    }
    await gameApi.skip(game_id, player_id);
  };

  return (
    <Container maxWidth="md">
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        m={2}
        minHeight="100vh"
      >
        {game === null ? (
          <div>
            <CircularProgress /> Loading...
          </div>
        ) : !game.winner ? (
          <div>
            <Hint clue={game.clue}></Hint>
            <HintDialog handleHint={handleHint} open={promptHint}></HintDialog>
            <Board board={game.board} guess={handleOnClickGuess} />
            <Button
              color="primary"
              fullWidth
              type="submit"
              variant="contained"
              onClick={handleSkip}
            >
              Skip
            </Button>
          </div>
        ) : (
          <GameOver winner={game.winner} />
        )}
      </Box>
    </Container>
  );
}
