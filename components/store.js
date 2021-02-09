import { configureStore, createSlice } from "@reduxjs/toolkit"
import { getIndex, getPosition } from "../utils/utils"

function initializeCells(rows, columns) {
  return Array(rows)
    .fill(null)
    .map(() =>
      Array(columns).fill(null).fill({
        isBomb: false,
        surrounding: undefined,
        isFlag: false,
        isOpened: false,
      })
    )
}

const initialState = {
  cells: Array(8)
    .fill(null)
    .map(() =>
      Array(8).fill(null).fill({
        isBomb: false,
        surrounding: undefined,
        isFlag: false,
        isOpened: false,
        isActive: false,
      })
    ),
  rows: 8,
  columns: 8,
  bombs: 10,
  difficulty: "easy", // easy || medium || hard
  status: "idel", // playing || idel || won || lost
  mode: "options", // options || playing
  firstCell: undefined,
  gameOver: false,
  openedCells: [],
  theme: "light",
  // theme:
  //   typeof window !== "undefined"
  //     ? window.localStorage.getItem("__theme__")
  //       ? window.localStorage.getItem("__theme__")
  //       : "light"
  //     : "light",
  sound: true,
  bombsIndexes: [],
  clickedCellsForEmojiAnimation: [],
  playbackRate: 0.75,
  popSoundDelay: 0,
  time: "0:0",
}

const cellsSlice = createSlice({
  name: "cellsSlice",
  initialState,
  reducers: {
    setRows: {
      reducer(state, action) {
        if (
          action.payload.rows === 8 &&
          state.columns === 8 &&
          state.bombs === 10
        ) {
          return { ...state, rows: action.payload.rows, difficulty: "easy" }
        } else if (
          action.payload.rows === 16 &&
          state.columns === 16 &&
          state.bombs === 40
        ) {
          return { ...state, rows: action.payload.rows, difficulty: "medium" }
        } else if (
          action.payload.rows === 24 &&
          state.columns === 24 &&
          state.bombs === 99
        ) {
          return { ...state, rows: action.payload.rows, difficulty: "hard" }
        } else {
          return { ...state, rows: action.payload.rows, difficulty: "custom" }
        }
      },
      prepare(rows) {
        return { payload: { rows } }
      },
    },
    setColumns: {
      reducer(state, action) {
        if (
          action.payload.columns === 8 &&
          state.rows === 8 &&
          state.bombs === 10
        ) {
          return {
            ...state,
            columns: action.payload.columns,
            difficulty: "easy",
          }
        } else if (
          action.payload.columns === 16 &&
          state.rows === 16 &&
          state.bombs === 40
        ) {
          return {
            ...state,
            columns: action.payload.columns,
            difficulty: "medium",
          }
        } else if (
          action.payload.columns === 24 &&
          state.rows === 24 &&
          state.bombs === 99
        ) {
          return {
            ...state,
            columns: action.payload.columns,
            difficulty: "hard",
          }
        } else {
          return {
            ...state,
            columns: action.payload.columns,
            difficulty: "custom",
          }
        }
      },
      prepare(columns) {
        return { payload: { columns } }
      },
    },
    setBombs: {
      reducer(state, action) {
        if (
          action.payload.bombs === 10 &&
          state.rows === 8 &&
          state.columns === 8
        ) {
          return { ...state, bombs: action.payload.bombs, difficulty: "easy" }
        } else if (
          action.payload.bombs === 40 &&
          state.rows === 16 &&
          state.columns === 16
        ) {
          return { ...state, bombs: action.payload.bombs, difficulty: "medium" }
        } else if (
          action.payload.bombs === 99 &&
          state.rows === 24 &&
          state.columns === 24
        ) {
          return { ...state, bombs: action.payload.bombs, difficulty: "hard" }
        } else {
          return { ...state, bombs: action.payload.bombs, difficulty: "custom" }
        }
      },
      prepare(bombs) {
        return { payload: { bombs } }
      },
    },
    setDifficulty: {
      reducer(state, action) {
        if (action.payload.difficulty === "easy") {
          return {
            ...state,
            difficulty: action.payload.difficulty,
            rows: 8,
            columns: 8,
            bombs: 10,
          }
        } else if (action.payload.difficulty === "medium") {
          return {
            ...state,
            difficulty: action.payload.difficulty,
            rows: 16,
            columns: 16,
            bombs: 40,
          }
        } else if (action.payload.difficulty === "hard") {
          return {
            ...state,
            difficulty: action.payload.difficulty,
            rows: 24,
            columns: 24,
            bombs: 99,
          }
        } else {
          return state
        }
      },
      prepare(difficulty) {
        return { payload: { difficulty } }
      },
    },
    setMode: {
      reducer(state, action) {
        if (action.payload.mode === "playing") {
          return {
            ...state,
            mode: action.payload.mode,
            status: "idel",
            cells: initializeCells(state.rows, state.columns),
            openedCells: [],
          }
        } else {
          return {
            ...state,
            mode: action.payload.mode,
            status: "idel",
            firstCell: undefined,
          }
        }
      },
      prepare(mode) {
        return { payload: { mode } }
      },
    },
    initializeGrid: {
      reducer(state) {
        let { rows, columns } = state
        // let { bombs, rows, columns, firstCell } = state
        // let { row, column } = firstCell
        const cells = Array(rows)
          .fill(null)
          .map(() => Array(columns).fill(null))

        // function getSurrounding(row, column) {
        //   let bombCount
        //   for (let i = row - 1; i < row + 2; i++) {
        //     for (let j = column - 1; j < column + 2; j++) {
        //       if (i < rows && i < 0 && j < columns && j > 0) {
        //         if (cells[i][j].bomb) bombCount++
        //       }
        //     }
        //   }
        //   return bombCount
        // }

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            cells[i][j] = {
              isOpened: false,
              bomb: false,
              surrounding: undefined,
              isFlag: false,
            }
          }
        }

        // let isBomb
        // let bombCount = 0
        // for (let i = 0; i < rows; i++) {
        //   for (let j = 0; j < columns; j++) {
        //     if (row === i && column === j) {
        //       cells[i][j] = { isOpened: true, bomb: false, surrounding: getSurrounding(i, j) }
        //     }

        //     if (bombCount < bombs && Math.random() > 0.5) {
        //       isBomb = true
        //     } else {
        //       isBomb = false
        //     }
        //     cells[i][j] = { isOpened: false, bomb: isBomb }
        //   }
        // }
      },
    },
    revealCell: {
      reducer(state, action) {
        if (!state.firstCell) {
          function getSurrounding(row, column) {
            let bombCount = 0
            let surrounding = []
            for (let i = row - 1; i < row + 2; i++) {
              for (let j = column - 1; j < column + 2; j++) {
                if (i < state.rows && i >= 0 && j < state.columns && j >= 0) {
                  surrounding.push({ x: i, y: j })
                  if (state.cells[i][j].isBomb) bombCount++
                }
              }
            }
            return { bombCount, surrounding }
          }

          state.clickedCellsForEmojiAnimation.push({
            x: action.payload.row,
            y: action.payload.column,
          })

          state.status = "playing"

          let { row, column } = action.payload

          state.firstCell = {
            row,
            column,
          }

          let allExcluded = getSurrounding(row, column).surrounding.map(
            (point) => {
              return getIndex(point.x, point.y, state.rows, state.columns)
            }
          )

          allExcluded.push(getIndex(row, column, state.rows, state.columns))

          let bombsIndexes = []
          for (let i = 0; i < state.bombs; i++) {
            let bombIndex = Math.floor(
              Math.random() * state.rows * state.columns
            )
            while (
              bombsIndexes.includes(bombIndex) ||
              allExcluded.includes(bombIndex)
            ) {
              bombIndex = Math.floor(Math.random() * state.rows * state.columns)
            }
            bombsIndexes.push(bombIndex)
          }

          state.bombsIndexes = bombsIndexes

          // planting bombs :O `Dangerous 💣`
          for (let i = 0; i < bombsIndexes.length; i++) {
            let { row, column } = getPosition(
              bombsIndexes[i],
              state.rows,
              state.columns
            )
            state.cells[row][column].isBomb = true
          }

          // for (let i = 0; i < state.rows; i++) {
          //   for (let j = 0; j < state.columns; j++) {
          //     if (row === i && column === j) {
          //       state.cells[i][j].isBomb = false
          //     } else {
          //       if (bombCount < state.bombs && Math.random() > 0.5) {
          //         isBomb = true
          //         bombCount++
          //       } else {
          //         isBomb = false
          //       }
          //       state.cells[i][j] = { isBomb }
          //     }
          //   }
          // }

          let surrounding = 0
          for (let i = 0; i < state.rows * state.columns; i++) {
            let { row, column } = getPosition(i, state.rows, state.columns)
            surrounding = getSurrounding(row, column).bombCount
            state.cells[row][column].surrounding = surrounding
          }
          // for (let i = 0; i < state.rows; i++) {
          //   for (let j = 0; j < state.columns; j++) {
          //     surrounding = getSurrounding(i, j)
          //     state.cells[i][j].surrounding = surrounding
          //   }
          // }

          state.cells[row][column].isOpened = true
          state.openedCells.push(
            getIndex(
              action.payload.row,
              action.payload.column,
              state.rows,
              state.columns
            )
          )
        } else {
          if (state.cells[action.payload.row][action.payload.column].isBomb) {
            state.gameOver = true
            state.status = "lost"
            state.cells[action.payload.row][
              action.payload.column
            ].isOpened = true

            // reveal all the bombs
            for (let i = 0; i < state.bombsIndexes.length; i++) {
              let { row, column } = getPosition(
                state.bombsIndexes[i],
                state.rows,
                state.columns
              )
              state.cells[row][column].isOpened = true
              state.cells[row][column].isFlag = false
            }
          } else {
            if (
              !state.cells[action.payload.row][action.payload.column].isOpened
            ) {
              state.cells[action.payload.row][
                action.payload.column
              ].isOpened = true
              state.openedCells.push(
                getIndex(
                  action.payload.row,
                  action.payload.column,
                  state.rows,
                  state.columns
                )
              )
              state.clickedCellsForEmojiAnimation.push({
                x: action.payload.row,
                y: action.payload.column,
              })
            }
          }
        }
      },
      prepare(row, column) {
        return { payload: { row, column } }
      },
    },
    revealSurrounding: {
      reducer(state, action) {
        let { row, column } = action.payload
        if (state.cells[row][column].isActive) {
          state.clickedCellsForEmojiAnimation.push({
            x: row,
            y: column,
          })
        }
        for (let i = row - 1; i < row + 2; i++) {
          for (let j = column - 1; j < column + 2; j++) {
            if (
              i < state.rows &&
              i >= 0 &&
              j < state.columns &&
              j >= 0 &&
              !state.cells[i][j].isFlag
            ) {
              if (!state.cells[i][j].isOpened) {
                // state.cells[i][j].isOpened = true
                // state.openedCells.push(
                //   getIndex(i, j, state.rows, state.columns)
                // )
                if (!state.cells[i][j].isBomb) {
                  state.cells[i][j].isOpened = true
                  state.openedCells.push(
                    getIndex(i, j, state.rows, state.columns)
                  )
                } else {
                  state.cells[i][j].isOpened = true
                  for (let i = 0; i < state.bombsIndexes.length; i++) {
                    let { row, column } = getPosition(
                      state.bombsIndexes[i],
                      state.rows,
                      state.columns
                    )
                    state.cells[row][column].isOpened = true
                    state.cells[row][column].isFlag = false
                  }
                }
              }
            }
          }
        }
      },
      prepare(row, column) {
        return { payload: { row, column } }
      },
    },
    flagCell: {
      reducer(state, action) {
        function getSurrounding(row, column) {
          let bombCount = 0
          let surrounding = []
          // console.log(row, column)
          for (let i = row - 1; i < row + 2; i++) {
            for (let j = column - 1; j < column + 2; j++) {
              if (i < state.rows && i >= 0 && j < state.columns && j >= 0) {
                // console.log(i, j)
                surrounding.push({ x: i, y: j })
                if (state.cells[i][j].isBomb) bombCount++
              }
            }
          }
          return { bombCount, surrounding }
        }

        state.cells[action.payload.row][action.payload.column].isFlag = !state
          .cells[action.payload.row][action.payload.column].isFlag

        let surrounding = getSurrounding(
          action.payload.row,
          action.payload.column
        ).surrounding
        for (let i = 0; i < surrounding.length; i++) {
          if (state.cells[surrounding[i].x][surrounding[i].y].isBomb) {
            continue
          }

          let cellSurrounding = getSurrounding(
            surrounding[i].x,
            surrounding[i].y
          ).surrounding

          let surroundingFlags = 0
          for (let j = 0; j < cellSurrounding.length; j++) {
            if (
              state.cells[cellSurrounding[j].x][cellSurrounding[j].y].isFlag
            ) {
              surroundingFlags++
            }

            if (
              surroundingFlags >=
              state.cells[surrounding[i].x][surrounding[i].y].surrounding
            ) {
              state.cells[surrounding[i].x][surrounding[i].y].isActive = true
            } else {
              state.cells[surrounding[i].x][surrounding[i].y].isActive = false
            }
          }
        }
      },
      prepare(row, column) {
        return { payload: { row, column } }
      },
    },
    gameOver: {
      reducer(state, action) {
        state.status = action.payload.status
        state.gameOver = true
      },
      prepare(status) {
        return { payload: { status } }
      },
    },
    reset: {
      reducer(state) {
        console.log(state.rows, state.columns, state.difficulty)
        return {
          ...initialState,
          status: "idel",
          mode: "playing",
          theme: state.theme,
          sound: state.sound,
          rows: state.rows,
          columns: state.columns,
          bombs: state.bombs,
          difficulty: state.difficulty,
          cells: initializeCells(state.rows, state.columns),
        }
      },
    },
    resetApp: {
      reducer(state) {
        return {
          ...initialState,
          status: "idel",
          mode: "options",
          theme: state.theme,
          sound: state.sound,
          rows: state.rows,
          columns: state.columns,
          bombs: state.bombs,
          difficulty: state.difficulty,
          cells: initializeCells(state.rows, state.columns),
        }
      },
    },
    toggleTheme: {
      reducer(state) {
        if (state.theme === "light") {
          state.theme = "dark"
        } else {
          state.theme = "light"
        }
      },
    },
    toggleSound: {
      reducer(state) {
        if (state.sound) {
          state.sound = false
        } else {
          state.sound = true
        }
      },
    },
    increasePlaybackRate: {
      reducer(state) {
        state.playbackRate += 0.1
      },
    },
    resetPlaybackRate: {
      reducer(state) {
        state.playbackRate = 0.75
      },
    },
    increasePopSoundDelay: {
      reducer(state) {
        state.popSoundDelay += 50
      },
    },
    resetPopSoundDelay: {
      reducer(state) {
        state.popSoundDelay = 0
      },
    },
    setTime: {
      reducer(state, action) {
        state.time = action.payload.time
      },
      prepare(time) {
        return { payload: { time } }
      },
    },
  },
})

const info = createSlice({
  name: "info",
  initialState: {
    show: false,
  },
  reducers: {
    toggleInfo: {
      reducer(state) {
        state.show = !state.show
      },
    },
  },
})

const fullscreen = createSlice({
  name: "fullscreen",
  initialState: false,
  reducers: {
    setFullscreen: {
      reducer(_state, action) {
        return action.payload.fullscreen
      },
      prepare(fullscreen) {
        return { payload: { fullscreen } }
      },
    },
  },
})

export const {
  setBombs,
  setRows,
  setColumns,
  setDifficulty,
  setMode,
  revealCell,
  initializeGrid,
  revealSurrounding,
  flagCell,
  gameOver,
  reset,
  resetApp,
  toggleTheme,
  toggleSound,
  increasePlaybackRate,
  resetPlaybackRate,
  setTime,
  increasePopSoundDelay,
  resetPopSoundDelay,
} = cellsSlice.actions

export const { toggleInfo } = info.actions

export const { setFullscreen } = fullscreen.actions

const store = configureStore({
  reducer: {
    cells: cellsSlice.reducer,
    info: info.reducer,
    fullscreen: fullscreen.reducer,
  },
})

export default store
