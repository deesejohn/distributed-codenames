import React from 'react';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Clue } from '../../types';

const Hint = (props: { clue: Clue }): JSX.Element => {
  const { clue } = props;
  return (
    <Grid container justify="center" spacing={2}>
      {(clue.word && (
        <>
          <Grid item>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Word of the Day
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
      )) || (
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
      )}
    </Grid>
  );
};

export default Hint;
