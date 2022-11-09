import axios from 'axios';
import type { player as PlayerT, Prisma } from '@prisma/client';

import type { PaginationProps } from '../components/admin/Pagination';

interface PlayersResponse<D> {
  data?: D;
  isOk: boolean;
  errorMessage?: string;
}

type IGetPlayersResponse = PlayersResponse<PlayerT[]>;
type ICreatePlayerResponse = PlayersResponse<PlayerT>;
type IDeletePlayerResponse = PlayersResponse<Prisma.BatchPayload>;
type IUpdatePlayerResponse = PlayersResponse<PlayerT>;

export async function getPlayers(pagination: PaginationProps, ): Promise<IGetPlayersResponse> {
  const url = `/api/players?take=${pagination.pageSize}&skip=${pagination.pageIndex * pagination.pageSize}`;
  const response = await axios.get<PlayerT[]>(url);

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}

export async function createPlayer(player: PlayerT): Promise<ICreatePlayerResponse> {
  const response = await axios.post<PlayerT>('/api/players', { data: player });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}

export async function updatePlayer (player: PlayerT): Promise<IUpdatePlayerResponse> {
  const response = await axios.put<PlayerT>('/api/players', { data: player });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}

export async function deleteSelectedPlayer (ids: number[]): Promise<IDeletePlayerResponse> {
  // todo: match { data } with beckend
  const response = await axios.delete('/api/players', { data: ids });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}
