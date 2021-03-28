# @buccaneerai/linear16
> 🎶 Converts audio data to LINEAR16 format

> ⚠️ This module will not run on Apple M1 chips because the FFMPEG (installed via ffmpeg-static) does not support the ARM architecture.

## Installation
This is a private package. It requires setting up access in your npm config.

```bash
yarn add @buccaneerai/linear16
```

## API

### `audioFileToLinear16`
```js
import {audioFileToLinear16} from '@buccaneerai/linear16';

const inputFile = './my-file.mp3';
const outputFile = './my-file.linear16';
const obs$ = audioFileToLinear16(inputFile, outputFile);
obs$.subscribe(console.log); 
// Output:
// my-file.linear16
```

## Contributing, Deployments, etc.
See [CONTRIBUTING.md](https://github.com/buccaneerai/linear16/blob/master/docs/CONTRIBUTING.md) file for information about deployments, etc.
