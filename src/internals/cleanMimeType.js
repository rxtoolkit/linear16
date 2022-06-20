const cleanMimeType = mimeType => mimeType.replace(/\;.*$/, '');

export default cleanMimeType;
