import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Clue } from '../../types';
import { useForm } from 'react-hook-form';

const HintDialog = (props: {
  handleHint: (clue: Clue) => Promise<void>;
  open: boolean;
}) => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (clue: Clue) => {
    await props.handleHint(clue);
  };
  const { open } = props;
  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Hint</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Give a hint and the number of words on the board it relates to
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            error={errors.nickname}
            fullWidth
            inputRef={register({
              required: true,
            })}
            label="Word"
            helperText={errors.word ? 'Please provide a word' : null}
            name="word"
            variant="filled"
          />
          <TextField
            error={errors.nickname}
            fullWidth
            inputRef={register({
              required: true,
            })}
            label="Number"
            helperText={errors.word ? 'Please provide a number' : null}
            name="number"
            type="number"
          />
          <Button color="primary" fullWidth type="submit" variant="contained">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HintDialog;
