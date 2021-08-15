import React from 'react';
import Box from '@material-ui/core/Box';
import Word from '../Word/Word';
import { Card } from '../../types';

interface BoardProps {
  board: Card[];
  guess: (card: Card) => void;
}

const Board = ({ board, guess }: BoardProps): JSX.Element => (
  <Box display="flex" flexWrap="wrap" p={1} m={1}>
    {board.map(card => (
      <Box width="20%" p={1}>
        <Word card={card} guess={guess} />
      </Box>
    ))}
  </Box>
);

export default Board;
