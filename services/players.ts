import axios from 'axios';
import type { player as PlayerT } from '@prisma/client';

export const createPlayer = async (
  playerWElo: PlayerT & { elo_points: number | null }
) => {
  const response = await axios.post<PlayerT>('/api/player', {
    data: playerWElo,
  });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const updatePlayer = async (playerWElo: PlayerT & { elo_points: number | null }) => {
  const response = await axios.put<PlayerT>('/api/player', { data: playerWElo });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const deleteSelectedPlayer = async (id: number) => {
  const response = await axios.delete('/api/player', { data: id });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};
