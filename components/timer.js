import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setTime } from "./store"

function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const { status } = useSelector((state) => state.cells)
  const dispatch = useDispatch()

  useEffect(() => {
    if (status === "playing") {
      setSeconds(0)
      setMinutes(0)
      const id = setInterval(() => {
        setSeconds((seconds) => {
          if (seconds + 1 >= 60) {
            dispatch(setTime(`${minutes + 1}:0`))
            setMinutes((minutes) => minutes + 1)
            return 0
          } else {
            dispatch(setTime(`${minutes}:${seconds + 1}`))
            return seconds + 1
          }
        })
      }, 1000)

      return () => clearInterval(id)
    } else if (status === "idel") {
      setSeconds(0)
      setMinutes(0)
    }
  }, [status])

  return (
    <div>
      {minutes < 10 ? `0${minutes}` : `${minutes}`}:
      {seconds < 10 ? `0${seconds}` : `${seconds}`}
    </div>
  )
}

export default Timer
