import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import styles from "./styles/gameOver.module.scss"
import { reset } from "./store"
import { useTransition, animated } from "react-spring"
import Button from "./button"
import { BiTimer, BiStopwatch } from "react-icons/bi"

function getGameOverMessage(status, cellsLeft) {
  if (status === "won") {
    return "This was a good one, well done!"
  } else {
    if (cellsLeft <= 2) {
      return "Oh man, that was close!"
    } else if (cellsLeft <= 5) {
      return `${cellsLeft} cells remaining, That was not that bad, try again and crush it!`
    } else {
      return (
        <span>
          That was bad, i guess u should see how the game is played{" "}
          <img
            src="/minesweeper-icons/thinking-face.png"
            alt="thinking face"
            style={{ width: "30px", height: "30px", verticalAlign: "middle" }}
          />
        </span>
      )
    }
  }
}

function GameOver() {
  const {
    gameOver,
    status,
    difficulty,
    rows,
    columns,
    bombs,
    openedCells,
  } = useSelector((state) => state.cells)
  const { time } = useSelector((state) => state.time)
  const dispatch = useDispatch()
  const transition = useTransition(gameOver, null, {
    from: {
      opacity: 0,
      transform: "translateY(20px)",
    },
    enter: {
      opacity: 1,
      transform: "translateY(0px)",
    },
    leave: {
      opacity: 0,
      transform: "translateY(20px)",
    },
  })

  const key = `${difficulty}_${rows}_${columns}_${bombs}`

  let score = ""
  if (typeof window !== "undefined") {
    score = window.localStorage.getItem(key)
  }

  const [highScore, setHighScore] = useState(false)

  useEffect(() => {
    if (status === "won") {
      const [currentMins, currentSecs] = time.split(":")
      const [scoreMins, scoreSecs] = score
        ? score.split(":")
        : "1000:1000".split(":")

      console.log(time, currentMins, currentSecs)
      console.log(score, scoreMins, scoreSecs)

      if (
        Number(`${currentMins}${currentSecs}`) <
        Number(`${scoreMins}${scoreSecs}`)
      ) {
        setHighScore(true)
        window.localStorage.setItem(key, `${currentMins}:${currentSecs}`)
      } else {
        setHighScore(false)
      }
    }
  }, [status])

  return (
    <>
      {transition.map((props) => {
        return (
          props.item && (
            <div className={styles.container} data-testid="gameOver">
              {status === "won" ? (
                <animated.div className={styles.won} style={props.props}>
                  <div className={styles.message}>
                    <div>You Won!</div>
                    {highScore ? (
                      <div className={styles.newHighScore}>New High Score</div>
                    ) : undefined}
                    <div className={styles.scoresContainer}>
                      <div className={styles.currentScore}>
                        <h6>Score</h6>
                        <h3>
                          <BiStopwatch />
                          {time.split(":")[0] > 9
                            ? `${time.split(":")[0]}`
                            : `0${time.split(":")[0]}`}
                          :
                          {time.split(":")[1] > 9
                            ? `${time.split(":")[1]}`
                            : `0${time.split(":")[1]}`}
                        </h3>
                      </div>
                      <div className={styles.highScore}>
                        <h6>High Score</h6>
                        <h3
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <BiTimer />
                          {score
                            ? score.split(":")[0] > 9
                              ? `${score.split(":")[0]}`
                              : `0${score.split(":")[0]}`
                            : time.split(":")[0] > 9
                            ? `${time.split(":")[0]}`
                            : `0${time.split(":")[0]}`}
                          :
                          {score
                            ? score.split(":")[1] > 9
                              ? `${score.split(":")[1]}`
                              : `0${score.split(":")[1]}`
                            : time.split(":")[1] > 9
                            ? `${time.split(":")[1]}`
                            : `0${time.split(":")[1]}`}
                        </h3>
                      </div>
                    </div>
                    {getGameOverMessage(
                      status,
                      rows * columns - bombs - openedCells.length
                    )}
                  </div>
                  <Button
                    onClick={() => dispatch(reset())}
                    style={{ width: "40%", marginTop: "20px" }}
                  >
                    Play again!
                  </Button>
                </animated.div>
              ) : (
                <animated.div className={styles.lost} style={props.props}>
                  <div className={styles.message}>
                    <div>Ahhhhh, You Lost!</div>
                    {getGameOverMessage(
                      status,
                      rows * columns - bombs - openedCells.length
                    )}
                  </div>
                  <Button
                    style={{ width: "40%" }}
                    onClick={() => dispatch(reset())}
                  >
                    Play again!
                  </Button>
                </animated.div>
              )}
            </div>
          )
        )
      })}
    </>
  )
}

export default GameOver
