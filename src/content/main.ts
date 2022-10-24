import { saveAs } from 'file-saver'
import Compressor from 'compressorjs'
import Jimp from "jimp/browser/lib/jimp"

let options: Compressor.Options

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    const data = JSON.parse(message)
    chrome.storage.local.get('options', value => {
      options = JSON.parse(value.options)
    })
    // getImage(data.info)
    //   .then(blob => {
    //     compressSave(blob, data.info.srcUrl)
    //   })
    //   .catch(err => {
    //     console.error(err)
    //     throw new Error(err)
    //   })
    getImageBuffer(data.info)
      .then(buffer => {
        runJimp(buffer)
      })
      .catch(err => {
        console.error(err)
        throw new Error(err)
      })
  })
})

function runJimp(buffer: ArrayBuffer) {
  new Jimp({ data: buffer }, (err: Error, image: Jimp) => {
    if (err) {
      console.error(err)
      throw new Error(err.message)
    }

  })
}

function save(buffer: ArrayBuffer, url: string, type: string) {
  const file = new File([buffer], getImageName(url), { type })
  saveAs(file)
}

async function getImageBuffer(info: chrome.contextMenus.OnClickData) {
  const url = getImageUrl(info)
  const res = await fetch(url)
  const buffer = res.arrayBuffer()
  return buffer
}

function getImageUrl(info: chrome.contextMenus.OnClickData): string {
  const pattern = new RegExp(/http(s)?:|\/\//)
  if (pattern.test(info.srcUrl!)) return info.srcUrl!
  return `${info.pageUrl}${info.srcUrl}`
}

function getImageName(url: string): string {
  let pattern: RegExp
  let extend = ''
  if (options.mimeType === 'auto') {
    pattern = new RegExp('.+/(.+?)([\?#;].*)?$')
  } else {
    pattern = new RegExp('.+/(.+?)\.[a-z]+([\?#;].*)?$')
    extend = `.${options.mimeType?.replace('image/', '')}`
  }
  return `${url.match(pattern)![1]}${extend}`
}
