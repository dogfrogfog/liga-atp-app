import { useState, Fragment } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import type { player as PlayerT } from '@prisma/client';
import cl from 'classnames';

import { prisma } from 'services/db';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import styles from 'styles/H2h.module.scss';

const CompareTwoPlayersPage: NextPage = () => {
  return null;
};

export const getServerSideProps = async () => {
  const players = await prisma.player.findMany();

  return {
    props: {
      allPlayers: players,
    },
  };
};

export default CompareTwoPlayersPage;
