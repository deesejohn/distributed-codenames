import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  })
);

const validationSchema = yup.object({
  nickname: yup.string().required('Please provide a nickname'),
});

const baseUri = process.env.REACT_APP_PLAYERS_API || '/';

const createPlayer = async (player: { nickname: string }): Promise<string> => {
  const response = await fetch(baseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(player),
  });
  return (await response.json()) as string;
};

const updatePlayer = async (
  playerId: string,
  player: { nickname: string }
): Promise<void> => {
  await fetch(`${baseUri}/${playerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(player),
  });
};

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

export default function NicknameForm(): JSX.Element {
  const classes = useStyles();
  const { errors, handleChange, handleSubmit, touched, values } = useFormik({
    initialValues: {
      nickname: '',
    },
    validationSchema,
    onSubmit,
  });
  return (
    <form className={classes.root} onSubmit={handleSubmit}>
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
      />
      <Button color="primary" fullWidth type="submit" variant="contained">
        Submit
      </Button>
    </form>
  );
}
