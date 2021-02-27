import React, { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import useSound from "use-sound"
import { toggleSound, increasePlaybackRate } from "./store"
import { Volume2, VolumeX } from "react-feather"

function Sound() {
  const dispatch = useDispatch()
  const {
    sound,
    openedCells,
    playbackRate,
    gameOver,
    status,
    rows,
    columns,
    bombs,
  } = useSelector((state) => state.cells)
  const [playPop] = useSound("/pop-sound-effect.mp3", { playbackRate })
  const [playWon] = useSound("/won.mp3")
  const [playLost] = useSound("/lost-2.mp3")

  const deviceWidth = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth
    } else {
      return null
    }
  }, [])

  useEffect(() => {
    if (sound && gameOver && status === "won") {
      playWon()
    } else if (sound && gameOver && status === "lost") {
      playLost()
    } else if (
      openedCells.length !== 0 &&
      openedCells.length !== rows * columns - bombs &&
      sound &&
      !gameOver
    ) {
      playPop()
      dispatch(increasePlaybackRate())
      let delay
      if (deviceWidth <= 850) {
        delay = 50
      } else {
        if (rows > 15 || columns > 15) {
          delay = 500
        } else {
          delay = 1000
        }
      }
      for (let i = 0; i < delay; i++) {
        console.log("")
      }
    }
  }, [openedCells, gameOver])

  return (
    <>
      {sound ? (
        <Volume2
          color="var(--icons-foreground)"
          style={{ opacity: 0.8, cursor: "pointer" }}
          onClick={() => dispatch(toggleSound())}
        />
      ) : (
        <VolumeX
          color="var(--icons-foreground)"
          style={{ opacity: 0.8, cursor: "pointer" }}
          onClick={() => dispatch(toggleSound())}
        />
      )}
    </>
  )
}

export default Sound
