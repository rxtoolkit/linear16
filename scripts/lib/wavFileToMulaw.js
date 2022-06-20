const fs = require('fs');
const wavefile = require('wavefile');
const get = require('lodash/get');
const {of} = require('rxjs');

const wavFileToMulaw = ({inputFilePath, outputFilePath}) => {
  const bufferIn = fs.readFileSync(inputFilePath);
  const wav = new wavefile.WaveFile(bufferIn);
  wav.toBitDepth('8');
  wav.toSampleRate(8000);
  wav.toMuLaw();
  const outputBuffer = get(wav, 'data.samples');
  fs.writeFileSync(outputFilePath, outputBuffer);
  return of('done');
};

module.exports = wavFileToMulaw;
