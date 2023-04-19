const ImageType = {
  JPEG: 0,
  PNG: 1,
  GIF: 2,
}

type ImageType = typeof ImageType[keyof typeof ImageType]

interface Options {
  Height: Number
  Width: Number
  Quality: Number
  Type: ImageType
}

const defaultOptions: Options = {
  Quality: 70,
  Width: 640,
  Height: 640,
  Type: 1
}

export { defaultOptions, Options, ImageType }
