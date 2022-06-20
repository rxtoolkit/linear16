import wav from 'wavefile';

const wavToLinear16 = ({
  sampleRate,
  channels,
  bitDepth,
  withHeaders = true,
}) => chunk$ => chunk$.pipe(
  scan((acc, next) => [next, acc[1] + 1], [null, -1]),
  map(([chunk, index]) => {

  })
);

export default wavToLinear16;
