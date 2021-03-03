import React from 'react';
import Box from '@material-ui/core/Box';

//Components
import Word from '../Word/Word';

//Types
import { Card } from '../../types';

const Board = (props: { board: Card[]; guess: (card: Card) => void }) => {
  const { board, guess } = props;
  return (
    <Box display="flex" flexWrap="wrap" p={1} m={1}>
      {board.map(card => {
        return (
          <Box width="20%" p={1}>
            <Word card={card} guess={guess} />
          </Box>
        );
      })}
    </Box>
  );
};

export default Board;
