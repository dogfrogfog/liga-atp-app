import useSWR from 'swr';
import type { player as PlayerT, digest as DigestT } from '@prisma/client';

const useSinglePlayer = (playerId: number) => {
  const { data, isLoading, error, mutate } = useSWR<{
    player: PlayerT;
    digests: DigestT[];
  }>(`/api/players/single?id=${playerId}`);

  return {
    player: data?.player,
    digests: data?.digests || [],
    isLoading,
    error,
    mutate,
  };
};

export default useSinglePlayer;
