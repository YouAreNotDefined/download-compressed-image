// @ts-ignore
import { ImagePool } from "@squoosh/lib"
import { cpus } from "os"
const imagePool = new ImagePool(cpus().length)

export async function CompressImage(imageData: ArrayBuffer, preprocessOptions: , encodeOptions: ): ArrayBuffer {
  const image = imagePool.ingestImage(imageData)
  await image.preprocess(preprocessOptions);
  const encodedImage = await image.encode(encodeOptions)
  await imagePool.close()
  return encodedImage
}
