import { Emeris } from './lib/Emeris';
import EmerisStorage, { EmerisStorageMode } from './lib/EmerisStorage';
import browser from 'webextension-polyfill';
declare let self: ServiceWorkerGlobalScope;

const storage = new EmerisStorage(EmerisStorageMode.LOCAL);
const emeris = new Emeris(storage);

const pageHandler = async (request) => {
  await emeris.isInitialized();
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

const messageHandler = async (request) => {
  await emeris.isInitialized();
  if (request.type == 'fromPopup') {
    const result = await emeris.popupHandler(request);
    return result;
  }
  return await pageHandler(request);
};
browser.runtime.onMessage.addListener(messageHandler);
