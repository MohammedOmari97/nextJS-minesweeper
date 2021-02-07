import React from "react"
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

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <label className={styles.selectContainer}>
          <span>Set Difficulty</span>
          <select
            className={styles.selectInput}
            onChange={(e) => dispatch(setDifficulty(e.target.value))}
            value={difficulty}
          >
            <option>easy</option>
            <option>medium</option>
            <option>hard</option>
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
          />
        </label>
        <Button onClick={() => dispatch(setMode("playing"))}>play</Button>
      </div>
    </div>
  )
}

export default Options
