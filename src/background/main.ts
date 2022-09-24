import { saveAs } from 'file-saver'
import Compressor from 'compressorjs'
import { defaultOptions } from "../common"

let options = defaultOptions

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 'options': JSON.stringify(options) })
  chrome.contextMenus.create({
    id: 'compressed-download',
    title: 'Compressed Download',
    contexts: ['image'],
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || !tab.id) return
  if (info.menuItemId !== 'compressed-download') return
  chrome.storage.local.get('options', value => {
    options = JSON.parse(value.options)
  })
  chrome.tabs.sendMessage(tab.id, "", async (res) => {
    if (!res.value) return
    const pattern = new RegExp('/<img.*?src\s*=\s*[\"|\'](.*?)[\"|\'].*?>/i')
    const imgTag = res.value.match(pattern)
    if (!imgTag) return
    const url = imgTag[1]
    const imageBlob = await getImage(url, tab)
    compressSave(imageBlob, url)
  })
})

async function getImage(url: string, tab: chrome.tabs.Tab) {
  const uri = await getImageUrl(url, tab)
  const res = await fetch(uri)
  const blob = await res.blob()
  return blob
}

async function getImageUrl(url: string, tab: chrome.tabs.Tab) {
  const pattern = new RegExp(/http(s)?:|\/\//)
  if (pattern.test(url)) return url
  return `${tab.url}${url}`
}

function getImageName(url: string): string {
  const pattern = new RegExp('.+/(.+?)\.[a-z]+([\?#;].*)?$')
  return url.match(pattern)![1]
}

function compressSave(blob: Blob, url: string) {
  options.success = (result) => {
    saveAs(result, getImageName(url))
  }
  options.error = (error) => {
    alert(error.message)
  }
  new Compressor(blob, options)
}
