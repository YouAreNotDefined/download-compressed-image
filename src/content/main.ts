let clickedEl: HTMLElement | null

document.addEventListener("contextmenu", event => {
  clickedEl = event.target as HTMLElement
}, true)

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req === "getClickedEl") {
    if (!clickedEl) return
    sendResponse({ value: clickedEl.outerHTML })
  } else {
    chrome.runtime.sendMessage(req, () => true)
  }
  return true
})
