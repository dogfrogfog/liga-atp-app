import type {
  tournament as TournamentT,
  player as PlayerT,
  match as MatchT,
} from '@prisma/client';

const getTournamentWinners = (
  t: TournamentT & { match: MatchT[] },
  playersMap: Map<number, PlayerT>
) => {
  const brackets = t?.draw ? JSON.parse(t.draw)?.brackets : null;

  let lastMatch: undefined | MatchT;
  let isOldFormat = false;

  // new brackets format
  if (brackets && Array.isArray(brackets[0])) {
    const lastMatchId = brackets[brackets.length - 1][0]?.matchId;
    lastMatch = lastMatchId
      ? t.match.find((v) => v.id === lastMatchId)
      : undefined;
  }
  // old brackets format
  // matches in this format sorted my stage, so the last match match is final
  else {
    isOldFormat = true;
    lastMatch = t.match[t.match.length - 1];
  }

  let winners = [] as PlayerT[];
  if (lastMatch) {
    if (isOldFormat) {
      const winnersIds = lastMatch.winner_id?.split('012340') as string[];

      winnersIds.forEach((pId) => {
        winners.push(playersMap.get(parseInt(pId, 10)) as PlayerT);
      });
    } else {
      const team1 = [lastMatch.player1_id, lastMatch.player3_id].filter(
        (v) => v
      );
      const team2 = [lastMatch.player2_id, lastMatch.player4_id].filter(
        (v) => v
      );

      if (lastMatch.winner_id === lastMatch.player1_id + '') {
        team1.forEach((pId) => {
          winners.push(playersMap.get(pId as number) as PlayerT);
        });
      }

      if (lastMatch.winner_id === lastMatch.player2_id + '') {
        team2.forEach((pId) => {
          winners.push(playersMap.get(pId as number) as PlayerT);
        });
      }
    }
  }

  if (winners.length > 0) {
    return winners.reduce(
      (acc, w, i) =>
        (acc += i === 1 ? ' / ' : '') +
        `${(w.first_name as string)[0]}. ${w.last_name}`,
      ''
    );
  } else {
    return 'победитель не определен';
  }
};

export default getTournamentWinners;
