import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Emeris } from './lib/Emeris';
import EmerisStorage, { EmerisStorageMode } from './lib/EmerisStorage';

const storage = new EmerisStorage(EmerisStorageMode.LOCAL);
const emeris = new Emeris(storage);


const pageHandler = async (request) => {
  if (request.id) {
    if (request.action == 'init') {
      try {
        await emeris.init();
        return { id: request.id, data: true };
      } catch (e) {
        return { id: request.id, data: false };
      }
    }
    if (!emeris.loaded) {
      return { id: request.id, data: false };
    }
    return { id: request.id, data: await emeris[request.action](request.data) };
  }
};
const messageHandler = async (request) => {
  await emeris.init();
  if (request.type == 'fromPopup') {
    return await emeris.popupHandler(request);
  }
  return await pageHandler(request);
};
browser.runtime.onMessage.addListener(messageHandler);
