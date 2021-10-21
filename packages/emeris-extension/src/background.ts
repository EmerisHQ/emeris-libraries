import EmerisStorage from './lib/EmerisStorage';

const storage = new EmerisStorage();
let wallet;
let popup = null;

const queuedRequests = new Map();
const pending = [];
const init = async () => {
  try {
    await storage.loadLocal();
  } catch (e) {
    console.log('No local wallets');
    try {
      await storage.loadSync();
    } catch (e) {
      console.log('No sync wallets');
    }
  } finally {
    wallet = storage.getLastWallet();
  }
};
init();
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

const pageHandler = async(request,sender) => {
  
  if (request.id) {
    let resolver;
    const response = new Promise((resolve) => {
      resolver = resolve;
    });
    queuedRequests.set(request.id, { resolver });
    pending.push(request);
    ensurePopup();
    let resp = await response;
    console.log(resp);
    return resp;
  }
};
const popupHandler = async (message, sender) => {
  console.log(message);
  switch (message?.data.action) {
    case 'getPending':
      return pending.splice(0);
      
    case 'setResponse':
      const request = queuedRequests.get(message.data.data.id);
      console.log(request);
      if (!request) {        
        return;
      }
      request.resolver(message.data.data);
      queuedRequests.delete(message.data.data.id);
      return true;
      
  }
};
const messageHandler = async (request, sender) => {

  console.log(request);
  
  if (request.type == 'fromPopup') {
    return await popupHandler(request, sender);
  }
  return await pageHandler(request, sender);
  
  
};
browser.runtime.onMessage.addListener(messageHandler);
