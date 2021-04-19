import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { Clue } from '../../types';

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
});

const Hint = (props: { clue: Clue }): JSX.Element => {
  const classes = useStyles();
  const { clue } = props;
  return (
    <div>
      {!clue.word ? (
        <div>Waiting for clue</div>
      ) : (
        <List className={classes.root}>
          <ListItem>
            <ListItemText primary="Word" secondary={clue?.word} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Guesses"
              secondary={`${clue?.number - 1} + 1 extra`}
            />
          </ListItem>
        </List>
      )}
    </div>
  );
};

export default Hint;
