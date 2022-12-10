import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Form from '../components/Form.js'
export default function Home() {
  return (
    <div>
          <Head>
            <title>Person Tracking</title>
          </Head>
        <Form/>
    </div>
    
  )
}
