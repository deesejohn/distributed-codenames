import React from 'react';

//Types
import { Card } from '../../types';

//Styles
import { GameCardContainer, GameCard, RevealedGameCard } from './styles';

const Word = (props: { card: Card; guess: (card: Card) => void }) => {
  const { card, guess } = props;

  return (
    <GameCardContainer>
      {!card.color ? (
        <GameCard fullWidth onClick={() => guess(card)} variant="contained">
          {card.label}
        </GameCard>
      ) : (
        <RevealedGameCard
          py={1}
          px={2}
          borderRadius={4}
          boxShadow={2}
          textAlign={'center'}
          cardColor={card.color}
        >
          {!card.revealed ? card.label : <del>{card.label}</del>}
        </RevealedGameCard>
      )}
    </GameCardContainer>
  );
};

export default Word;
