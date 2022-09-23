import Compressor from 'compressorjs'

const defaultOptions:Compressor.Options  = {
  strict: true,
  checkOrientation: true,
  quality: 0.7,
  resize: 'none',
  width: 640,
  height: 640,
  mimeType: 'auto',
  maxWidth: Infinity,
  maxHeight: Infinity,
}

export { defaultOptions }
