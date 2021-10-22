import { Emeris } from './lib/Emeris';
import EmerisStorage from './lib/EmerisStorage';

const storage = new EmerisStorage();
const emeris = new Emeris(storage);
async function init() {

}
let popup = null;

const queuedRequests = new Map();
const pending = [];

async function launchPopup() {
  return (
    await browser.windows.create({ width: 400, height: 600, type: 'popup', url: browser.runtime.getURL('/popup.html') })
  ).id;
}
async function ensurePopup() {
  if (!popup) {
    popup = await launchPopup();
    browser.windows.update(popup as number, {
      focused: true,
    });
  } else {
    try {
      await browser.windows.get(popup as number);
      browser.runtime.sendMessage({ type: 'toPopup', data: { action: 'update' } });
    } catch (e) {
      popup = await launchPopup();
    }

    await browser.windows.update(popup as number, {
      focused: true,
    });
  }
}

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
    /*
    let resolver;
    const response = new Promise((resolve) => {
      resolver = resolve;
    });
    queuedRequests.set(request.id, { resolver });
    pending.push(request);
    ensurePopup();
    const resp = await response;
    console.log(resp);
    return resp;
    */
  }
};
const popupHandler = async (message) => {
  let request;
  switch (message?.data.action) {
    case 'getPending':
      return pending.splice(0);

    case 'setResponse':
      request = queuedRequests.get(message.data.data.id);
      console.log(request);
      if (!request) {
        return;
      }
      request.resolver(message.data.data);
      queuedRequests.delete(message.data.data.id);
      return true;
  }
};
const messageHandler = async (request) => {
  console.log(request);

  if (request.type == 'fromPopup') {
    return await popupHandler(request);
  }
  return await pageHandler(request);
};
browser.runtime.onMessage.addListener(messageHandler);
