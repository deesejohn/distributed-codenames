export const basePath = process.env.REACT_APP_PLAYERS_API || '/';

export const createPlayer = async (player: {
  nickname: string;
}): Promise<string> => {
  const response = await fetch(basePath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(player),
  });
  return (await response.json()) as string;
};

export const updatePlayer = async (
  playerId: string,
  player: { nickname: string }
): Promise<void> => {
  await fetch(basePath + playerId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(player),
  });
};
