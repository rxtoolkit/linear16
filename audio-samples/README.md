# Audio Samples

The easiest way to generate audio files like these is using the `ffmpeg` command line tool or an audio editor (like Fission).

## Examples

### Linear16 to WAV
```bash
ffmpeg -f s16le -ar 16k -ac 1 -i doctor-convo.l16 doctor-convo.wav
```

### WAV to Linear16
```bash
ffmpeg -i doctor-convo.wav -f s16le -acodec pcm_s16le doctor-convo.l16
```

### Linear16 to MP3
```bash
ffmpeg -f s16le -ar 16k -ac 1 -i doctor-convo.l16 doctor-convo.mp3
```

### MP3 to Linear16
```bash
ffmpeg -i doctor-convo.mp3 -f s16le -acodec pcm_s16le doctor-convo.l16
```

### Linear16 to Mulaw
```bash
ffmpeg -f mulaw -ar 16k -ac 1 -i doctor-convo.l16 doctor-convo.wav
```


