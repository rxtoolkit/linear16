import fs from 'fs';
import path from 'path';
import {WaveFile} from 'wavefile';
import {expect} from 'chai';
// import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import {take,tap} from 'rxjs/operators';
import {fromFile, shortenChunks, writeToFile} from '@buccaneerai/rxjs-fs';

import mulawToLinear16 from './mulawToLinear16';

describe('mulawToLinear16', () => {
  it('should export a function', () => {
    expect(mulawToLinear16).to.be.a('function');
  });

  // it('should create an audio file', () => {
  //   createL16FileFromMulaw();
      // const expectedWavDataBuffer = fs.readFileSync(upsampledWavPath);
    // const wav = new WaveFile(expectedWavDataBuffer);
    // const l16SampleBuffer = wav.data.samples;
    // console.log('L16SAMPLES', l16SampleBuffer);
    // console.log('mlawBuffer', mulawBuffer);

  // });

  // it('should convert mulaw data to LINEAR16', () => {

  // });

  it('should convert mulaw data to LINEAR16', marbles(m => {
    // const upsampledLinear16Path = path.resolve(
    //   __dirname,
    //   '../../audio-samples/doctor-convo-upsampled-from-mulaw.l16'
    // );
    const mulawFilePath = path.resolve(
      __dirname,
      '../../audio-samples/doctor-convo.ulaw'
    );
    // const linear16Buffer = fs.readFileSync(upsampledLinear16Path);
    const mulawBuffer = fs.readFileSync(mulawFilePath);
    const input$ = m.cold('0|', [
      mulawBuffer.subarray(0, 4), // contains 8kb/sec of data (8-bit * 8000hz / 8 bits per byte)
      // mulawBuffer.subarray(8000, 16000),
    ]);
    const actual$ = input$.pipe(mulawToLinear16());
    const expected$ = m.cold('0|', [
      Buffer.from([
        252,
        255,
        255,
        255,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]), // contains 32kb/sec of data (16 bit * 16000hz / 8 bits per byte)
      // linear16Buffer.subarray(8000, 16000),
    ]);
    m.expect(actual$).toBeObservable(expected$);
  }));
});
