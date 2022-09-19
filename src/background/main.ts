import { defaultConfig, Config } from '../type/type'
import path from 'path'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
// @ts-ignore
import { ImagePool } from '@squoosh/lib' // No types

let config: Config
const imagePool = new ImagePool()

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 'config': JSON.stringify(defaultConfig) })
  chrome.contextMenus.create({
    id: 'download',
    title: '圧縮ダウンロード'
  })
})

chrome.contextMenus.onClicked.addListener(async (item) => {
  const currentTabId = await getCurrentTabId()
  if (!currentTabId) return
  chrome.storage.local.get("config", (value) => {
    config = JSON.parse(value.config)
  })
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id!, "", res => {
      const pattern = new RegExp('/<img.*?src\s*=\s*[\"|\'](.*?)[\"|\'].*?>/i')
      const imgTag = res.value.match(pattern)
      if (!imgTag) return
      const src = imgTag[1]
      const { name, image } = getImage(src)
      const encodeOptions: {
        mozjpeg?: { quality: Number }
        oxipng?: { quality: Number }
        webp?: { quality: Number }
      } = {}
      if (config.resize.enabled) {
        // @ts-ignore
        (async () => {
          await image.preprocess({ rezize: config.resize })
        })()
      }
      (async () => {
        encodeOptions[config.format] = { quality: config.quality }
        // @ts-ignore
        await image.encode(encodeOptions)
        download(image, name)
        // @ts-ignore
        await imagePool.close()
      })()
    })
  })
})

async function getCurrentTabId() {
  const queryOptions = { active: true, lastFocusedWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab.id
}

function desktopDir() {
  const home = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"]
  return path.join(home!, "Desktop")
}

function download(image: any, name: string) {
  let data!: Uint8Array
  (async () => {
    // @ts-ignore
    if (image.encodedWith.mozjpeg) data = await image.encodedWith.mozjpeg.binary
    // @ts-ignore
    if (image.encodedWith.oxipng) data = await image.encodedWith.oxipng.binary
    // @ts-ignore
    if (image.encodedWith.webp) data = await image.encodedWith.webp.binary
  })()

  const OUTPUTDIR = `${desktopDir}/download-compressed-image`
  if (!existsSync(OUTPUTDIR)) mkdirSync(OUTPUTDIR)

  writeFileSync(`${OUTPUTDIR}/${name}`, data)
}

function getImage(url: string) {
  const file = readFileSync(url)
  const pattern = new RegExp('.+/(.+?)\.[a-z]+([\?#;].*)?$')
  const fileName = url.match(pattern)![1]
  const image = imagePool.ingestImage(file)
  return { name: fileName, image }
}
