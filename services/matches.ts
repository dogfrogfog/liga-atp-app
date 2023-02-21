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
  const [responseMatches, responseRanking] = await Promise.all([
    axios.put('/api/matches', { data: match }),
    // to update ranking
    axios.post('/api/ranking', { data: match }),
  ]);

  if (responseMatches.status === 200 && responseRanking.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: responseMatches.statusText };
  }
};
