import React from "react"
import { render, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { Game, store, Layout, Options } from "../components"
import { getPosition } from "../utils/utils"
import { reset, resetApp } from "../components/store"

function getCell(getAllByTestId, row, column) {
  return getAllByTestId("grid-row")[row].childNodes[column]
}

beforeEach(() => {
  store.dispatch(reset())
  jest.useFakeTimers()
})

const App = (
  <Provider store={store}>
    <Layout
      render={(setHorizontalScrollBarHeight, setVerticalScrollBarWidth) => {
        if (store.getState().cells.mode === "options") {
          return <Options />
        } else {
          return (
            <Game
              setHorizontalScrollBarHeight={setHorizontalScrollBarHeight}
              setVerticalScrollBarWidth={setVerticalScrollBarWidth}
            />
          )
        }
      }}
    />
  </Provider>
)

test("it should display the grid with the correct number of rows and columns", () => {
  const { getAllByTestId } = render(App)

  const { rows, columns } = store.getState().cells
  const gridRows = getAllByTestId("grid-row")

  expect(gridRows.length).toEqual(rows)
  expect(gridRows[0].childNodes.length).toEqual(columns)
})

test("the grid should not include any bombs once it is rendered", () => {
  const { getAllByTestId } = render(App)

  let state = store.getState().cells
  const randomRow = Math.floor(Math.random() * state.rows)
  const randomColumn = Math.floor(Math.random() * state.columns)
  const cell = getAllByTestId("grid-row")[randomRow].childNodes[randomColumn]
  let allCells = []

  // getting the surroundings of the random cell
  for (let i = randomRow - 1; i <= randomRow + 1; i++) {
    for (let j = randomColumn - 1; j <= randomColumn + 1; j++) {
      if (i >= 0 && j >= 0 && i < state.rows && j < state.columns) {
        allCells.push([i, j])
      }
    }
  }

  for (let i = 0; i < allCells.length; i++) {
    expect(
      getCell(
        getAllByTestId,
        allCells[i][0],
        allCells[i][1]
      ).className.includes("cell-closed")
    ).toBe(true)
  }

  userEvent.click(cell)

  state = store.getState().cells
  expect(state.openedCells.length).toBeGreaterThanOrEqual(4)
  expect(state.bombsIndexes.length).toEqual(state.bombs)

  for (let i = 0; i < allCells.length; i++) {
    let storeCellSurroundingClassName =
      state.cells[allCells[i][0]][allCells[i][1]].surrounding > 4
        ? "5Plus"
        : state.cells[allCells[i][0]][allCells[i][1]].surrounding

    expect(
      getCell(
        getAllByTestId,
        allCells[i][0],
        allCells[i][1]
      ).className.includes("cell-closed")
    ).toBe(false)
    expect(
      getCell(
        getAllByTestId,
        allCells[i][0],
        allCells[i][1]
      ).className.includes(`cell-${storeCellSurroundingClassName}`)
    ).toBe(true)
  }
})

test("it should display a game over modal when the user reveals all the safe cells without clicking a bomb", () => {
  const { container, getAllByTestId, getByText } = render(App)

  let state = store.getState().cells
  userEvent.click(
    getAllByTestId("grid-row")[Math.floor(Math.random() * state.rows)]
      .childNodes[Math.floor(Math.random() * state.columns)]
  )

  state = store.getState().cells
  for (let i = 0; i < state.rows * state.columns; i++) {
    if (state.bombsIndexes.includes(i)) continue

    let { row, column } = getPosition(i, state.rows, state.columns)
    userEvent.click(getCell(getAllByTestId, row, column))
  }

  expect(getByText("You Won!")).toBeInTheDocument()
  expect(container).toBeInTheDocument()
})

test("game over modal should appear if the user clicked a bomb", () => {
  const { getByText, getAllByTestId } = render(App)

  let state = store.getState().cells
  userEvent.click(
    getAllByTestId("grid-row")[Math.floor(Math.random() * state.rows)]
      .childNodes[Math.floor(Math.random() * state.columns)]
  )

  state = store.getState().cells
  const bombIndex = state.bombsIndexes[0]
  const { row, column } = getPosition(bombIndex, state.rows, state.columns)
  userEvent.click(getAllByTestId("grid-row")[row].childNodes[column])

  expect(getByText(/You Lost!/i)).toBeInTheDocument()
})

test("the game should reset after the user clicks on play again", () => {
  const { getByText, getAllByTestId } = render(App)

  let state = store.getState().cells
  userEvent.click(
    getAllByTestId("grid-row")[Math.floor(Math.random() * state.rows)]
      .childNodes[Math.floor(Math.random() * state.columns)]
  )

  state = store.getState().cells
  for (let i = 0; i < state.rows * state.columns; i++) {
    if (state.bombsIndexes.includes(i)) continue

    let { row, column } = getPosition(i, state.rows, state.columns)
    userEvent.click(getCell(getAllByTestId, row, column))
  }

  expect(getByText(/Play again!/i)).toBeInTheDocument()
  userEvent.click(getByText(/Play again!/i))

  for (let i = 0; i < state.rows; i++) {
    for (let j = 0; j < state.columns; j++) {
      expect(
        getCell(getAllByTestId, i, j).className.includes("cell-closed")
      ).toBe(true)
    }
  }
})

test("the user can't reveal a flagged cell and you can't click it", () => {
  const { container, getAllByTestId } = render(App)

  const cell = getCell(getAllByTestId, 5, 5)
  fireEvent.contextMenu(cell)
  expect(cell).toContainHTML(
    '<img src="/minesweeper-icons/flag.png" alt="flag icon">'
  )
  userEvent.click(cell)
  expect(cell.className.includes("cell-closed")).toBe(true)

  fireEvent.contextMenu(cell)
  expect(cell).not.toContainHTML(
    '<img src="/minesweeper-icons/flag.png" alt="flag icon">'
  )
  userEvent.click(cell)
  expect(cell.className.includes("cell-closed")).toBe(false)

  expect(container).toBeInTheDocument()
})

test("the remaining cells is changing according to how many safe cells left", () => {
  store.dispatch(resetApp())

  const { getByText, getAllByTestId, getByTestId, rerender } = render(App)

  userEvent.click(getByText(/Play/i))
  rerender(App)

  let state = store.getState().cells
  expect(getByTestId("remaining-cells").textContent).toBe(
    `0 / ${state.rows * state.columns - state.bombs}`
  )

  const randomCell = getCell(
    getAllByTestId,
    Math.floor(Math.random() * state.rows),
    Math.floor(Math.random() * state.columns)
  )
  userEvent.click(randomCell)

  state = store.getState().cells
  const openedCellsNum = state.openedCells.length

  expect(getByTestId("remaining-cells").textContent).toBe(
    `${openedCellsNum} / ${state.rows * state.columns - state.bombs}`
  )
})

// the cell became active if there is a number of flags around it equals or greater than it's number of surrounding bombs
// all of the active cell's unflagged surroundings are revealed when clicking on it

// there is cases not covered here 🔽
test("timer test", () => {
  store.dispatch(resetApp())

  const { getByText, getAllByTestId, rerender } = render(App)

  userEvent.click(getByText(/Play/i))
  rerender(App)

  let state = store.getState().cells
  let randomCell = getCell(
    getAllByTestId,
    Math.floor(Math.random() * state.rows),
    Math.floor(Math.random() * state.columns)
  )
  userEvent.click(randomCell)

  state = store.getState().cells

  expect(setInterval).toBeCalledTimes(1)
  expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000)

  const { row, column } = getPosition(
    state.bombsIndexes[0],
    state.rows,
    state.columns
  )
  const bombCell = getCell(getAllByTestId, row, column)

  userEvent.click(bombCell)

  expect(clearInterval).toHaveBeenCalledTimes(1)

  userEvent.click(getByText(/Play again!/i))

  jest.useFakeTimers()
  expect(setInterval).toHaveBeenCalledTimes(0)

  randomCell = getCell(
    getAllByTestId,
    Math.floor(Math.random() * state.rows),
    Math.floor(Math.random() * state.columns)
  )
  userEvent.click(randomCell)

  expect(setInterval).toHaveBeenCalledTimes(1)
})
