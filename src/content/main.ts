let clickedEl: HTMLElement | null

document.addEventListener('contextmenu', event => {
  clickedEl = event.target as HTMLElement
}, true)

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (!clickedEl) return
  sendResponse({ value: clickedEl.outerHTML })
  return true
})
