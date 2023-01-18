import get from 'lodash/get';
import {throwError} from 'rxjs';
import {tap} from 'rxjs/operators';

import cleanMimeType from '../internals/cleanMimeType';
import mulawToLinear16 from '../internals/mulawToLinear16';
// import wavToLinear16 from '../internals/wavToLinear16';
// import mpegToLinear16 from '../internals/mpegToLinear16';


const errors = {
  noPipelineForMimeType: mimeType => new Error(`no pipeline for mimeType: ${mimeType}`),
};

// SEE README for audio encoding information
const supportedMimeTypes = [
  {audioFormat: 'linear16', mimeType: 'audio/l16'},
  // {audioFormat: 'wav', mimeType: 'audio/wav'},
  // {audioFormat: 'wav', mimeType: 'audio/x-wav'},
  // {audioFormat: 'wav', mimeType: 'audio/wave'},
  // {audioFormat: 'mpeg', mimeType: 'audio/mpeg'},
  // {audioFormat: 'mpeg', mimeType: 'audio/mp3'},
  // {audioFormat: 'mpeg', mimeType: 'audio/mp4'},
  // {audioFormat: 'mpeg', mimeType: 'audio/mpa'},
  // Mulaw: Lossy codec often used for raw audio in USA, such as phone calls
  {audioFormat: 'basic', mimeType: 'audio/basic'}, // basic is single-channel Mulaw at 8000Hz and 8-bit depth
  {audioFormat: 'mulaw', mimeType: 'audio/x-mulaw'},
  {audioFormat: 'mulaw', mimeType: 'audio/pcmu'},
  // {audioFormat: 'webm', mimeType: 'audio/webm'},
  // {audioFormat: 'alaw', mimeType: 'audio/alaw'},
  // {audioFormat: 'alaw', mimeType: 'audio/pcma'},
  // 'audio/l16;rate=16000',
  // 'audio/l16; rate=16000',
  // {audioFormat: 'webm', mimeType: 'audio/webm; codecs=opus', // default recording data type from browsers}
  // {audioFormat: 'webm', mimeType: 'audio/webm; codecs=vorbis'},
  // {audioFormat: 'alaw', mimeType: 'audio/alaw;rate=16000'},
  // {audioFormat: 'alaw', mimeType: 'audio/alaw; rate=16000'},
  // {audioFormat: 'aac', mimeType: 'audio/aac'},
  // {audioFormat: 'opus', mimeType: 'audio/opus'},
  // {audioFormat: 'ogg', mimeType: 'audio/ogg'},
  // {audioFormat: 'ogg', mimeType: 'audio/ogg;codecs=opus'},
  // {audioFormat: 'ogg', mimeType: 'audio/ogg; codecs=opus'},
  // {audioFormat: 'ogg', mimeType: 'audio/ogg;codecs=vorbis'},
  // {audioFormat: 'ogg', mimeType: 'audio/ogg; codecs=vorbis'},
  // {audioFormat: 'gpp', mimeType: 'audio/3gpp'},
  // {audioFormat: 'gpp', mimeType: 'audio/3gpp2'},
];

// see README for audio encoding information
const pipelines = {
  'linear16': {
    config: {
      bitDepth: '16',
    },
    transformer: () => tap(),
  },
  // {audioFormat: 'flac', mimeType: 'audio/flac'},
  // 'flac': {
  // },
  // 'wav': {
  //   config: {},
  //   transformer: wavToLinear16,
  // },
  // 'mpeg': {
  //   config: {},
  //   transformer: mpegToLinear16,
  // },
  'basic': {
    config: {
      sampleRate: 8000,
      bitDepth: '8',
      channels: 1,
    },
    transformer: mulawToLinear16,
  },
  'mulaw': {
    config: {
      // variable sampleRate
      bitDepth: '8',
      channels: 1,
    },
    transformer: mulawToLinear16,
  },
};

const toLinear16 = ({
  mimeType,
  sampleRate = 16000,
  channels = 1,
  firstChunkContainsHeaders = true,
}) => chunk$ => {
  const parsedMimeType = cleanMimeType(mimeType);
  const match = supportedMimeTypes.find(m => m.mimeType === parsedMimeType);
  if (!match) return throwError(errors.noPipelineForMimeType(mimeType));
  const pipeline = get(pipelines, match.audioFormat);
  const operator = pipeline.transformer({
    sampleRate,
    channels,
    withHeaders: firstChunkContainsHeaders,
    ...pipeline.config
  });
  const linear16Chunk$ = chunk$.pipe(operator);
  return linear16Chunk$;
};

export const testExports = {errors};
export default toLinear16;
