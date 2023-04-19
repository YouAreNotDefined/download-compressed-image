interface PreprocessOptions {

}

interface EncodeOptions {

}

const DefaultPreprocessOptions: PreprocessOptions = {
  strict: true,
  checkOrientation: true,
  quality: 0.7,
  resize: 'none',
  width: 640,
  height: 640,
  mimeType: 'auto',
  maxWidth: 1000,
  maxHeight: 1000
}

const DefaultEncodeOptions: EncodeOptions = {
  strict: true,
  checkOrientation: true,
  quality: 0.7,
  resize: 'none',
  width: 640,
  height: 640,
  mimeType: 'auto',
  maxWidth: 1000,
  maxHeight: 1000
}

export { DefaultPreprocessOptions, DefaultEncodeOptions, PreprocessOptions, EncodeOptions }
