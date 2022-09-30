import type { NextPage } from 'next'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

const Digest: NextPage = () => {
  return (
    <div className={styles.container}>
      <Link href="/">home</Link>
      <br />
      <br />
      <div>
        <span style={{ padding: 10, backgroundColor: '#4CC4D1', marginRight: 10 }}>
          Masters
        </span>
        <span style={{ padding: 10, backgroundColor: '#4CC4D1', marginRight: 10 }}>
          Leger
        </span>
        <span style={{ padding: 10, backgroundColor: '#4CC4D1', marginRight: 10 }}>
          Challenger
        </span>
        <span style={{ padding: 10, backgroundColor: '#4CC4D1', marginRight: 10 }}>
          Futures
        </span>
      </div>
      <br />
      <br />
      <br />
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi consequuntur, in aperiam ad, nostrum dolore assumenda voluptatem fugiat tempore, nobis distinctio exercitationem autem accusamus consequatur optio odio dolorum excepturi non.
    </div>
  )
}

export default Digest
