const path = require('path');
const {fromFile, shortenChunks, writeToFile} = require('@buccaneerai/rxjs-fs');

const mulawToLinear16 = require('../../dist/internals/mulawToLinear16').default;
const toLinear16 = require('../../dist/index').toLinear16;
console.log('mulawToLinear16', mulawToLinear16);

// const mulawFilePath = path.resolve(
//   __dirname,
//   '../../audio-samples/doctor-convo.ulaw'
// );
// const pathOut = path.resolve(
//   __dirname,
//   '../../audio-samples/doctor-convo-upsampled-from-mulaw.l16'
// );

const mulawFileToLinear16 = ({inputFilePath, outputFilePath}) => {
  const mulawChunk$ = fromFile({filePath: inputFilePath});
  const linear16$ = mulawChunk$.pipe(
    shortenChunks(100),
    // mulawToLinear16(),
    toLinear16({
      mimeType: 'audio/x-mulaw',
      sampleRate: 8000,
      channels: 1,
      firstChunkContainsHeaders: false,
    })
  );
  const writeLinear16$ = linear16$.pipe(
    // tap(console.log),
    writeToFile({filePath: outputFilePath})
  );
  return writeLinear16$;
};

module.exports = mulawFileToLinear16;
