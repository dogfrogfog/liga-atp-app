import type { NextPage } from 'next';
import { PrismaClient, tournament as TournamentT } from '@prisma/client';


interface IAdminSingleTournamentPapeProps {
  tournament: TournamentT;
}

const AdminSingleTournamentPape: NextPage<IAdminSingleTournamentPapeProps> = ({ tournament }) =>  {

  console.log(tournament);

  // const strConsole = JSON.stringify(tournament);

  return (
    <div>
      {/* {strConsole} */}
      <h1>HIHIHI</h1>
    </div>
  );
}

export default AdminSingleTournamentPape;

export const getServerSideProps = async (ctx: any) => {
  const prisma = new PrismaClient()

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: parseInt(ctx.query.pid),
    },
  });

  return {
    props: {
      tournament: {
        ...tournament,
        start_date: JSON.parse(tournament?.start_date),
      },
    },
  };
}