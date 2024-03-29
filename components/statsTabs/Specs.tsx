import { Fragment } from 'react';

import styles from './Specs.module.scss';

type SpecsProps = {
  power: [number, number];
  technique: [number, number];
  net_game: [number, number];
  serve: [number, number];
  psychology: [number, number];
  behavior: [number, number];
};

const trans: { [k: string]: string } = {
  power: 'Мощь',
  technique: 'Техника',
  net_game: 'Игра на сетке',
  serve: 'Подача',
  psychology: 'Психология',
  behavior: 'Поведение',
};

const Specs = (props: SpecsProps) => {
  const [p1Specs, p2Specs] = Object.entries(props).reduce(
    (acc, [k, v]) => {
      acc[0].push([k, v[0]]);
      acc[1].push([k, v[1]]);

      return acc;
    },
    [[] as [string, number][], [] as [string, number][]]
  );

  return (
    <div className={styles.container}>
      <div className={styles.side}>
        {p1Specs.map(([k, v], i) => (
          <Fragment key={k + v + i}>
            <p className={styles.inputValue}>
              {trans[k]} <span className={styles.percent}>{v}%</span>
            </p>
            <input
              disabled
              className={styles.percentInput}
              type="range"
              max={100}
              min={0}
              defaultValue={v}
            />
          </Fragment>
        ))}
      </div>
      <div className={styles.side}>
        {p2Specs.map(([k, v], i) => (
          <Fragment key={k + v + i}>
            <p className={styles.inputValue}>
              {trans[k]} <span className={styles.percent}>{v}%</span>
            </p>
            <input
              disabled
              className={styles.percentInput}
              type="range"
              max={100}
              min={0}
              defaultValue={v}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Specs;
