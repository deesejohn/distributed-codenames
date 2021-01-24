import React, { useEffect, useCallback, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import './App.css';
import { Game } from './Game';
import Board from './Board';
import { Card } from './components/card/Card';

//API
import gameApi from './axios/games.api';

export default function App() {
	const [game, setGame] = useState<Game | null>(null);
	const reconnect = useRef(100);
	const ws = useRef<WebSocket>();
	const route = window.location.pathname.split('/');
	const game_id = route[route.length - 1];
	const player_id = document.cookie
		?.split('; ')
		?.find((row) => row.startsWith('player_id'))
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
			const response = await gameApi.get(game_id);
			const data = await response.data;
			setGame(data);
		})().then(() => subscribeToGameSession());
		return () => {
			ws.current?.close();
		};
	}, [game_id]);

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
