import { useState } from 'react';
import type { NextPage } from 'next';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import cl from 'classnames';
import { useRouter } from 'next/router';
import { AiOutlineArrowDown } from 'react-icons/ai';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import styles from '../../styles/Tournament.module.scss';

const PROFILE_TABS = ['Участники', 'Сетка турнира', 'Игровой день'];

const TournamentPage: NextPage = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(PROFILE_TABS[0]);
  const [stage, setStage] = useState('1/8');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const activeTabContent = (() => {
    switch (activeTabIndex) {
      case PROFILE_TABS[0]:
        return (
          <div>
            <ul className={styles.playersList}>
              <li>
                <span>Кравченко С</span>
                <div>
                  <span>Супермастерс</span>
                  <span>1444</span>
                </div>
              </li>
              <li>
                <span>Кравченко С</span>
                <div>
                  <span>Супермастерс</span>
                  <span>1444</span>
                </div>
              </li>
              <li>
                <span>Кравченко С</span>
                <div>
                  <span>Супермастерс</span>
                  <span>1444</span>
                </div>
              </li>
              <li>
                <span>Кравченко С</span>
                <div>
                  <span>Супермастерс</span>
                  <span>1444</span>
                </div>
              </li>
              <li>
                <span>Кравченко С</span>
                <div>
                  <span>Супермастерс</span>
                  <span>1444</span>
                </div>
              </li>
            </ul>
          </div>
        );
      case PROFILE_TABS[1]:
        return (
          <div className={styles.net}>
            <FormControl>
              <InputLabel style={{ color: 'white', top: '-10px' }} id="stage">
                Стадия
              </InputLabel>
              <Select
                style={{ color: 'white', border: '2px solid white' }}
                labelId="stage"
                value={stage}
                label="Стадия"
                onChange={(e) => setStage(e.target.value)}
              >
                <MenuItem value="1/8">1/8</MenuItem>
                <MenuItem value="1/4">1/4</MenuItem>
                <MenuItem value="1/2">1/2</MenuItem>
                <MenuItem value="1/1">финал</MenuItem>
              </Select>
            </FormControl>
            <ul className={styles.playersList}>
              {Array(parseInt(stage.split('/')[1]))
                .fill(1)
                .map((_, index) => (
                  <li key={index}>
                    <span>Кравченко С/Веремей Д</span>
                    <div>
                      <span>6-3</span>
                      <span>6-7</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        );
      case PROFILE_TABS[2]:
        return (
          <div>
            <div>Октябрь / Ноябрь</div>
            <br />
            <div>
              <span>пн | 26</span>
              <span>вт | 27</span>
              <span>пн | 28</span>
              <span>пн | 29</span>
              <span>пн | 30</span>
              <span>пн | 1</span>
              <span>пн | 2</span>
            </div>
            <br />
            <ul className={styles.playersList}>
              <li>
                <span>Кравченко</span>
                <span>6 6 6 6 6</span>
              </li>
              <li>
                <span>Кравченко</span>
                <span>6 6 6 6 6</span>
              </li>
              <li>
                <span>Кравченко</span>
                <span>6 6 6 6 6</span>
              </li>
              <li>
                <span>Кравченко</span>
                <span>6 6 6 6 6</span>
              </li>
              <li>
                <span>Кравченко</span>
                <span>6 6 6 6 6</span>
              </li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTabIndex(PROFILE_TABS[value]);
  };

  return (
    <div className={styles.tournamentContainer}>
      {/* <span onClick={handleOpen} className={styles.registration}>Записаться</span> */}
      <br />
      <br />
      <br />
      <br />
      <Accordion>
        <AccordionSummary expandIcon={<AiOutlineArrowDown />}>
          <Typography>Записаться</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <input type="text" placeholder="Введите имя" />
            <input type="tel" placeholder="Введите номер телефона" />
            <input type="submit" placeholder="Зарегистрироваться" />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <br />
      <br />
      <div className={styles.tournamentListItem}>
        <div>
          <span>SUPER MASTERS ROLAND GARROS | 2022</span>
          <span className={styles.status}>Идет</span>
        </div>
        <div>
          <span>11.10.2022</span>
        </div>
      </div>
      <section>
        <Tabs
          value={PROFILE_TABS.indexOf(activeTabIndex)}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          className={styles.tabsContainer}
          TabIndicatorProps={{ children: null }}
        >
          {PROFILE_TABS.map((tab) => (
            <Tab
              key={tab}
              className={cl(
                styles.tab,
                tab === activeTabIndex ? styles.activeTab : ''
              )}
              label={tab}
            />
          ))}
        </Tabs>
        {activeTabContent}
      </section>
    </div>
  );
};

export default TournamentPage;
