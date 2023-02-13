import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  tournament as TournamentT,
  match as MatchT,
} from '@prisma/client';

import { prisma } from 'services/db';
import { isMatchPlayed } from 'utils/isMatchPlayed';
import { isPlayerWon } from 'utils/isPlayerWon';

export type StatsDataType = {
  tournaments_played: number;
  tournaments_wins: number;
  tournaments_finals: number;
  matches_played: number;
  win_lose_in_level_proportion: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<StatsDataType>
) => {
  if (req.method === 'GET') {
    const { id, tournament_type } = req.query;

    if (!id) {
      res.status(404);
    }

    const playerIdInt = parseInt(id as string, 10);

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { player1_id: playerIdInt },
          { player2_id: playerIdInt },
          { player3_id: playerIdInt },
          { player4_id: playerIdInt },
        ],
      },
      include: {
        tournament: true,
      },
    });

    const playedMatches = matches.filter((m) =>
      isMatchPlayed(m as any)
    ) as (MatchT & { tournament: TournamentT })[];

    const matchesMap = playedMatches.reduce(
      (acc, m) => acc.set(m.id, m),
      new Map<number, MatchT>()
    );
    const filteredPlayedMatches =
      tournament_type !== undefined
        ? playedMatches.filter(
            (m) =>
              m.tournament.tournament_type ===
              parseInt(tournament_type as string, 10)
          )
        : playedMatches;

    // just to remove same tournaments
    const uniqueTournamentsIds = [] as number[];
    const { tournamentsPlayed, wins, losses } = filteredPlayedMatches.reduce(
      (acc, m) => {
        if (!uniqueTournamentsIds.includes(m.tournament_id as number)) {
          uniqueTournamentsIds.push(m.tournament_id as number);
          acc.tournamentsPlayed.push(m.tournament as TournamentT);
        }

        const isPlayerWonTheMatch = isPlayerWon(playerIdInt, m);

        if (isPlayerWonTheMatch) {
          acc.wins += 1;
        } else {
          acc.losses += 1;
        }

        return acc;
      },
      {
        tournamentsPlayed: [] as TournamentT[],
        wins: 0,
        losses: 0,
      }
    );

    const { tournamentFinals, tournamentWins } = tournamentsPlayed.reduce(
      (acc, t) => {
        const brackets = t?.draw ? JSON.parse(t.draw).brackets : null;

        let lastMatch: undefined | MatchT;
        let isOldFormat = false;

        // new brackets format
        if (brackets && Array.isArray(brackets[0])) {
          const lastMatchId = brackets[brackets.length - 1][0]?.matchId;
          lastMatch = lastMatchId ? matchesMap.get(lastMatchId) : undefined;
        }

        // old brackets format
        // to support legacy data in db
        // we get matchId from brackets if exists
        // and increase counter if player was in finals/won the tournament
        // if no data in brackets field then we should skip tournament and not count
        if (brackets && brackets[0].id) {
          isOldFormat = true;
          const lastMatchId = brackets[brackets.length - 1]?.matchId;
          lastMatch = lastMatchId ? matchesMap.get(lastMatchId) : undefined;
        }

        if (lastMatch) {
          if (isOldFormat) {
            const team1 = [lastMatch.player1_id, lastMatch.player2_id];
            const team2 = [lastMatch.player3_id, lastMatch.player4_id];

            if ([...team1, ...team2].includes(playerIdInt)) {
              acc.tournamentFinals += 1;
            }

            if (
              team1.includes(playerIdInt) &&
              lastMatch.winner_id?.split('012340').includes(id as string)
            ) {
              acc.tournamentWins += 1;
            }

            if (
              team2.includes(playerIdInt) &&
              lastMatch.winner_id?.split('012340').includes(id as string)
            ) {
              acc.tournamentWins += 1;
            }
          } else {
            const team1 = [lastMatch.player1_id, lastMatch.player3_id];
            const team2 = [lastMatch.player2_id, lastMatch.player4_id];

            if ([...team1, ...team2].includes(playerIdInt)) {
              acc.tournamentFinals += 1;
            }

            if (
              team1.includes(playerIdInt) &&
              lastMatch.winner_id === team1[0] + ''
            ) {
              acc.tournamentWins += 1;
            }

            if (
              team2.includes(playerIdInt) &&
              lastMatch.winner_id === team2[0] + ''
            ) {
              acc.tournamentWins += 1;
            }
          }
        }

        return acc;
      },
      { tournamentFinals: 0, tournamentWins: 0 }
    );

    const statsData = {
      tournaments_played: tournamentsPlayed.length,
      matches_played: filteredPlayedMatches.length,
      tournaments_wins: tournamentWins,
      tournaments_finals: tournamentFinals,
      win_lose_in_level_proportion: `${wins}/${losses}`,
    };

    res.json(statsData);
  }
};
