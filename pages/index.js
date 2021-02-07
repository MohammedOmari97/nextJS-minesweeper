import Head from "next/head"
import styles from "../styles/home.module.scss"
import { useSelector } from "react-redux"
import Options from "../components/options"
import Game from "../components/game"
import Layout from "../components/layout"
import { useEffect } from "react"

export default function Home() {
  const { mode, theme } = useSelector((state) => state.cells)

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <Layout
        render={(setHorizontalScrollBarHeight, setVerticalScrollBarWidth) => {
          if (mode === "options") {
            return <Options />
          } else {
            return (
              <Game
                setHorizontalScrollBarHeight={setHorizontalScrollBarHeight}
                setVerticalScrollBarWidth={setVerticalScrollBarWidth}
              />
            )
          }
        }}
      />
      {/* }}>{mode === "options" ? <Options /> : <Game />}</Layout> */}
    </div>
  )
}
