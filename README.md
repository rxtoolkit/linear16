# @buccaneerai/rxjs-linear16
> 🎶 Converts stream of audio chunks to LINEAR16 format (16-bit PCM at sample rate of 16000 Hz)

## Installation
This is a private package. It requires setting up access in your npm config.

```bash
yarn add @buccaneerai/rxjs-linear16
```

## API

### `toLinear16`
```js
import {fromFile} from '@buccaneerai/rxjs-fs';
import {toLinear16} from '@buccaneerai/rxjs-linear16';

const inputFile = './my-audio-file.mulaw';
const audioChunk$ = fromFile(inputFile);
const linear16$ = audioChunk$.pipe(toLinear16({
  mimeType: 'audio/x-mulaw',
  sampleRate: 8000,
  channels: 1,
  firstChunkContainsHeaders: true,
}));
linear16$.subscribe(); // outputs a stream of buffers, encoded as LINEAR16
```

## Contributing, Deployments, etc.
See [CONTRIBUTING.md](https://github.com/buccaneerai/linear16/blob/master/docs/CONTRIBUTING.md) file for information about deployments, etc.
