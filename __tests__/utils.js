function getCaharacters(page = 0) {
  return fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
    .then((res) => {
      console.log(res)
      return res.json()
    })
    .then((res) => {
      console.log(res)
      return res
    })
}

export { getCaharacters }
