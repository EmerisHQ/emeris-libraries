import { v4 as uuidv4 } from 'uuid';

import { init } from './init';

const queuedRequests = new Map();

window.addEventListener('message', async (event) => {
  // We only accept messages from ourselves
  if (event.source != window) {
    return;
  }
  // We only deal with messages to the extension
  if (event.data.type != 'fromEmerisExtension') {
    return;
  }
  const request = queuedRequests.get(event.data.data.id);
  if (!request) {
    return;
  }
  request.resolver(event.data.data);
  queuedRequests.delete(event.data.data.id);
});

const emeris = {
  loaded: true,
  sendRequest: async (request: Record<string, unknown>) => {
    const requestId = uuidv4();
    const fullRequest = {
      type: 'toEmerisExtension',
      data: { id: requestId, ...request },
    };
    let resolver;
    const response = new Promise((resolve) => {
      resolver = resolve;
    });
    queuedRequests.set(requestId, { resolver });
    window.postMessage(fullRequest, window.location.origin);
    
    return await response;
  },
};
init(emeris);
