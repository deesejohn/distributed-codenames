import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Clue } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formField: {
      margin: theme.spacing(1),
    },
  })
);

const helperText = {
  numberRequired: 'At least one guess is required',
  wordRequired: 'You must submit a word',
};
const schema = z.object({
  word: z.string({ required_error: helperText.wordRequired }),
  number: z.coerce
    .number({
      required_error: helperText.numberRequired,
      invalid_type_error: helperText.numberRequired,
    })
    .min(1, { message: helperText.numberRequired }),
});

type HintDialogSchema = z.infer<typeof schema>;

interface HintDialogProps {
  handleClose: () => void;
  handleHint: (clue: Clue) => Promise<void>;
  open: boolean;
}

const HintDialog = ({
  handleHint,
  handleClose,
  open,
}: HintDialogProps): JSX.Element => {
  const { formField } = useStyles();
  const { control, handleSubmit } = useForm<HintDialogSchema>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<HintDialogSchema> = async data => {
    await handleHint(data);
  };
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
        <form
          onSubmit={event => {
            event.preventDefault();
            handleSubmit(onSubmit)(event).catch(() => {});
          }}
        >
          <Controller
            name="word"
            control={control}
            render={({
              field: { disabled, name, onBlur, onChange, ref, value },
              fieldState: { error },
            }) => (
              <TextField
                disabled={disabled}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
                ref={ref}
                value={value}
                error={!!error}
                helperText={!!error && error.message}
                label="Word"
                fullWidth
                variant="filled"
                className={formField}
              />
            )}
          />
          <Controller
            name="number"
            control={control}
            render={({
              field: { disabled, name, onBlur, onChange, ref, value },
              fieldState: { error },
            }) => (
              <TextField
                disabled={disabled}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
                ref={ref}
                value={value}
                error={!!error}
                helperText={!!error && error.message}
                label="Number"
                fullWidth
                variant="filled"
                className={formField}
                type="number"
              />
            )}
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
