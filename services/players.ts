import axios from 'axios';
import type { player as PlayerT } from '@prisma/client';

export const createPlayer = async (player: PlayerT) => {
  const response = await axios.post<PlayerT>('/api/players', { data: player });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const updatePlayer = async (player: PlayerT) => {
  const response = await axios.put<PlayerT>('/api/players', { data: player });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const deleteSelectedPlayer = async (id: number) => {
  const response = await axios.delete('/api/players', { data: id });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};
