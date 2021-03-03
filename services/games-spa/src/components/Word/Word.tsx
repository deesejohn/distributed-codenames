import Box from '@material-ui/core/Box';
import React from 'react';

//Types
import { Card } from '../../types';

//Styles
import { CardContainer, HiddenCard, RevealedCard } from './Word.styles';

const Word = (props: { card: Card; guess: (card: Card) => void }) => {
  const { card, guess } = props;
  return (
    <CardContainer>
      {!card.color ? (
        <HiddenCard fullWidth onClick={() => guess(card)} variant="contained">
          {card.label}
        </HiddenCard>
      ) : (
        <RevealedCard
          fullWidth
          variant="contained"
          cardColor={card.color}
          disabled
        >
          {!card.revealed ? (
            card.label
          ) : (
            <Box component="div" visibility="hidden">
              card.label
            </Box>
          )}
        </RevealedCard>
      )}
    </CardContainer>
  );
};

export default Word;
