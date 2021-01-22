import React, { useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import './App.css';
import { Game } from './Game';
import Board from './Board';
import { Card } from './Card';

export default function App() {
  const [game, setGame] = useState<Game | null>(null);
  const reconnect = useRef(100);
  const ws = useRef<WebSocket>();
  const route = window.location.pathname.split('/');
  const game_id = route[route.length - 1];
  const player_id = document.cookie
    ?.split('; ')
    ?.find(row => row.startsWith('player_id'))
    ?.split('=')[1];
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
    (async () => {
      const response = await fetch('/api/games/'+game_id);
      const body = await response.json();
      setGame(body)
    })().then(() => subscribeToGameSession());
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
  function guess(card: Card) {
    fetch(`/api/games/${game_id}/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player_id: player_id,
        card_id: card.card_id,
      }),
    }).then(response => response.status);
  }
  return (
    <Container maxWidth="md">
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        m={2}
        minHeight="100vh"
      >
        { game === null ? (
          <div><CircularProgress /> Loading...</div>
        ) : (
          <Board board={game.board} guess={guess} />
        )}
      </Box>
    </Container>
  );
}
