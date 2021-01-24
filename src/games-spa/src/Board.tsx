import Box from '@material-ui/core/Box';
import React from 'react';
import './Board.css';
import { Card } from './components/card/Card';
import Word from './Word';

export default function Board(props: {
	board: Card[];
	guess: (card: Card) => void;
}) {
	return (
		<Box display="flex" flexWrap="wrap" p={1} m={1}>
			{props.board.map((card) => {
				return (
					<Box width="20%" p={1}>
						<Word card={card} guess={props.guess} />
					</Box>
				);
			})}
		</Box>
	);
}
