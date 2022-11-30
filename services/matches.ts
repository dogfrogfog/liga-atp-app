import axios from 'axios';
import type { match as MatchT } from '@prisma/client';

interface MatchesResponse<D> {
  data?: D;
  isOk: boolean;
  errorMessage?: string;
}

type ICreateMatchResponse = MatchesResponse<MatchT>;
type IUpdateMatchResponse = MatchesResponse<MatchT>;

export async function createMatch(tournament: MatchT): Promise<ICreateMatchResponse> {
  const response = await axios.post<MatchT>('/api/matches', { data: tournament });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}

export async function updateMatch(match: MatchT): Promise<IUpdateMatchResponse> {
  const response = await axios.put<MatchT>('/api/matches', { data: match });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}

export async function updateScore(id: number, score: string): Promise<IUpdateMatchResponse> {
  const response = await axios.put<MatchT>('/api/matches', { data: { id, score } });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}