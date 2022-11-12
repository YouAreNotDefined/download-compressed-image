import { defaultOptions } from "../common"

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 'options': JSON.stringify(defaultOptions) })
  chrome.contextMenus.create({
    id: 'compressed-download',
    title: 'Compressed Download',
    contexts: ['image']
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'compressed-download') return
  if (!info.srcUrl || (!tab || !tab.id)) return
  const message = JSON.stringify({ info })
  const port = chrome.tabs.connect(tab.id)
  port.postMessage(message)
})
