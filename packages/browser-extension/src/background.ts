import { Emeris } from './lib/Emeris';
import EmerisStorage, { EmerisStorageMode } from './lib/EmerisStorage';

const storage = new EmerisStorage(EmerisStorageMode.LOCAL);
const emeris = new Emeris(storage);

const pageHandler = async (request) => {
  if (request.id) {
    if (!emeris.loaded) {
      return { id: request.id, data: false };
    }
    if (request.action !== 'enable' && (await emeris.isPermitted(request.origin)) === false) {
      return { id: request.id, data: false };
    }
    return { id: request.id, data: await emeris[request.action](request) };
  }
};
const messageHandler = (request, sender, sendResponse) => {
  if (request.type == 'fromPopup') {
    emeris.popupHandler(request).then(sendResponse)
  } else {
    pageHandler(request).then(sendResponse)
  }
  return true;
};
chrome.runtime.onMessage.addListener(messageHandler);
