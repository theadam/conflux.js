export default {
  test: {
    display: 'combine(y, (x, y) => "" + x + y)',
    fn: (x, y) => x.combine(y, (x, y) => '' + x + y).changes(),
    inputs: [
      [{time: 0, value: 4}, {time: 27, value: 6}, {time: 42, value: 8}, {time: 63, value: 10}, {time: 74, value: 12}],
      [{time: 12, value: 'A'}, {time: 39, value: 'B'}, {time: 54, value: 'C'}, {time: 77, value: 'D'}, {time: 85, value: 'E'}]
    ]
  }
}
