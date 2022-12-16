import type { ReactNode } from 'react';

import styles from './PreviewLayout.module.scss';

function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layoutContainer}>
      <section className={styles.blurBlock}>
        {children}
      </section>
    </div>
  );
}

export default PreviewLayout;
