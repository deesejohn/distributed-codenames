import React from 'react';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Clue } from '../../types';

const HintWaiting = (): JSX.Element => (
  <Grid item>
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Waiting for spymaster
        </Typography>
        <Typography variant="h5" component="h2">
          No clue
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

const HintClue = ({ number, word }: Clue): JSX.Element => (
  <>
    <Grid item>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Word
          </Typography>
          <Typography variant="h5" component="h2">
            {word}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Number
          </Typography>
          <Typography variant="h5" component="h2">
            {`${number - 1} + 1 extra`}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </>
);

interface HintProps {
  clue: Clue;
  team: string;
}
const Hint = ({ clue, team }: HintProps): JSX.Element => (
  <Grid container justifyContent="center" spacing={2}>
    <Grid item>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            You are on team
          </Typography>
          <Typography variant="h5" component="h2">
            {team}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    {clue.word ? (
      <HintClue number={clue.number} word={clue.word} />
    ) : (
      <HintWaiting />
    )}
  </Grid>
);

export default Hint;
