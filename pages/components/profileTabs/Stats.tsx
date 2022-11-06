import { useState, useEffect } from 'react'
import axios from 'axios'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import styles from './Stats.module.scss'

// todo: make global lvl values
const LEVELS = ['Челленджер', 'Леджер', 'Фьючерс', 'Мастерс', 'Сеттелит']

const StatsTab = ({ playerId }: { playerId: number }) => {
  const [selectedLvl, setSelectedLvl] = useState(LEVELS[0])
  const [statsData, setStatsData] = useState()

  const handleLevelChange = (e: SelectChangeEvent) => {
    setSelectedLvl(e.target.value);
  }
  console.log(statsData)

  useEffect(() => {
    const fetchWrapper = async () => {
      const response = await axios.get(`/api/stats?playerId=${playerId}&level=${selectedLvl}`)

      if (response.status === 200) {
        setStatsData(response.data)
      }
    }

    // fetchWrapper()
  }, [selectedLvl, playerId])

  return (
    <>
      <div className={styles.eloContainer}>
        график рейтинга ЭЛО
      </div>
      <div className={styles.lvlSelectContainer}>
        <Select
          value={selectedLvl}
          onChange={handleLevelChange}
          displayEmpty
        >
          <MenuItem value={LEVELS[0]}>{LEVELS[0]}</MenuItem>
          <MenuItem value={LEVELS[1]}>{LEVELS[1]}</MenuItem>
          <MenuItem value={LEVELS[2]}>{LEVELS[2]}</MenuItem>
          <MenuItem value={LEVELS[3]}>{LEVELS[3]}</MenuItem>
          <MenuItem value={LEVELS[4]}>{LEVELS[4]}</MenuItem>
        </Select>
      </div>
      <div className={styles.statsRowsContainer}>
        <div className={styles.row}>
          <span className={styles.valueName}>Сыгранных турниров</span>
          <span className={styles.value}>--</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество титулов</span>
          <span className={styles.value}>--</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество финалов</span>
          <span className={styles.value}>--</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество сыгранных матчей в уровне</span>
          <span className={styles.value}>45%</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>W/L в своем уровне</span>
          <span className={styles.value}>3</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Процент выигрыша в тай-брейков до 7</span>
          <span className={styles.value}>3</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Процент выигрыша решающих тай-брейков</span>
          <span className={styles.value}>3</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Процент побед после поражения в первом сете</span>
          <span className={styles.value}>3</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Процент выигрыша 1 и 2 сетов в трехсетовике</span>
          <span className={styles.value}>3</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество матчей 0 - 6 0 - 6</span>
          <span className={styles.value}>1</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество матчей 6 - 0 6 - 0</span>
          <span className={styles.value}>1</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Процент Двухсетовиков vs Трехсетовиков</span>
          <span className={styles.value}>3</span>
        </div>
        {/* // todo: add ability to add stat fields from db */}
      </div>
    </>
  )
}

export default StatsTab