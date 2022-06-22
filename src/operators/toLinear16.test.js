import {expect} from 'chai';
// import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import fs from 'fs';
import path from 'path';
import {map} from 'rxjs/operators';

import toLinear16, {testExports} from './toLinear16';
const {errors} = testExports;

const l16File = path.resolve(__dirname, '../../audio-samples/doctor-convo.l16');
const mulawFile = path.resolve(__dirname, '../../audio-samples/doctor-convo.ulaw');
const fakeLinear16 = (filePath = l16File) => fs.readFileSync(filePath);
const fakeMulaw = (filePath = mulawFile) => fs.readFileSync(filePath);

describe('toLinear16', () => {
  it('should export a function', () => {
    expect(toLinear16).to.be.a('function');
  });

  it('should pass through data with mimeType audio/l16 data with no alterations', marbles(m => {
    const mimeType = 'audio/l16';
    const bufferIn = fakeLinear16();
    const input$ = m.cold('-01|', [
      bufferIn.subarray(0, 2000),
      bufferIn.subarray(2000, 4000)
    ]);
    const actual$ = input$.pipe(toLinear16({mimeType}));
    const expected$ = input$;
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should handle the mimeType audio/basic', marbles(m => {
    const mimeType = 'audio/basic';
    const bufferIn = fakeMulaw();
    const input$ = m.cold('-01|', [
      bufferIn.subarray(0, 2000),
      bufferIn.subarray(2000, 4000),
    ]);
    const actual$ = input$.pipe(
      toLinear16({mimeType}),
      map(Buffer.isBuffer)
    );
    const expected$ = m.cold('-01|', [true, true]);
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should handle the mimeType audio/x-mulaw', marbles(m => {
    const mimeType = 'audio/x-mulaw';
    const bufferIn = fakeMulaw();
    const input$ = m.cold('-01|', [
      bufferIn.subarray(0, 2000),
      bufferIn.subarray(2000, 4000),
    ]);
    const actual$ = input$.pipe(
      toLinear16({mimeType}),
      map(Buffer.isBuffer)
    );
    const expected$ = m.cold('-01|', [true, true]);
    m.expect(actual$).toBeObservable(expected$);
  }));

  // it('should handle mimeType audio/wav', marbles(m => {

  // }));

  // it('should handle mimeType audio/mpeg', marbles(m => {

  // }));

  it('should throw if the mimeType is not supported', marbles(m => {
    const mimeType = 'audio/invalid-type';
    const bufferIn = fakeLinear16();
    const input$ = m.cold('-01|', [
      bufferIn.subarray(0, 2000),
      bufferIn.subarray(2000, 4000),
    ]);
    const actual$ = input$.pipe(
      toLinear16({mimeType}),
      map(Buffer.isBuffer)
    );
    const expected = m.cold('#', null, errors.noPipelineForMimeType(mimeType))
  }));


});
