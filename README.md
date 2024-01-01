# @rxtk/linear16
> 🎶 Converts stream of audio chunks to LINEAR16 format (single-channel 16-bit PCM at sample rate of 16KHz)

```bash
npm i @rxtk/linear16
```

```bash
yarn add @rxtk/linear16
```

## API

### `toLinear16`
```js
import {fromFile} from '@rxtk/fs';
import {toLinear16} from '@rxtk/linear16';

const inputFile = './my-audio-file.mulaw';
const audioChunk$ = fromFile({filePath: inputFile});
const linear16$ = audioChunk$.pipe(toLinear16({
  mimeType: 'audio/x-mulaw',
  sampleRate: 8000,
  channels: 1,
  firstChunkContainsHeaders: false,
}));
linear16$.subscribe(); // outputs a stream of buffers, encoded as LINEAR16
```

## Audio data formats
| encoding   | bit-depth | rate (KHz)| channels | lossless | headers | compressed | comment                | supported |
| :--------- | :-------: | :--:      | :--:     | :--:     | :--:    | :--:       | :-----                  | :-----:  |
| l16        | 16        | 16❓      | ❓ 1     |  ✅      | ❌      | ❌         | Standard for STT       | ✅       |
| flac       | ❓        | ❓        | ❓       |  ✅      | ✅      | ✅         | Compressed PCM         |         |
| 32-bit PCM | 32        | ❓        | ❓       |  ✅      | ❌      | ❌         | Raw PCM (32-bit floats) |       |
| basic      | 8         | 8         |  1        | ❌      | ❌      | ✅         | Telephone calls (USA)   | ✅       |
| mulaw      | 8         | ❓ 8      |  1        | ❌      | ❌      | ✅         | Telephone calls (USA)   | ✅       |
| mpeg/mp3   | 16        | 44.1      | 2❓      |  ❌      | ✅      | ✅          | Music and video        |          |
| wav        | ❓        |  ❓       |  ❓      |  ❓      | ✅      | ❓          | Universal container    |          |
| webm (opus)| ❓        |  8-48❓  | ❓1-255   |  ❌      |         | ❓          |  Browser/web standard      |          |
| webm (vorbis)| ❓      |          |           |          |         |             |  Older browser/web standard |          |
> ❓ indicates it is variable. ❓ with a number means that it is usually set to that value but not always.

For machine learning models (including speech-to-text), the standard is generally single-channel LINEAR16 at 16KHz. This is what we use because it is the most portable and all speech to text pipelines support it.

These are the most common audio data formats but there are dozens of possible formats.

### Brief explanation of how audio data works

- **Raw audio data** generally consists of samples of audio over time. The raw data can be represented simply as an array of numbers.
- The **sample rate** describes how often audio samples are taken.  For example, 16KHz means there are 16,000 samples taken per second.  So to sample one second of audio, you would need 16,000 numbers (samples) to represent it.
- Each sample is represented by a number describing the height of the sound wave at any given point in time.  Usually this number is a 16-bit integer or 32-bit float.  This is the **bit-depth** of the audio data. For example, 16-bit encoded PCM data is represented by a series of 16-bit integers and has a bit depth of 16 bits.
- Audio can have one or more **channels**: most commonly mono (1 channel) or stereo (2 channels).
- Audio data can be fairly large so it is often compressed.  Some compression formats (like MP3 and Mulaw) are **lossy** and others like (FLAC) are **lossless** (they preserve all of the original data).
- Some audio formats (wav, mp3, flac) contain **headers** and metadata at the start of the file.  Others (LINEAR16, PCM, Mulaw) are simply raw audio data with no headers.
- Some multi-channel audio formats break data into **frames**.  Each frame represents a window of time and contains the audio samples for all of the channels but only for that time frame.

### Stream processing of audio
Some unique considerations when processing audio in a streaming system:
- Headers generally need to be read first and only for the first chunk or chunks in the stream. The easiest way do deal with this is to ensure that all of the header metadata is contained in the first chunk being analyzed.
- In order to de-compress a compressed format (like FLAC, MP3, or Mulaw), it may be necessary to break the audio stream into complete units that can be de-compressed--incomplete frames may need to be buffered until can be read in their entirety.

### Audio data references
If you want to learn more, these web pages are helpful:
- [Mozilla: Intro to audio data concepts](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_concepts)
- [Wikipedia: Audio coding formats](https://en.wikipedia.org/wiki/Audio_coding_format)
- [IBM Watson STT: good overview of common audio codecs](https://cloud.ibm.com/docs/speech-to-text?topic=speech-to-text-audio-formats)
- [Pretty comprehensize list of audio mimetypes](https://www.digipres.org/formats/mime-types/#audio/basic)
- [Mozilla: Common browser audio mimetypes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)
- [GCP STT: Intro to audio codecs](https://cloud.google.com/speech-to-text/docs/encoding)
- [RFC describing mime types](https://www.rfc-editor.org/rfc/rfc3190.txt)
