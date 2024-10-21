import type { NextPage } from 'next'
import Head from 'next/head'
import Gallery from '../components/Gallery'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Zamint Story</title>
        <meta name="description" content="Infinite scrolling gallery with aesthetic images and text" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-100">
        <Gallery />
      </main>
    </div>
  )
}

export default Home
