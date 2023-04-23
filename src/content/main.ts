
import { saveAs } from 'file-saver'
import { Options, ImageType } from '../common'

interface result {
  outputImage: Uint8Array
  err: Error
}

let options: Options

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(message => {
    const data = JSON.parse(message)
    chrome.storage.local.get('options', value => {
      options = JSON.parse(value.options)
    })
    getImage(data.info)
      .then(async arrayBuffer => {
        const imageUint8Array = new Uint8Array(arrayBuffer)
        const wasmCode = await fetch('./main.wasm')
        WebAssembly.instantiate(wasmCode, {})
          .then(instance => {
            const Compress = instance.exports.Compress as CallableFunction
            const result: result = Compress(imageUint8Array, options)
            const url = getImageUrl(data.info)
            const type = Object.entries(ImageType).find(([_key, value]) => value === options.Type)
            if (!type) {
              console.error('Output Format Is Invalid')
              throw new Error('Output Format Is Invalid')
            }
            const file = new File([result.outputImage], getImageName(url, type[0]), { type: type[0] })
            saveAs(file)
          })
          .catch(err => {
            console.error(err)
            throw new Error(err)
          })
      })
      .catch(err => {
        console.error(err)
        throw new Error(err)
      })
  })
})

async function getImage(info: chrome.contextMenus.OnClickData) {
  const url = getImageUrl(info)
  const res = await fetch(url)
  const arrayBuffer = await res.arrayBuffer()
  return arrayBuffer
}

function getImageUrl(info: chrome.contextMenus.OnClickData): string {
  const pattern = new RegExp(/http(s)?:|\/\//)
  if (pattern.test(info.srcUrl!)) return info.srcUrl!
  return `${info.pageUrl}${info.srcUrl}`
}

function getImageName(url: string, type: string): string {
  const pattern = new RegExp('.+/(.+?)\.[a-z]+([\?#;].*)?$')
  return `${url.toLowerCase().match(pattern)![1]}${type.toLowerCase}`
}
