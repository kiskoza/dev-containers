const CONTAINER_DETAILS = {
  color: "blue",
  icon: "fingerprint"
};

async function setupContainer (request) {
  const name = `[DEV] ${request.email}`;
  const contexts = await browser.contextualIdentities.query({name: name});

  let context = null;
  if (contexts.length > 0) {
    context = contexts[0];
  } else {
    context = await browser.contextualIdentities.create({name: name, ...CONTAINER_DETAILS});
  }

  const [activeTab] = await browser.tabs.query({active: true, lastFocusedWindow: true});
  if (activeTab.cookieStoreId === context.cookieStoreId) {
    return;
  } else {
    const newTab = await browser.tabs.create({
      url: activeTab.url,
      cookieStoreId: context.cookieStoreId,
      active: activeTab.active,
      index: activeTab.index,
      windowId: activeTab.windowId
    });

    browser.tabs.remove(activeTab.id);

    for (i = 0; i < 100 && (false === await browser.tabs.sendMessage(newTab.id, {action: 'ping'}).catch(() => false)); i++){
      await new Promise(r => setTimeout(r, 500));
    }

    await browser.tabs.sendMessage(newTab.id, {action: 'login', ...request});
  }
}

(async function init () {
  async function messageHandler(request, sender) {
    switch (request.message) {
    case 'login':
      await setupContainer(request);
      return 'yay';
    default:
      throw new Error("Unexpected message!");
    }
  }

  browser.runtime.onMessage.addListener(messageHandler);
})();
