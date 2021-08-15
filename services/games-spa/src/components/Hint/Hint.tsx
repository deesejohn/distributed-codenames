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

const HintClue = ({ clue }: HintProps): JSX.Element => (
  <>
    <Grid item>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Word
          </Typography>
          <Typography variant="h5" component="h2">
            {clue.word}
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
            {`${clue.number - 1} + 1 extra`}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </>
);

interface HintProps {
  clue: Clue;
}

const Hint = ({ clue }: HintProps): JSX.Element => (
  <Grid container justify="center" spacing={2}>
    {(clue.word && <HintClue clue={clue} />) || <HintWaiting />}
  </Grid>
);

export default Hint;
