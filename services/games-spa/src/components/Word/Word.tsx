import React from 'react';
import Box from '@material-ui/core/Box';
import { Card } from '../../types';
import {
  BlackCard,
  BlueCard,
  HiddenCard,
  RedCard,
  TanCard,
} from './Word.styles';

interface WordProps {
  card: Card;
  guess: (card: Card) => void;
}

const Word = ({ card, guess }: WordProps): JSX.Element => {
  const Content = () => (
    <Box component="div" visibility={card.revealed ? 'hidden' : 'shown'}>
      {card.label}
    </Box>
  );
  switch (card.color) {
    case 1:
      return (
        <BlueCard fullWidth>
          <Content />
        </BlueCard>
      );
    case 2:
      return (
        <RedCard fullWidth>
          <Content />
        </RedCard>
      );
    case 3:
      return (
        <TanCard fullWidth>
          <Content />
        </TanCard>
      );
    case 4:
      return (
        <BlackCard fullWidth>
          <Content />
        </BlackCard>
      );
    default:
      return (
        <HiddenCard fullWidth onClick={() => guess(card)} variant="contained">
          {card.label}
        </HiddenCard>
      );
  }
};

export default Word;
