import React, { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import useSound from "use-sound"
import {
  toggleSound,
  increasePlaybackRate,
  increasePopSoundDelay,
} from "./store"
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
    popSoundDelay,
  } = useSelector((state) => state.cells)
  const [playPop] = useSound("/pop-sound-effect.mp3", { playbackRate })
  const [playWon] = useSound("/won.mp3")
  const [playLost] = useSound("/lost-2.mp3")

  function playSound() {
    playPop()
  }

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
      dispatch(increasePlaybackRate())
      // dispatch(increasePopSoundDelay())
      // setTimeout(() => {
      //   // playPop()
      //   playSound()
      // }, popSoundDelay)
      playPop()
      for (let i = 0; i < 1000; i++) {
        console.log("hello")
      }
      // playPop()
    }
  }, [openedCells, gameOver])

  return (
    <>
      {sound ? (
        <Volume2
          color="var(--icons-foreground)"
          style={{ opacity: 0.8 }}
          onClick={() => dispatch(toggleSound())}
        />
      ) : (
        <VolumeX
          color="var(--icons-foreground)"
          style={{ opacity: 0.8 }}
          onClick={() => dispatch(toggleSound())}
        />
      )}
    </>
  )
}

export default Sound
