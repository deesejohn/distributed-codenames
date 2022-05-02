import React, { useCallback } from 'react';
import Box from '@material-ui/core/Box';
import { Card } from '../../types';
import {
  BlackCard,
  BlueCard,
  HiddenCard,
  RedCard,
  TanCard,
} from './Word.styles';

const Content = ({
  label,
  revealed,
}: {
  label: string;
  revealed: boolean;
}): JSX.Element => (
  <Box component="div" visibility={revealed ? 'hidden' : 'shown'}>
    {label}
  </Box>
);

interface WordProps {
  card: Card;
  guess: (card: Card) => Promise<void>;
}
const Word = ({ card, guess }: WordProps): JSX.Element => {
  const handleGuess = useCallback(() => {
    guess(card).catch(() => {});
  }, [card, guess]);
  switch (card.color) {
    case 1:
      return (
        <BlueCard fullWidth>
          <Content label={card.label} revealed={card.revealed} />
        </BlueCard>
      );
    case 2:
      return (
        <RedCard fullWidth>
          <Content label={card.label} revealed={card.revealed} />
        </RedCard>
      );
    case 3:
      return (
        <TanCard fullWidth>
          <Content label={card.label} revealed={card.revealed} />
        </TanCard>
      );
    case 4:
      return (
        <BlackCard fullWidth>
          <Content label={card.label} revealed={card.revealed} />
        </BlackCard>
      );
    default:
      return (
        <HiddenCard fullWidth onClick={handleGuess} variant="contained">
          {card.label}
        </HiddenCard>
      );
  }
};

export default Word;
