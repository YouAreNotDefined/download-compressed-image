package main

import (
	"log"

	"github.com/h2non/bimg"
)

func main() {}

func Compress(inputImage []byte, options bimg.Options) ([]byte, error) {
	image := bimg.NewImage(inputImage)

	outputImage, err := image.Process(options)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	return outputImage, nil
}
