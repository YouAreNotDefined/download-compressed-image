import { saveAs } from 'file-saver'
import Compressor from 'compressorjs'
import { defaultOptions } from "../common"

let options = defaultOptions

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 'options': JSON.stringify(options) })
  chrome.contextMenus.create({
    id: 'download',
    title: '圧縮ダウンロード'
  })
})

chrome.contextMenus.onClicked.addListener(async () => {
  const currentTab = await getCurrentTab()
  if (!currentTab.id) return
  chrome.storage.local.get('options', value => {
    options = JSON.parse(value.options)
  })
  chrome.tabs.sendMessage(currentTab.id, "", async (res) => {
    const pattern = new RegExp('/<img.*?src\s*=\s*[\"|\'](.*?)[\"|\'].*?>/i')
    const imgTag = res.value.match(pattern)
    if (!imgTag) return
    const url = imgTag[1]
    const imageBlob = await getImage(url)
    compressSave(imageBlob, url)
  })
})

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

async function getImage(url: string) {
  const uri = await getImageUrl(url)
  const res = await fetch(uri)
  const blob = await res.blob()
  return blob
}

async function getImageUrl(url: string) {
  const pattern = new RegExp(/http(s)?:|\/\//)
  if (pattern.test(url)) return url
  const currentTab = await getCurrentTab()
  return `${currentTab.url}${url}`
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
