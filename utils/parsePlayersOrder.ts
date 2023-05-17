export const getRegPlayersIds = (
  { players }: { players?: number[] },
  isDoubles: boolean
) => {
  if (!players) {
    return [];
  }

  if (isDoubles) {
    return players.reduce((acc, v) => {
      // old doubles id separated with 012340
      const shouldSplitIds = (v + '').includes('012340');

      if (shouldSplitIds) {
        const [id1, id2] = (v + '').split('012340');
        acc.push(parseInt(id1, 10), parseInt(id2, 10));
      } else {
        acc.push(v);
      }
      return acc;
    }, [] as number[]);
  } else {
    return players;
  }
};
