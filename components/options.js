import React, { useMemo } from "react"
import styles from "./styles/options.module.scss"
import { useDispatch, useSelector } from "react-redux"
import {
  setRows,
  setColumns,
  setBombs,
  setDifficulty,
  setMode,
} from "../components/store"
import Button from "./button"

function Options() {
  const dispatch = useDispatch()
  const { rows, columns, bombs, difficulty } = useSelector(
    (state) => state.cells
  )

  const deviceWidth = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth
    } else {
      return null
    }
  }, [])

  let isMobile
  if (deviceWidth <= 850) {
    isMobile = true
  } else {
    isMobile = false
  }
  console.log(isMobile)

  return (
    <div className={styles.container}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          dispatch(setMode("playing"))
        }}
        className={styles.content}
      >
        <label className={styles.selectContainer}>
          <span>Set Difficulty</span>
          <select
            className={styles.selectInput}
            onChange={(e) => dispatch(setDifficulty(e.target.value))}
            value={difficulty}
          >
            <option>easy</option>
            <option>medium</option>
            {!isMobile && <option>hard</option>}
            <option>custom</option>
          </select>
        </label>
        <div className={styles.rowsColumns}>
          <label className={styles.inputNumberContainer}>
            <span>Grid width</span>
            <input
              className={styles.numberInput}
              value={columns}
              type="number"
              placeholder="number of rows"
              onChange={(e) => dispatch(setColumns(Number(e.target.value)))}
              min={1}
              max={isMobile ? 16 : 24}
            />
          </label>
          <label className={styles.inputNumberContainer}>
            <span>Grid height</span>
            <input
              className={styles.numberInput}
              value={rows}
              type="number"
              placeholder="number of columns"
              onChange={(e) => dispatch(setRows(Number(e.target.value)))}
              min={1}
              max={isMobile ? 16 : 24}
            />
          </label>
        </div>
        <label className={styles.inputNumberContainer}>
          <span>Bombs number</span>
          <input
            className={styles.numberInput}
            value={bombs}
            type="number"
            placeholder="number of bombs"
            onChange={(e) => dispatch(setBombs(Number(e.target.value)))}
            max={rows * columns - 10}
            min={1}
          />
        </label>
        <Button type="submit">play</Button>
      </form>
    </div>
  )
}

export default Options
