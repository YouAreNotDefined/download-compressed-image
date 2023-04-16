// https://pkg.go.dev/github.com/h2non/bimg#Options
const ImageType = {
  JPEG: 1,
  WEBP: 2,
  PNG: 3,
}

type ImageType = typeof ImageType[keyof typeof ImageType]

// https://pkg.go.dev/github.com/h2non/bimg#Options
interface Options {
  Height: Number
  Width: Number
  Quality: Number
  Type: ImageType
  Embed: Boolean
}

const defaultOptions: Options = {
  Embed: true,
  Quality: 70,
  Width: 640,
  Height: 640,
  Type: 1
}

export { defaultOptions, Options, ImageType }
