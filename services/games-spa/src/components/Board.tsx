import { Box, Button } from '@mui/material';
import { useState } from 'react';
import Word from './Word';
import { Card, Clue, Game } from '../types';
import Hint from './Hint';
import HintDialog from './HintDialog';
import GameOver from './GameOver';

interface BoardProps {
  game: Game | null;
  handleGuess: (card: Card) => Promise<void>;
  handleHint: (clue: Clue) => Promise<void>;
  handlePlayAgain: () => Promise<void>;
  handleSkip: () => Promise<void>;
  playerId: string;
}

const Board = ({
  game,
  handleGuess,
  handleHint,
  handlePlayAgain,
  handleSkip,
  playerId,
}: BoardProps): JSX.Element => {
  const [promptHint, setPromptHint] = useState<boolean>(false);
  const openPrompt = () => setPromptHint(true);
  const closePrompt = () => setPromptHint(false);
  const handleHintPrompt = async (clue: Clue) => {
    await handleHint(clue);
    closePrompt();
  };

  if (!game) {
    return <>Game not found</>;
  }
  if (game.winner) {
    return <GameOver playAgain={handlePlayAgain} winner={game.winner} />;
  }

  const onGuessingTeam = (
    game.guessing === 'blue_team' ? game.blue_team : game.red_team
  ).some(player => player.player_id === playerId);

  const isSpymaster =
    game.blue_team_spymaster === playerId ||
    game.red_team_spymaster === playerId;

  const isSpymasterGuessing =
    playerId ===
      (game.guessing === 'blue_team'
        ? game.blue_team_spymaster
        : game.red_team_spymaster) && !game.clue.word;

  const board: Card[] = isSpymaster ? game.key : game.board;

  const onTeam = (() => {
    if (game?.blue_team.some(player => player.player_id === playerId)) {
      return 'Blue';
    }
    if (game?.red_team.some(player => player.player_id === playerId)) {
      return 'Red';
    }
    return 'Spectator';
  })();

  return (
    <>
      <Hint clue={game.clue} team={onTeam} />
      <HintDialog
        handleHint={handleHintPrompt}
        open={promptHint}
        handleClose={closePrompt}
      />
      <Box display="flex" flexWrap="wrap" p={1} m={1}>
        {board.map(card => (
          <Box key={card.card_id} width="20%" p={1}>
            <Word card={card} guess={handleGuess} />
          </Box>
        ))}
      </Box>
      {isSpymaster ? (
        <Button
          color="primary"
          fullWidth
          type="submit"
          variant="contained"
          onClick={openPrompt}
          disabled={!isSpymasterGuessing}
        >
          Hint
        </Button>
      ) : (
        <Button
          color="primary"
          fullWidth
          type="submit"
          variant="contained"
          onClick={handleSkip}
          disabled={!onGuessingTeam}
        >
          Skip
        </Button>
      )}
    </>
  );
};

export default Board;
