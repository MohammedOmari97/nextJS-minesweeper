function getPosition(index, rows, columns) {
  // let row = Number.parseInt(index / rows)
  // let row = Number.parseInt(index / columns)
  // let column = (index % rows) % columns
  let row = Number.parseInt(index / columns)
  let column = index % columns

  return { row, column }
}

function getIndex(row, column, rows, columns) {
  // let index = row * rows + column
  let index = row * columns + column

  return index
}

export { getPosition, getIndex }
