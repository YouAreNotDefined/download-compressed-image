import { saveAs } from 'file-saver'
import Compressor from 'compressorjs'

let options: Compressor.Options

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    const data = JSON.parse(message)
    chrome.storage.local.get('options', value => {
      options = JSON.parse(value.options)
    })
    getImage(data.info)
      .then(blob => {
        compressSave(blob, data.info.srcUrl)
      })
      .catch(err => {
        console.error(err)
        throw new Error(err)
      })
  })
})

function compressSave(blob: Blob, url: string) {
  options.success = (result: Blob) => {
    const file = new File([result], getImageName(url), { type: result.type })
    saveAs(file)
  }
  options.error = (err) => {
    console.error(err)
    throw new Error(err.message)
  }
  new Compressor(blob, options)
}

async function getImage(info: chrome.contextMenus.OnClickData) {
  const url = getImageUrl(info)
  const res = await fetch(url)
  const blob = await res.blob()
  return blob
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
