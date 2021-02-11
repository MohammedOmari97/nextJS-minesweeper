import React, { useEffect, useRef, memo } from "react"
import styles from "./styles/game.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { initializeGrid } from "../components/store"
import Cell from "./cell"
import { debounce } from "debounce"

function Game({ setHorizontalScrollBarHeight, setVerticalScrollBarWidth }) {
  const dispatch = useDispatch()
  const { rows, columns } = useSelector((state) => state.cells)

  console.log("rendering game")

  const containerRef = useRef()

  useEffect(() => {
    dispatch(initializeGrid())
    const listener = window.addEventListener(
      "resize",
      debounce(() => {
        if (containerRef.current) {
          setHorizontalScrollBarHeight(
            window.innerHeight - containerRef.current.clientHeight
          )
          setVerticalScrollBarWidth(
            window.innerWidth - containerRef.current.clientWidth
          )
        }
      }, 500)
    )

    return () => window.removeEventListener("resize", listener)
  }, [])

  return (
    <div ref={containerRef} className={styles.container}>
      <div data-testid="grid" className={styles.grid}>
        {Array(rows)
          .fill(null)
          .map((_row, i) => {
            return (
              <div
                data-testid="grid-row"
                key={`row ${i}`}
                className={styles.row}
              >
                {Array(columns)
                  .fill(null)
                  .map((_column, j) => {
                    return (
                      <Cell
                        data-testid="grid-cell"
                        key={`${i} ${j}`}
                        row={i}
                        column={j}
                      />
                    )
                  })}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default memo(Game)
