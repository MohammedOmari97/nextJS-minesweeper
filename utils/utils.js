function getPosition(index, columns) {
  let row = Number.parseInt(index / columns)
  let column = index % columns

  return { row, column }
}

function getIndex(row, column, columns) {
  let index = row * columns + column

  return index
}

export { getPosition, getIndex }
