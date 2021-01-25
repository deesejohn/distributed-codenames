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

//Types
import { Game, Card } from './types';

//Styles
import './App.css';

export default function App() {
  const [game, setGame] = useState<Game | null>(null);
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
      ?.find((row) => row.startsWith('player_id'))
      ?.split('=')[1];
  }, [document.cookie]);

  //Callbacks
  const handleOnClickGuess = useCallback(
    async (card: Card) => {
      const data = {
        player_id: player_id,
        card_id: card.card_id,
      };
      console.log(data, 'guess');
      try {
        const response = await gameApi.post(game_id, data);
        return response.status;
      } catch (error) {
        console.warn(error);
      }
    },
    [game_id, player_id]
  );

  const getGameSession = useCallback(async () => {
    try {
      const response = await gameApi.get(game_id);
      setGame(response.data);
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
  }, [game_id]);

  useEffect(() => {
    if (!game) {
      return;
    }
    console.log(game);
  }, [game]);

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
        ) : (
          <Board board={game.board} guess={handleOnClickGuess} />
        )}
      </Box>
    </Container>
  );
}
