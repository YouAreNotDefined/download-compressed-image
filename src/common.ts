const ImageType = {
  JPEG: 0,
  PNG: 1,
  GIF: 2,
}

type ImageType = typeof ImageType[keyof typeof ImageType]

interface Options {
  Height: number
  Width: number
  Quality: number
  Type: ImageType
}

const defaultOptions: Options = {
  Quality: 0.7,
  Width: 640,
  Height: 640,
  Type: 0
}

export { defaultOptions, Options, ImageType }
