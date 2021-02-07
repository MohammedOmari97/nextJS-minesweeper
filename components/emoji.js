import React, { useEffect, useMemo, useRef, useState } from "react"
import styles from "./styles/emoji.module.scss"
import { useSelector } from "react-redux"

const emojis = {
  idle: "/minesweeper-icons/slightly-smiling-face.png",
  happy: {
    0: "/minesweeper-icons/rolling-on-the-floor-laughing.png",
    1: "/minesweeper-icons/face-savoring-food.png",
    2: "/minesweeper-icons/grinning-face.png",
    3: "/minesweeper-icons/zany-face.png",
    4: "/minesweeper-icons/sign-of-the-horns_medium-skin-tone.png",
    5: "/minesweeper-icons/see-no-evil-monkey.png",
    6: "/minesweeper-icons/flexed-biceps_medium-skin-tone.png",
  },
  won: {
    0: "/minesweeper-icons/partying-face.png",
    1: "/minesweeper-icons/star-struck.png",
    2: "/minesweeper-icons/smiling-face-with-sunglasses.png",
    3: "/minesweeper-icons/smiling-face-with-heart-eyes.png",
    4: "/minesweeper-icons/victory-hand_medium-skin-tone.png",
    5: "/minesweeper-icons/smiling-face-with-hearts.png",
  },
  lost: {
    0: "/minesweeper-icons/face-with-head-bandage.png",
    1: "/minesweeper-icons/dizzy-face.png",
    2: "/minesweeper-icons/pile-of-poo.png",
    3: "/minesweeper-icons/loudly-crying-face.png",
    4: "/minesweeper-icons/tired-face.png",
    5: "/minesweeper-icons/face-vomiting.png",
    6: "/minesweeper-icons/flushed-face.png",
  },
}

function Emoji() {
  const {
    openedCells,
    gameOver,
    status,
    rows,
    columns,
    bombs,
    clickedCellsForEmojiAnimation,
  } = useSelector((state) => state.cells)
  const [imageURL, setImageURL] = useState(emojis.idle)

  const gameOverRef = useRef()
  gameOverRef.current = gameOver

  const changeKey = useRef(false)
  const keyRef = useRef(getRandomKey())
  const key = useMemo(() => {
    // ^^ this should be an effect
    if (changeKey.current) {
      keyRef.current = getRandomKey()
    }
  }, [changeKey.current])

  useEffect(() => {
    if (gameOver) {
      if (status === "won") {
        changeKey.current = true
        setImageURL(
          emojis.won[Math.floor(Math.random() * Object.keys(emojis.won).length)]
        )
      } else {
        changeKey.current = true
        setImageURL(
          emojis.lost[
            Math.floor(Math.random() * Object.keys(emojis.lost).length)
          ]
        )
      }
    } else {
      if (
        openedCells.length !== 0 &&
        openedCells.length !== rows * columns - bombs
      ) {
        changeKey.current = true
        setImageURL(
          emojis.happy[
            Math.floor(Math.random() * Object.keys(emojis.happy).length)
          ]
        )
        setTimeout(() => {
          // if (!gameOverRef.current) {
          // ^^ solves the case where the user wins from the first click and the idle emoji overrides the winning emoji
          changeKey.current = false
          setImageURL(emojis.idle)
          // }
        }, 550)
      } else {
        changeKey.current = false
        setImageURL(emojis.idle)
      }
    }
  }, [gameOver, clickedCellsForEmojiAnimation])

  function getRandomKey() {
    return Math.floor(Math.random() * 1000000)
  }

  return (
    <div className={styles.container}>
      <img key={keyRef.current} src={imageURL} alt="some emoji image" />
    </div>
  )
}

export default Emoji
