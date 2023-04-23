package main

import (
	"bytes"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"golang.org/x/image/draw"
)

type ImageType int

const (
	JPEG ImageType = iota
	PNG
	GIF
)

type Options struct {
	Width int
	Height int
	Quality int
	Type ImageType
}

func main() {}

func Compress(imgData []byte, opts Options) ([]byte, error) {
	img, _, err := image.Decode(bytes.NewReader(imgData))
	if err != nil {
		return nil, err
	}

	resizedImg := image.NewRGBA(image.Rect(0, 0, opts.Width, opts.Height))
	draw.Draw(resizedImg, resizedImg.Bounds(), img, img.Bounds().Min, draw.Src)

	switch opts.Type {
	case JPEG:
		outputImg := &bytes.Buffer{}
		err = jpeg.Encode(outputImg, resizedImg, &jpeg.Options{Quality: opts.Quality})
		if err != nil {
			return nil, err
		}
		return outputImg.Bytes(), nil
	case PNG:
		outputImg := &bytes.Buffer{}
		err = png.Encode(outputImg, resizedImg)
		if err != nil {
			return nil, err
		}
		return outputImg.Bytes(), nil
	case GIF:
		outputImg := &bytes.Buffer{}
		err = gif.Encode(outputImg, resizedImg, &gif.Options{NumColors: 256})
		if err != nil {
			return nil, err
		}
		return outputImg.Bytes(), nil
	default:
		outputImg := &bytes.Buffer{}
		err = jpeg.Encode(outputImg, resizedImg, &jpeg.Options{Quality: opts.Quality})
		if err != nil {
			return nil, err
		}
		return outputImg.Bytes(), nil
	}
}

func (it ImageType) String() string {
	switch it {
	case JPEG:
		return "JPEG"
	case PNG:
		return "PNG"
	case GIF:
		return "GIF"
	default:
		return "JPEG"
	}
}
