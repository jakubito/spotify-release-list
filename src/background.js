/* global chrome */
import { wrapStore } from 'webext-redux';
import { hydrate, store } from './store';

wrapStore(store);

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.extension.getURL('index.html') });
});

chrome.runtime.onMessage.addListener((message, _, respond) => {
  if (message.type == 'READY') {
    hydrate.then(respond);
  }
});
