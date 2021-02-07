import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { gameOver } from "./store"

function RemainingCells() {
  const { openedCells, rows, columns, bombs } = useSelector(
    (state) => state.cells
  )
  const dispatch = useDispatch()

  useEffect(() => {
    if (openedCells.length === rows * columns - bombs) {
      dispatch(gameOver("won"))
    }
  }, [openedCells])

  return (
    <span data-testid="remaining-cells">
      {openedCells.length}{" "}
      <span style={{ fontFamily: "poppins", fontWeight: "bold" }}>/</span>{" "}
      {rows * columns - bombs}
    </span>
  )
}

export default RemainingCells
