const path = require('path');
const {fromFile, shortenChunks, writeToFile} = require('@buccaneerai/rxjs-fs');

const mulawToLinear16 = require('../../dist/internals/mulawToLinear16').default;
console.log('mulawToLinear16', mulawToLinear16);

const mulawFilePath = path.resolve(
  __dirname,
  '../../audio-samples/doctor-convo.ulaw'
);
const pathOut = path.resolve(
  __dirname,
  '../../audio-samples/doctor-convo-upsampled-from-mulaw.l16'
);

const mulawFileToLinear16 = ({inputFilePath, outputFilePath}) => {
  const mulawChunk$ = fromFile({filePath: inputFilePath});
  const linear16$ = mulawChunk$.pipe(
    shortenChunks(8000),
    mulawToLinear16(),
  );
  const writeLinear16$ = linear16$.pipe(
    // tap(console.log),
    writeToFile({filePath: outputFilePath})
  );
  return writeLinear16$;
};

module.exports = mulawFileToLinear16;
