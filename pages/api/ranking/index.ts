import type { NextApiRequest, NextApiResponse } from 'next';

import {
  prisma,
  match as MatchT,
  tournament as TournamentT,
} from 'services/db';
import { isMatchPlayed } from 'utils/isMatchPlayed';
import getNewEloAfterMatch from 'utils/elo/getNewEloAfterMatch';

const YEAR_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 30 * 6 * 2;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const now = new Date();
    const { id: matchId, ...matchData } = req.body.data;

    const isDoubles = matchData.player3_id && matchData.player4_id;

    // rankings for every player in match
    const playerEloRankings = await prisma.$transaction([
      prisma.player_elo_ranking.findUnique({
        where: {
          player_id: matchData.player1_id,
        },
      }),
      prisma.player_elo_ranking.findUnique({
        where: {
          player_id: matchData.player2_id,
        },
      }),
      ...(isDoubles
        ? [
            prisma.player_elo_ranking.findUnique({
              where: {
                player_id: matchData.player3_id,
              },
            }),
            prisma.player_elo_ranking.findUnique({
              where: {
                player_id: matchData.player4_id,
              },
            }),
          ]
        : []),
    ]);

    // number of matches played by every player in match
    const { matchesPlayed, expireDates } = await parsePlayedMatches(
      matchData,
      isDoubles,
      now
    );

    const { p1NewElo, p2NewElo, ...doublesPNewEloPoints } = getNewEloAfterMatch(
      matchData,
      matchesPlayed,
      {
        eloPoints: playerEloRankings[0]?.elo_points as number,
        id: playerEloRankings[0]?.player_id as number,
      },
      {
        eloPoints: playerEloRankings[1]?.elo_points as number,
        id: playerEloRankings[1]?.player_id as number,
      },
      {
        eloPoints: playerEloRankings[2]?.elo_points as number,
        id: playerEloRankings[2]?.player_id as number,
      },
      {
        eloPoints: playerEloRankings[3]?.elo_points as number,
        id: playerEloRankings[3]?.player_id as number,
      }
    );

    // NEW ELO IS READY
    // UPDATE ELO RANKING AND CREATE ELO RANKING CHANGE RECORDS for all 2/4 players in match

    const commonData = {
      change_date: now,
      match_id: matchId,
    };

    // [0, 1, 2, 3] = [p1, p2, p3, p4]
    const [p1EloRankings, p2EloRankings, ...doublesEloRankings] =
      playerEloRankings;

    // console.log('old elo: p1, p2');
    // console.log(p1EloRankings?.elo_points, p2EloRankings?.elo_points);
    // console.log('new elo: p1, p2');
    // console.log(p1NewElo, p2NewElo);

    let playerUpdates = [];

    if(!isDoubles) {
      playerUpdates = [
        prisma.player_elo_ranking.update({
          where: {
            player_id: matchData.player1_id,
          },
          data: {
            elo_points: p1NewElo,
            expire_date: now
          },
        }),
        prisma.player_elo_ranking.update({
          where: {
            player_id: matchData.player2_id,
          },
          data: {
            elo_points: p2NewElo,
            expire_date: now
          },
        }),
      ];
    } else {
      playerUpdates = [
        prisma.player_elo_ranking.update({
          where: {
            player_id: matchData.player1_id,
          },
          data: {
            elo_points: p1NewElo
          },
        }),
        prisma.player_elo_ranking.update({
          where: {
            player_id: matchData.player2_id,
          },
          data: {
            elo_points: p2NewElo
          },
        }),
        prisma.player_elo_ranking.update({
          where: {
            player_id: matchData.player3_id,
          },
          data: {
            elo_points: doublesPNewEloPoints.p3NewElo
          },
        }),
        prisma.player_elo_ranking.update({
          where: {
            player_id: matchData.player4_id,
          },
          data: {
            elo_points: doublesPNewEloPoints.p4NewElo
          },
        }),
      ];
    }

    // we update expireDates if needed
    await prisma.$transaction([
      ...playerUpdates,
      prisma.elo_ranking_change.createMany({
        data: [
          {
            player_id: matchData.player1_id,
            current_elo_points: p1EloRankings?.elo_points,
            new_elo_points: p1NewElo,
            ...commonData,
          },
          {
            player_id: matchData.player2_id,
            current_elo_points: p2EloRankings?.elo_points,
            new_elo_points: p2NewElo,
            ...commonData,
          },
          ...(isDoubles
            ? [
                {
                  player_id: matchData.player3_id,
                  current_elo_points: doublesEloRankings[0]?.elo_points,
                  new_elo_points: doublesPNewEloPoints.p3NewElo,
                  ...commonData,
                },
                {
                  player_id: matchData.player4_id,
                  current_elo_points: doublesEloRankings[1]?.elo_points,
                  new_elo_points: doublesPNewEloPoints.p4NewElo,
                  ...commonData,
                },
              ]
            : []),
        ],
      }),
    ]);

    res.status(200).json({});
  }
};

const parsePlayedMatches = async (
  matchData: MatchT,
  isDoubles: boolean,
  now: Date
) => {
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { player1_id: matchData.player1_id },
        { player1_id: matchData.player2_id },

        { player2_id: matchData.player1_id },
        { player2_id: matchData.player2_id },

        { player3_id: matchData.player1_id },
        { player3_id: matchData.player2_id },

        { player4_id: matchData.player1_id },
        { player4_id: matchData.player2_id },

        // for doubles we need more data
        ...(isDoubles
          ? [
              { player1_id: matchData.player3_id },
              { player1_id: matchData.player4_id },
              { player2_id: matchData.player3_id },
              { player2_id: matchData.player4_id },

              { player3_id: matchData.player3_id },
              { player3_id: matchData.player4_id },

              { player4_id: matchData.player3_id },
              { player4_id: matchData.player4_id },
            ]
          : []),
      ],
    },
    include: {
      tournament: true,
    },
    // last matches are the first ones
    orderBy: {
      id: 'desc',
    },
  });

  const matchesPlayedP1 = [] as MatchT[];
  const matchesPlayedP2 = [] as MatchT[];
  const matchesPlayedP3 = [] as MatchT[];
  const matchesPlayedP4 = [] as MatchT[];
  let p1ExpireDate;
  let p2ExpireDate;
  let p3ExpireDate;
  let p4ExpireDate;

  // we go thro matches array and check if player played in match and
  // generates data for expire date (more then 5 matches in last 6 months!!! requirement)
  for (const m of matches) {
    if (!isMatchPlayed(m as MatchT & { tournament: TournamentT })) {
      continue;
    }

    const playersIds = [
      m.player1_id,
      m.player2_id,
      m.player3_id,
      m.player4_id,
    ].filter((v) => v);

    // if player played more then 5 matches in last 6 months and the date of the last 5th match is no more than 6 months ago
    // then we need to update expire date for players

    // is match played in last 6 months
    const isMatchWithinYearFromNow =
      m.start_date &&
      m.start_date.getTime() + YEAR_IN_MILLISECONDS >= now.getTime();

    if (isMatchWithinYearFromNow) {
      if (playersIds.includes(matchData.player1_id)) {
        matchesPlayedP1.push(m);

        if (matchesPlayedP1.length === 1) {
          p1ExpireDate = m.start_date;
        }
      }
      if (playersIds.includes(matchData.player2_id)) {
        matchesPlayedP2.push(m);

        if (matchesPlayedP2.length === 1) {
          p2ExpireDate = m.start_date;
        }
      }
      if (playersIds.includes(matchData.player3_id)) {
        matchesPlayedP3.push(m);

        if (matchesPlayedP3.length === 1) {
          p3ExpireDate = m.start_date;
        }
      }
      if (playersIds.includes(matchData.player4_id)) {
        matchesPlayedP4.push(m);

        if (matchesPlayedP4.length === 1) {
          p4ExpireDate = m.start_date;
        }
      }
    }
  }

  return {
    expireDates: {
      p1: p1ExpireDate,
      p2: p2ExpireDate,
      p3: p3ExpireDate,
      p4: p4ExpireDate,
    },
    matchesPlayed: {
      p1: matchesPlayedP1,
      p2: matchesPlayedP2,
      p3: matchesPlayedP3 || undefined,
      p4: matchesPlayedP4 || undefined,
    },
  };
};
