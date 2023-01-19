import {WaveFile} from 'wavefile';
import get from 'lodash/get';
import {map} from 'rxjs/operators';
import {shortenChunks} from '@buccaneerai/rxjs-fs';

// https://stackoverflow.com/questions/64003753/encode-linear16-audio-to-twilio-media-audio-x-mulaw-nodejs
// https://stackoverflow.com/questions/61323549/converting-8khz-mulaw-to-pcm-16khz
const mulawToLinear16 = ({
  sampleRate = 8000,
  // 1 second of MULAW audio is 8kb (8000hz * 8-bit-depth * 1 channel / 8 bytes per bit)
  // Don't use chunks that are too small because they won't be transformed accurately to LINEAR16.
  // Don't use chunks that are too long because it will increase lag/latency for downstream results
  chunkSize = 4000
} = {}) => (
  chunk$ => chunk$.pipe(
    shortenChunks(chunkSize),
    map(chunk => {
      const channels = 1;
      const bitDepth = '8';
      const wav = new WaveFile();
      wav.fromScratch(channels, sampleRate, bitDepth, chunk);
      wav.fromMuLaw();
      wav.toSampleRate(16000); // resample
      // get 16-bit samples (LINEAR16 at 16000 Hz)
      // const samples = get(wav, 'data.samples'); // Returns UInt8Array
      const samples = wav.getSamples(true, Int16Array);
      console.log('samples', samples, samples.length);
      // const samplesBuffer = Buffer.from(samples);
      const samplesBuffer = Buffer.from(samples.buffer);
      // console.log('samplesBuffer', samplesBuffer.toString('asci'));
      return samplesBuffer;
    })
  )
);

export default mulawToLinear16;
