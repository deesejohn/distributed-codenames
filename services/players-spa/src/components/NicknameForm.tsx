import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField } from '@mui/material';
import { createPlayer, updatePlayer } from '../api';

const validationSchema = yup.object({
  nickname: yup.string().required('Please provide a nickname'),
});

const onSubmit = async (data: { nickname: string }) => {
  const playerId = document.cookie
    ?.split('; ')
    ?.find(row => row.startsWith('player_id'))
    ?.split('=')[1];
  if (!playerId) {
    const id = await createPlayer(data);
    // expire after 1 day
    const date = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
    document.cookie =
      `player_id=${id}` +
      `; expires=${date.toUTCString()}` +
      '; path=/' +
      '; samesite=lax';
  } else {
    await updatePlayer(playerId, data);
  }
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get('redirect_uri');
  if (!!redirectUrl && redirectUrl.startsWith('/')) {
    window.location.assign(redirectUrl);
  }
};

const NicknameForm = (): JSX.Element => {
  const { errors, handleChange, handleSubmit, touched, values } = useFormik({
    initialValues: {
      nickname: '',
    },
    validationSchema,
    onSubmit,
  });
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        id="nickname"
        name="nickname"
        label="Nickname"
        value={values.nickname}
        onChange={handleChange}
        error={touched.nickname && !!errors.nickname}
        helperText={touched.nickname && errors.nickname}
        variant="filled"
        margin="normal"
      />
      <Button color="primary" fullWidth type="submit" variant="contained">
        Submit
      </Button>
    </form>
  );
};

export default NicknameForm;
