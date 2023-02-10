import axios from 'axios';
import type { tournament as TournamentT } from '@prisma/client';

export const createTournament = async (tournament: TournamentT) => {
  const response = await axios.post<TournamentT>('/api/tournaments', {
    data: tournament,
  });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const updateTournament = async (tournament: TournamentT) => {
  const response = await axios.put<TournamentT>('/api/tournaments', {
    data: tournament,
  });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const deleteSelectedTournament = async (id: number) => {
  const response = await axios.delete('/api/tournaments', { data: id });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const addPlayerToTheTournament = async (data: {
  id: number;
  unregistered_players: string;
}) => {
  const response = await axios.post('/api/tournaments/addPlayer', { data });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};
