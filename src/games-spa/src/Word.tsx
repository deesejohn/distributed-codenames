import Button from '@material-ui/core/Button';
import React from 'react';
import './Word.css';
import { Card } from './components/card/Card';

const Word = (props: { card: Card; guess: (card: Card) => void }) => {
	function getColor(
		card: Card
	): 'inherit' | 'primary' | 'secondary' | 'default' | undefined {
		if (!card.revealed) {
			return 'default';
		}
		switch (card.color) {
			case 1:
				return 'primary';
			case 2:
				return 'secondary';
			case 3:
				return 'inherit';
			default:
				return 'default';
		}
	}
	return (
		<Button
			color={getColor(props.card)}
			fullWidth
			onClick={() => props.guess(props.card)}
			variant="contained"
		>
			{props.card.label}
		</Button>
	);
};

export default Word;
