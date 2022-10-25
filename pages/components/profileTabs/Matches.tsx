import { useState, useEffect } from 'react'
import axios from 'axios'
import { core_match } from '@prisma/client'

import styles from './Matches.module.scss'
import matches from '../../api/matches'

// comment: ""
// id: 10641
// is_completed: 1
// player1_id: 1220
// player2_id: 338
// player3_id: null
// player4_id: null
// score: "6-1 6-3"
// stage: 7
// start_date: "2020-11-01"
// tournament_id: 478
// winner_id: 1220

const Match = ({ tournamentName, startDate, playersStr, score }: any) => (
  <div className={styles.match}>
    {/* <span className={styles.title}>{tournamentName} | {startDate}</span> */}
    <div className={styles.row}>
      <span className={styles.time}>
        {tournamentName} | {startDate}
      </span>
      <span className={styles.pair}>
        {score}  
      </span>
    </div>
    <div className={styles.row}>
      <span className={styles.court}>{playersStr}</span>
      <span className={styles.pair}></span>
    </div>
  </div>
)

interface IMatchesTabProps {
  playerId: number
}

const MatchesTab = ({ playerId }: IMatchesTabProps) => {
  const [data, setData] = useState<core_match[]>([])
  const [pagination, setPagination] = useState({ take: 10, skip: 0 })

  console.log(data)

  // const name1 = data[0]?.core_player_core_match_player1_idTocore_player?.first_name + ' ' + data[0]?.core_player_core_match_player1_idTocore_player?.last_name
  // const name1 = data[0]?.core_player_core_match_player2_idTocore_player?.first_name + ' ' + data[0]?.core_player_core_match_player2_idTocore_player?.last_name
  
  // console.log(name1)


  useEffect(() => {
    const fetchWrapper = async () => {
      // todo: refactor
      // should be real pages
      const response = await axios.get(`/api/matches?take=${pagination.take}&skip=${pagination.skip}&id=${playerId}`)

      if (response.status === 200) {
        setData(response.data)
      }
    }

    fetchWrapper()
  }, [playerId])

  return (
    <>
      {data.map((match) => (
        <Match
          tournamentName={match.core_tournament.name}
          startDate={match.start_date}
          score={match.score}
          playersStr={
            match.core_player_core_match_player1_idTocore_player.first_name +  ' ' + match.core_player_core_match_player1_idTocore_player.last_name + ' / ' +
            match.core_player_core_match_player2_idTocore_player.first_name + ' ' + match.core_player_core_match_player2_idTocore_player.last_name
          }
        />
      ))}
  </>
  )
}

export const getServerSideProps = async () => {
  // todo: add pagination
  // todo: add pagination ui element


  // return {
  //   props: {
  //     matches
  //   }
  // }
}

export default MatchesTab