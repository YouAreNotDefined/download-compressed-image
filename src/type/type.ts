const Method = {
  TRIANGLE: 'triangle',
  CATROM: 'catrom',
  MITCHELL: 'mitchell',
  LANCZOS3: 'lanczos3',
} as const

const Format = {
  JPEG: 'mozjpeg',
  PNG: 'oxipng',
  WEBP: 'webp',
} as const

interface Config {
  resize: {
    enabled: Boolean
    width: Number
    height: Number
    premultiply: Boolean
    linearRGB: Boolean
    method: typeof Method[keyof typeof Method]
  }
  quality: Number
  format: typeof Format[keyof typeof Format]
}

const defaultConfig: Config = {
  resize: {
    enabled: false,
    width: 640,
    height: 640,
    premultiply:true,
    linearRGB: true,
    method: 'lanczos3'
  },
  quality: 75,
  format: 'mozjpeg',
}

export { defaultConfig, Config, Method, Format }
