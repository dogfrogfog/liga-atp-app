import type { match as MatchT } from '@prisma/client';

import {
  getPlayersKFactor,
  getWinProbability,
  getMatchResultCoef,
} from './utils';

const POINTS_FOR_PLAYED_MATCH = 1;

// but we assume that when new player created -> we create elo points record with id
// need to make sure table in db is matching this
const getNewEloAfterMatch = (
  matchRecord: MatchT,
  matchesPlayed: {
    p1: MatchT[];
    p2: MatchT[];
    p3?: MatchT[];
    p4?: MatchT[];
  },
  p1: { id: number; eloPoints: number },
  p2: { id: number; eloPoints: number },
  p3: { id: number; eloPoints: number },
  p4: { id: number; eloPoints: number }
) => {
  const isDoubles = matchRecord.player3_id && matchRecord.player4_id;

  const team1IsWinner = matchRecord.winner_id === p1.id + '';
  let team1Points = 0;
  let team2Points = 0;
  if (isDoubles) {
    team1Points = p1.eloPoints + p3.eloPoints;
    team2Points = p2.eloPoints + p2.eloPoints;
  } else {
    team1Points = p1.eloPoints;
    team2Points = p2.eloPoints;
  }

  const coefMatchResult = getMatchResultCoef(matchRecord.score || '');
  // matches includes doubles
  const { kFactorP1, kFactorP2 } = getPlayersKFactor(
    matchesPlayed.p1.length,
    matchesPlayed.p2.length
  );

  const team1WinProbavility = getWinProbability(team1Points, team2Points);

  const deltaTeam1Wins = coefMatchResult * kFactorP1 * (1 - team1WinProbavility);
  const deltaTeam1Loses = coefMatchResult * kFactorP1 * team1WinProbavility;

  const deltaTeam2Wins = coefMatchResult * kFactorP2 * team1WinProbavility;
  const deltaTeam2Loses = coefMatchResult * kFactorP2 * (1 - team1WinProbavility);

  let p1Delta = 0;
  let p2Delta = 0;
  let p3Delta = 0;
  let p4Delta = 0;

  if (team1IsWinner) {
    if (isDoubles) {
      p1Delta = deltaTeam1Wins / 2;
      p3Delta = deltaTeam1Wins / 2;
      p2Delta = -deltaTeam2Loses / 2;
      p4Delta = -deltaTeam2Loses / 2;
    } else {
      p1Delta = deltaTeam1Wins;
      p2Delta = -deltaTeam2Loses;
    }
  } else {
    if (isDoubles) {
      p1Delta = -deltaTeam1Wins / 2;
      p3Delta = -deltaTeam1Wins / 2;
      p2Delta = deltaTeam2Loses / 2;
      p4Delta = deltaTeam2Loses / 2;
    } else {
      p1Delta = -deltaTeam1Loses;
      p2Delta = deltaTeam2Wins;
    }
  }

  // console.log('team1WinProbavility: ', team1WinProbavility)
  // console.log(matchesPlayed.p1.length, matchesPlayed.p2.length)
  // console.log('coefMatchResult: ', coefMatchResult)
  // console.log('kFactorP1, kFactorP2: ', kFactorP1, kFactorP2)
  // console.log('deltaTeam1Wins', 'deltaTeam1Loses', deltaTeam1Wins, deltaTeam1Loses)
  // console.log('deltaTeam2Wins', 'deltaTeam2Loses', deltaTeam2Wins, deltaTeam2Loses)
  // console.log(p1Delta, p2Delta, p3Delta, p4Delta)

  const p1NewElo = p1.eloPoints + p1Delta + POINTS_FOR_PLAYED_MATCH;
  const p2NewElo = p2.eloPoints + p2Delta + POINTS_FOR_PLAYED_MATCH;

  let p3NewElo = 0;
  let p4NewElo = 0;
  if (isDoubles) {
    p3NewElo = p3.eloPoints + p3Delta + POINTS_FOR_PLAYED_MATCH;
    p4NewElo = p4.eloPoints + p4Delta + POINTS_FOR_PLAYED_MATCH;
  }

  return {
    p1NewElo: Math.round(p1NewElo),
    p2NewElo: Math.round(p2NewElo),
    ...(isDoubles
      ? { p3NewElo: Math.round(p3NewElo), p4NewElo: Math.round(p4NewElo) }
      : {}),
  };
};

export default getNewEloAfterMatch;
