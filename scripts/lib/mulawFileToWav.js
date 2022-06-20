const fs = require('fs');
const wavefile = require('wavefile');
const get = require('lodash/get');
const {of} = require('rxjs');

const mulawFileToWav = ({inputFilePath, outputFilePath}) => {
  const bufferIn = fs.readFileSync(inputFilePath);
  const wav = new wavefile.WaveFile();
  wav.fromScratch(1, 8000, '8m', bufferIn);
  wav.fromMuLaw();
  wav.toSampleRate(16000); // resample
  const bufferOut = wav.toBuffer();
  fs.writeFileSync(outputFilePath, bufferOut);
  // get 16-bit samples (LINEAR16 at 16000 Hz)
  return of('done');
};

module.exports = mulawFileToWav;
