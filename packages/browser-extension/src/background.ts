import { Emeris } from './lib/Emeris';
import EmerisStorage, { EmerisStorageMode } from './lib/EmerisStorage';

const storage = new EmerisStorage(EmerisStorageMode.LOCAL);
const emeris = new Emeris(storage);

const pageHandler = async (request) => {
  if (request.id) {
    if (!emeris.loaded) {
      return { id: request.id, data: false };
    }
    if (request.action !== 'enable' && (await emeris.isPermitted(request.data.origin)) === false) {
      return { id: request.id, data: false };
    }
    return { id: request.id, data: await emeris[request.action](request) };
  }
};
const messageHandler = async (request) => {
  if (request.type == 'fromPopup') {
    const result = await emeris.popupHandler(request);
    return result
  }
  return await pageHandler(request);
};
browser.runtime.onMessage.addListener(messageHandler);
