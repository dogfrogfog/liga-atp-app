import type { NextPage } from 'next'

interface ITournamentsListProps {
  level: 'string'
}

const TournamentsList: NextPage<ITournamentsListProps> = ({ level }) => {
  console.log(level);

  return (
    <div>
      wefwefwef
    </div>
  )
}

export default TournamentsList