import type { player as PlayerT } from '@prisma/client';
import type { Option } from 'react-multi-select-component';

export const playersToMultiSelect = (players: PlayerT[]) =>
  players.reduce((acc, { id, first_name, last_name }) => {
    acc.push({
      value: id,
      label: `${first_name} ${last_name}`,
    });
    return acc;
  }, [] as Option[]);

export const multiSelectToIds = (options: Option[]) =>
  options.reduce((acc, { value }) => {
    acc.push(value);
    return acc;
  }, [] as number[]);
