export default {
  test: {
    display: 'combine(y, (x, y) => "" + x + y)',
    fn: (x, y) => x.combine(y, (x, y) => '' + x + y).changes(),
    inputs: [
      [{time: 0, value: 4}, {time: 10, value: 6}, {time: 50, value: 8}],
      [{time: 2, value: 'A'}, {time: 12, value: 'B'}, {time: 52, value: 'C'}]
    ]
  }
}
