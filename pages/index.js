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
    // window.localStorage.setItem("__theme__", theme)
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
        <link rel="preload" href="/pop-sound-effect.mp3" as="audio" />
        <link rel="preload" href="/lost-2.mp3" as="audio" />
        <link rel="preload" href="/won.mp3" as="audio" />
        <link
          rel="preload"
          href="/minesweeper-icons/slightly-smiling-face.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/rolling-on-the-floor-laughing.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/face-savoring-food.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/grinning-face.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/zany-face.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/sign-of-the-horns_medium-skin-tone.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/see-no-evil-monkey.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/flexed-biceps_medium-skin-tone.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/face-with-head-bandage.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/dizzy-face.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/pile-of-poo.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/loudly-crying-face.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/tired-face.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/face-vomiting.png"
          as="image"
        />
        <link
          rel="preload"
          href="/minesweeper-icons/flushed-face.png"
          as="image"
        />
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
