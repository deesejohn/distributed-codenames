import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Clue } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formField: {
      margin: theme.spacing(1),
    },
  })
);

const validationSchema = yup.object({
  word: yup.string().required('A word is required'),
  number: yup
    .number()
    .min(1, 'At least one guess is required')
    .required('At least one guess is required'),
});

interface HintDialogProps {
  handleClose: () => void;
  handleHint: (clue: Clue) => Promise<void>;
  open: boolean;
}

const HintDialog: FC<HintDialogProps> = ({ handleHint, handleClose, open }) => {
  const { formField } = useStyles();
  const { errors, handleChange, handleSubmit, touched, values } = useFormik({
    initialValues: {
      word: '',
      number: 0,
    },
    validationSchema,
    onSubmit: (clue: Clue) => handleHint(clue),
  });
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
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="word"
            name="word"
            label="Word"
            value={values.word}
            onChange={handleChange}
            error={touched.word && !!errors.word}
            helperText={touched.number && !!errors.number && errors.number}
            variant="filled"
            className={formField}
          />
          <TextField
            fullWidth
            id="number"
            name="number"
            label="Number"
            type="number"
            value={values.number}
            onChange={handleChange}
            error={touched.number && !!errors.number}
            helperText={touched.number && !!errors.number && errors.number}
            variant="filled"
            className={formField}
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
