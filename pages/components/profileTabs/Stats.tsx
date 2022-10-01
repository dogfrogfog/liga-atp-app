import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import styles from './Stats.module.scss'

// todo: make global lvl values
const LEVELS = ['Челленджер', 'Леджер', 'Фьючерс', 'Мастерс', 'Сеттелит']

const StatsTab = () => {
  const [selectedLvl, setSelectedLvl] = useState(LEVELS[0])

  const handleChange = (e: SelectChangeEvent) => {
    setSelectedLvl(e.target.value);
  }

  return (
    <>
      <div className={styles.eloContainer}>
        график рейтинга ЭЛО
      </div>
      <div className={styles.lvlSelectContainer}>
        <Select
          value={selectedLvl}
          onChange={handleChange}
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
          <span className={styles.valueName}>Сыгранных матчей</span>
          <span className={styles.value}>45%</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>W/L в своем уровне</span>
          <span className={styles.value}>45%</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Взятия титула</span>
          <span className={styles.value}>3</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Выход в финал</span>
          <span className={styles.value}>00</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Выйгрыш в тай-брейке до 7</span>
          <span className={styles.value}>3</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Победы после поражения в первом сете</span>
          <span className={styles.value}>3</span>
        </div>
      </div>
    </>
  )
}

export default StatsTab