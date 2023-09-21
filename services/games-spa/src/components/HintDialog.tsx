import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Box,
  Button,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Clue } from '../types';

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
  const {
    control,
    formState: { isSubmitSuccessful },
    handleSubmit,
    reset,
  } = useForm<HintDialogSchema>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<HintDialogSchema> = async data => {
    await handleHint(data);
  };
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);
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
                margin="normal"
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
                type="number"
                margin="normal"
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
