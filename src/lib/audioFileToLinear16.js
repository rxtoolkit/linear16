const mime = require('mime');
const fs = require('fs');
const {Observable, throwError} = require('rxjs');

// https://medium.com/cod3/convert-speech-from-an-audio-file-to-text-using-google-speech-api-b951f4032a64
const audioFileToLinear16 = (filePathIn, filePathOut) => {
  const promise = new Promise((resolve, reject) => {
    if (!filePathIn || !filePathOut) {
      return throwError(
        new Error('You must specify a path for both input and output files.')
      );
    }
    if (!fs.existsSync(filePathIn)) {
      return throwError(new Error('Input file must exist.'));
    }
    if (mime.getType(filePathIn).indexOf('audio') < 0) {
      return throwError(new Error('File must have audio mime.'));
    }
    try {
      return new Observable(obs => {
        const stream = spawn(
          'ffmpeg',
          [
            '-i', inputFilePath,
            '-f', 's16le',
            '-acodec', 'pcm_s16le',
            '-vn',
            '-ac', '1',
            '-ar', '16k',
            '-map_metadata', '-1',
            outputFilePath
          ],
        );
        stream.on('data', obs.next);
        stream.on('error', obs.error);
        stream.on('close', obs.complete);
      });
    } catch (e) {
      return throwError(e);
    }
  });
};

module.exports = audioFileToLinear16;
