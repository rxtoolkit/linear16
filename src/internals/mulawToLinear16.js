import {WaveFile} from 'wavefile';
import get from 'lodash/get';
import {map} from 'rxjs/operators';

// https://stackoverflow.com/questions/64003753/encode-linear16-audio-to-twilio-media-audio-x-mulaw-nodejs
// https://stackoverflow.com/questions/61323549/converting-8khz-mulaw-to-pcm-16khz
const mulawToLinear16 = ({
  sampleRate = 8000,
  channels = 1,
  bitDepth = '8m', // 8-bit mu-Law
} = {}) => (
  chunk$ => chunk$.pipe(
    map(chunk => {
      const wav = new WaveFile();
      wav.fromScratch(channels, sampleRate, bitDepth, chunk);
      wav.fromMuLaw();
      wav.toSampleRate(16000); // resample
      // get 16-bit samples (LINEAR16 at 16000 Hz)
      const samples = get(wav, 'data.samples');
      const samplesBuffer = Buffer.from(samples);
      return samplesBuffer;
    })
  )
);

export default mulawToLinear16;
