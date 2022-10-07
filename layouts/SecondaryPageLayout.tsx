import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { BiArrowBack } from 'react-icons/bi'

import styles from './SecondaryPageLayout.module.scss'

function SecondaryLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <div className={styles.secondaryLayoutContainer}>
      <a className={styles.back} onClick={() => router.back()}>
        <BiArrowBack size='xl' />
      </a>
      {children}
    </div>
  )
}

export default SecondaryLayout