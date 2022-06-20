import {throwError} from 'rxjs';
import {tap} from 'rxjs/operators';

import cleanMimeType from '../internals/cleanMimeType';
import mulawToLinear16 from '../internals/mulawToLinear16';
// import wavToLinear16 from '../internals/wavToLinear16';
// import mpegToLinear16 from '../internals/mpegToLinear16';

// References:
// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs
// See: https://cloud.ibm.com/docs/speech-to-text?topic=speech-to-text-audio-formats
// optional: parameters include codecs, rate, channels, endianness
const supportedMimeTypes = [
  {audioFormat: 'linear16', mimeType: 'audio/l16'},
  // {audioFormat: 'wav', mimeType: 'audio/wav'},
  // {audioFormat: 'wav', mimeType: 'audio/x-wav'},
  // {audioFormat: 'wav', mimeType: 'audio/wave'},
  // {audioFormat: 'mpeg', mimeType: 'audio/mpeg'},
  // {audioFormat: 'mpeg', mimeType: 'audio/mp3'},
  // {audioFormat: 'mpeg', mimeType: 'audio/mp4'},
  {audioFormat: 'mulaw', mimeType: 'audio/x-mulaw'},
  // {audioFormat: 'flac', mimeType: 'audio/flac'}, // lossless compression
  // {audioFormat: 'webm', mimeType: 'audio/webm'},
  // {audioFormat: 'alaw', mimeType: 'audio/alaw'},
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

const errors = {
  noPipelineForMimeType: mimeType => new Error(`no pipeline for mimeType: ${mimeType}`),
};

const pipelines = {
  'linear16': {
    config: {},
    transformer: tap,
  },
  // 'wav': {
  //   config: {},
  //   transformer: wavToLinear16,
  // },
  // 'mpeg': {
  //   config: {},
  //   transformer: mpegToLinear16,
  // },
  'mulaw': {
    config: {
      bitDepth: '8m',
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
  const cleanMimeType = cleanupMimeType(mimeType);
  const match = supportedMimeTypes.find(m => m.mimeType === cleanMimeType);
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

export default toLinear16;
