import React from 'react';

//Types
import { Card } from '../../types';

//Styles
import { GameCardContainer, GameCard, RevealedGameCard } from './styles';

const Word = (props: { card: Card; guess: (card: Card) => void }) => {
  const { card, guess } = props;

  return (
    <GameCardContainer>
      {!card.revealed ? (
        <GameCard fullWidth onClick={() => guess(card)} variant="contained">
          {card.label}
        </GameCard>
      ) : (
        <RevealedGameCard cardType={card.color}>{card.label}</RevealedGameCard>
      )}
    </GameCardContainer>
  );
};

export default Word;
