import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  revealCell,
  revealSurrounding,
  flagCell,
  gameOver,
  resetPlaybackRate,
  resetPopSoundDelay,
} from "./store"
import styles from "./styles/cell.module.scss"

function Cell({ row, column, ...props }) {
  const dispatch = useDispatch()
  // console.log(row, column)
  const { isBomb, surrounding, isOpened, isFlag, isActive } = useSelector(
    (state) => state.cells.cells[row][column]
  )
  // console.log(surrounding)

  // useEffect(() => {
  //   if (isOpened) {
  //     dispatch(calcSurrounding(row, column))
  //   }
  // }, [isOpened])

  useEffect(() => {
    if (isOpened && isBomb) {
      dispatch(gameOver("lost"))
    } else {
      if (isOpened && surrounding === 0) {
        dispatch(revealSurrounding(row, column))
      }
    }
  }, [isOpened])

  let cellContent
  if (isFlag) {
    cellContent = <img src="/minesweeper-icons/flag.png" alt="flag icon" />
  } else if (isOpened) {
    if (isBomb) {
      // cellContent = "bomb"
      cellContent = <img src="/minesweeper-icons/mine.svg" alt="bomb icon" />
    } else {
      if (surrounding === 0) {
        cellContent = ""
      } else {
        cellContent = surrounding
      }
    }
  } else {
    cellContent = ""
  }

  let cellStyle
  if (isOpened) {
    if (!isBomb) {
      cellStyle = styles[`cell-${surrounding}`]
    } else {
      cellStyle = styles["cell-bomb"]
    }
  } else {
    if (isFlag) {
      cellStyle = `${styles["cell-closed"]} ${styles["cell-flagged"]}`
    } else {
      cellStyle = styles["cell-closed"]
    }
  }

  if (isActive) {
    cellStyle += ` ${styles["cell-active"]}`
  }

  return (
    <button
      className={`${styles.cell} ${cellStyle}`}
      onClick={(e) => {
        if (e.button === 0 && isActive && isOpened) {
          dispatch(resetPlaybackRate())
          dispatch(resetPopSoundDelay())
          dispatch(revealSurrounding(row, column))
        } else if (e.button === 0 && !isFlag) {
          dispatch(resetPlaybackRate())
          dispatch(resetPopSoundDelay())
          dispatch(revealCell(row, column))
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        if (!isOpened) {
          dispatch(flagCell(row, column))
        }
      }}
      {...props}
    >
      {cellContent}
      <div
        className={styles.active}
        style={{
          opacity: isOpened ? (isActive ? 1 : 0) : 0,
          border: `solid var(--cell-${
            surrounding < 5 ? surrounding : "5Plus"
          }-text) 1px`,
        }}
      ></div>
    </button>
  )
}

export default Cell
