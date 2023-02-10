import axios from 'axios';
import type { match as MatchT } from '@prisma/client';

export const createMatch = async (tournament: MatchT) => {
  const response = await axios.post<MatchT>('/api/matches', {
    data: tournament,
  });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const updateMatch = async (match: MatchT) => {
  const response = await axios.put<MatchT>('/api/matches', { data: match });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};
