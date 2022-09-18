chrome.windows.onRemoved.addListener(() => {
  chrome.storage.local.clear()
})
