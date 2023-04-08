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

    const tournamentsPlayed = await prisma.tournament.findMany({
      where: {
        ...(tournament_type && {
          tournament_type: parseInt(tournament_type as string, 10),
        }),
        match: {
          some: {
            OR: [
              { player1_id: playerIdInt },
              { player2_id: playerIdInt },
              { player3_id: playerIdInt },
              { player4_id: playerIdInt },
            ],
          },
        },
      },
      select: {
        draw: true,
        match: true,
      },
    });

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

    const filteredPlayedMatches =
      tournament_type !== undefined
        ? playedMatches.filter(
            (m) =>
              m.tournament.tournament_type ===
              parseInt(tournament_type as string, 10)
          )
        : playedMatches;

    const { wins, losses } = filteredPlayedMatches.reduce(
      (acc, m) => {
        const isPlayerWonTheMatch = isPlayerWon(playerIdInt, m);

        if (isPlayerWonTheMatch) {
          acc.wins += 1;
        } else {
          acc.losses += 1;
        }

        return acc;
      },
      {
        wins: 0,
        losses: 0,
      }
    );

    let tWins = 0;
    let tFinals = 0;
    for (const t of tournamentsPlayed) {
      const brackets = t.draw && JSON.parse(t.draw)?.brackets;
      let lastMatch;
      // COPY PASTE FROM STATS getTournamentWinners
      // new brackets format
      if (brackets && Array.isArray(brackets[0])) {
        const lastMatchId = brackets[brackets.length - 1][0].matchId;
        lastMatch = t.match.find((v) => v.id === lastMatchId);
      } else {
        // final in old match format is stage 10 foir every tournament
        lastMatch = t.match.find((v) => v.stage === 10);
        // find match with biggest stage
      }

      if (
        lastMatch?.player1_id === playerIdInt ||
        lastMatch?.player2_id === playerIdInt ||
        lastMatch?.player3_id === playerIdInt ||
        lastMatch?.player4_id === playerIdInt
      ) {
        if (lastMatch.winner_id?.includes(id as string)) {
          tWins++;
        } else {
          tFinals++;
        }
      }
    }

    // console.log(`tournamentWins/finals, ${tWins}/${tFinals}`);
    // console.log(`${lastMatchNumer} number last matches for tournament played by player`, 'number of tournaments: ', tournamentsPlayed.length)

    const statsData = {
      tournaments_played: tournamentsPlayed.length,
      matches_played: filteredPlayedMatches.length,
      tournaments_wins: tWins,
      tournaments_finals: tFinals,
      win_lose_in_level_proportion: `${wins}/${losses}`,
    };

    res.json(statsData);
  }
};
