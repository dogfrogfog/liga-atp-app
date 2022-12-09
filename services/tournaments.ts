import axios from 'axios';
import type { tournament as TournamentT, Prisma } from '@prisma/client';

import type { PaginationProps } from '../components/admin/Pagination';

interface TournamentsResponse<D> {
  data?: D;
  isOk: boolean;
  errorMessage?: string;
}

type IGetTournamentsResponse = TournamentsResponse<TournamentT[]>;
type ICreateTournamentResponse = TournamentsResponse<TournamentT>;
type IDeleteTournamentResponse = TournamentsResponse<Prisma.BatchPayload>;
type IUpdateTournamentResponse = TournamentsResponse<TournamentT>;

export async function getTournaments(
  pagination: PaginationProps
): Promise<IGetTournamentsResponse> {
  const url = `/api/tournaments?take=${pagination.pageSize}&skip=${
    pagination.pageIndex * pagination.pageSize
  }`;
  const response = await axios.get<TournamentT[]>(url);

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}

export async function createTournament(
  tournament: TournamentT
): Promise<ICreateTournamentResponse> {
  const response = await axios.post<TournamentT>('/api/tournaments', {
    data: tournament,
  });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}

export async function updateTournament(
  tournament: TournamentT
): Promise<IUpdateTournamentResponse> {
  const response = await axios.put<TournamentT>('/api/tournaments', {
    data: tournament,
  });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}

export async function deleteSelectedTournament(
  ids: number[]
): Promise<IDeleteTournamentResponse> {
  // todo: match { data } with beckend
  const response = await axios.delete('/api/tournaments', { data: ids });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}
