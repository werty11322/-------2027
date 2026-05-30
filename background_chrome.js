// background_chrome.js — Service Worker для Chrome
// В Chrome Manifest V3 используется service_worker вместо background scripts

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('popup.html')
    });
});
