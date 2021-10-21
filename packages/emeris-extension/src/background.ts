import EmerisStorage from './lib/EmerisStorage';

const storage = new EmerisStorage();
let wallet;
let popup = null;
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
    } catch (e) {
      popup = await launchPopup();
    }

    await browser.windows.update(popup as number, {
      focused: true,
    });
  }
}

const messageHandler = async (request, sender) => {
  console.log(request);
  console.log(sender);
  if (request.id) {
    return { id: request.id };
  }
};
browser.runtime.onMessage.addListener(messageHandler);
