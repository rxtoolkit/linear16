import {expect} from 'chai';
// import sinon from 'sinon';
// import {marbles} from 'rxjs-marbles/mocha';

import cleanMimeType from './cleanMimeType';

describe('cleanMimeType', () => {
  it('should export a function', () => {
    expect(cleanMimeType).to.be.a('function');
  });

  it('should return clean mimetype (without rate, codec, etc)', () => {
    const mimeType = 'audio/webm; codecs=opus; rate=16000; channels=0';
    const actual = cleanMimeType(mimeType);
    const expected = 'audio/webm';
    expect(actual).to.deep.equal(expected);
  });
});
