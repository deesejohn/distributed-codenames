import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';

//Types
import { Card } from '../../types';

//Styles
import './styles.css';

const Word = (props: { card: Card; guess: (card: Card) => void }) => {
  const { card, guess } = props;

  const getCardColor = useCallback(
    (
      card: Card
    ): 'inherit' | 'primary' | 'secondary' | 'default' | undefined => {
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
    },
    [card]
  );

  return (
    <Button
      color={getCardColor(card)}
      fullWidth
      onClick={() => guess(card)}
      variant="contained"
    >
      {card.label}
    </Button>
  );
};

export default Word;
