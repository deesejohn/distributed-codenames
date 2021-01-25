import React from 'react';
import Box from '@material-ui/core/Box';

//Components
import Word from '../Word';

//Types
import { Card } from '../../types';

//Styles
import './styles.css';

const Board = (props: { board: Card[]; guess: (card: Card) => void }) => {
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
};

export default Board;
