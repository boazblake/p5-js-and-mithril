const range = (size) => [...Array(size).keys()]

const width = 600
const height = 600
const scl = 20

const w = 1400
const h = 1000
const flying = 0
const colOff = 0
const rowOff = 0
const terrain = [[]]
const cols = range(width / scl)
const rows = range(height / scl)

export const model = {
  scl,
  w,
  h,
  flying,
  colOff,
  rowOff,
  terrain,
  cols,
  rows
}
