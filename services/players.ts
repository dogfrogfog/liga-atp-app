import axios from 'axios';
import type { player as PlayerT, Prisma } from '@prisma/client';

interface PlayersResponse<D> {
  data?: D;
  isOk: boolean;
  errorMessage?: string;
}

type ICreatePlayerResponse = PlayersResponse<PlayerT>;
type IDeletePlayerResponse = PlayersResponse<Prisma.BatchPayload>;
type IUpdatePlayerResponse = PlayersResponse<PlayerT>;
// type IH2hPlayersResponse = PlayersResponse<PlayerT[]>;

export async function createPlayer(
  player: PlayerT
): Promise<ICreatePlayerResponse> {
  const response = await axios.post<PlayerT>('/api/players', { data: player });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}

export async function updatePlayer(
  player: PlayerT
): Promise<IUpdatePlayerResponse> {
  const response = await axios.put<PlayerT>('/api/players', { data: player });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}

export async function deleteSelectedPlayer(
  id: number
): Promise<IDeletePlayerResponse> {
  const response = await axios.delete('/api/players', { data: id });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
}

// TODO: fix
// export const getH2hPlayers = async (
//   player1Id: number,
//   player2Id: number
// ): Promise<IH2hPlayersResponse> => {
//   // const response = await axios.get(
//   //   // `/api/players/h2h?player1Id=${player1Id}&player2Id=${player2Id}`
//   // );

//   // if (response.status === 200) {
//   //   return { isOk: true };
//   // } else {
//   //   return { isOk: false, errorMessage: response.statusText };
//   // }
// };
