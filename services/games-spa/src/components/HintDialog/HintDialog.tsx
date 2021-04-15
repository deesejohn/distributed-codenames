import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Clue } from '../../types';
import { useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

const HintDialog = (props: {
  handleClose: () => void;
  handleHint: (clue: Clue) => Promise<void>;
  open: boolean;
}) => {
  const { handleHint, handleClose, open } = props;
  const { errors, handleSubmit, register } = useForm();
  const onSubmit = async (clue: Clue) => await handleHint(clue);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Hint</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Give a hint and the number of words on the board it relates to
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            error={errors.word}
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
            error={errors.number}
            fullWidth
            inputRef={register({
              required: true,
            })}
            label="Number"
            helperText={errors.number ? 'Please provide a number' : null}
            name="number"
            type="number"
          />
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-evenly"
            m={2}
          >
            <Button color="primary" type="submit" variant="contained">
              Submit
            </Button>
            <Button onClick={handleClose}>Dismiss</Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HintDialog;
