import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button/Button';
import { useForm } from 'react-hook-form';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

export default function NicknameForm() {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (data: any) => {
    let baseUri = process.env.REACT_APP_PLAYERS_API || '/';
    let response = await fetch(baseUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    let id = await response.json()
    // expire after 1 day
    const date = new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000));

    document.cookie = `player_id=${id}`
      + `; expires=${date.toUTCString()}`
      + '; path=/'
      + '; samesite=lax';

    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect_uri');
    if (!!redirectUrl && redirectUrl.startsWith('/')) {
      window.location.assign(redirectUrl);
    }
  };
  return (
    <form
      className={classes.root}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        error={errors.nickname}
        fullWidth
        inputRef={register({
          required: true
        })}
        label="Nickname"
        helperText={errors.nickname ? 'Please provide a nickname' : null}
        name="nickname"
        variant="filled" />
      <Button
        color="primary"
        fullWidth
        type="submit"
        variant="contained">
        Submit
      </Button>
    </form>
  );
}