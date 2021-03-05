import React from "react"
import styles from "./styles/info.module.scss"
import { animated, useTransition } from "react-spring"
import { useSelector, useDispatch } from "react-redux"
import { toggleInfo } from "./store"
import { X } from "react-feather"

function Info() {
  const { show } = useSelector((state) => state.info)
  const dispatch = useDispatch()
  const transition = useTransition(show, null, {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(20px)" },
  })

  return (
    <>
      {transition.map((props) => {
        return (
          props.item && (
            <div className={styles.container}>
              <button
                className={styles.exit}
                onClick={() => dispatch(toggleInfo())}
              >
                <X color="var(--options-bg)" />
              </button>
              <animated.div style={props.props} className={styles.modal}>
                <h2>How to play</h2>
                <div className={styles.row}>
                  <div className={styles.unrevealedCellExample}>
                    <div className={styles.unrevealedCell}></div>
                    <h4>Unrevealed Cell</h4>
                  </div>
                  <div className={styles.bombCellExample}>
                    <div className={styles.bomb}>
                      <img src="/minesweeper-icons/mine.svg" alt="bomb icon" />
                    </div>
                    <h4>Bomb Cell</h4>
                  </div>
                </div>
                <p>
                  An unrevealed tile might have a bomb behind it, it might not.
                  The idea is to clear all the tiles that don't have bombs
                  behind them.
                </p>
                <div className={styles.row}>
                  <div className={styles.clearedCellExample}>
                    <div className={styles.clearedCell}></div>
                    <h4>Cleared Cell</h4>
                  </div>
                  <div className={styles.clueCellExample}>
                    <div className={styles.clueCell}>1</div>
                    <h4>Clue Cell</h4>
                  </div>
                </div>
                <p>
                  If you avoid a bomb, the number tells you how many of the 8
                  surrounding tiles are a bomb. If it's blank, none of the
                  surrounding tiles is a bomb. If you think you know where a
                  bomb is, flag it!
                </p>
                <div className={styles.row}>
                  <div className={styles.flaggedCellExample}>
                    <div className={styles.flaggedCell}>
                      <img src="/minesweeper-icons/flag.png" />
                    </div>
                    <h4>Flagged Cell</h4>
                  </div>
                  <div className={styles.activeCellExample}>
                    <div className={styles.activeCell}>1</div>
                    <h4>Active Cell</h4>
                  </div>
                </div>
                <p>
                  Right click the tile or in mobile, long click it to turn into
                  flag mode, and tap the suspected tile. Once you've flagged
                  enough tiles around a clue, it'll become active. Tap an active
                  clue to clear all the non-flagged tiles around it.
                </p>
                <h2>Github</h2>
                <p style={{ textAlign: "center" }}>
                  Source code can be found at my GitHub repository.
                </p>
                <h2>Credit</h2>
                <p style={{ textAlign: "center" }}>Built by Mohamed Al-Omari</p>
              </animated.div>
            </div>
          )
        )
      })}
    </>
  )
}

export default Info
