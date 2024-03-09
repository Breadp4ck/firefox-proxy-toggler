browser.action.onClicked.addListener(toggle);

function toggle() {
  loadCachedProxySettings().then(settings => {
    if (settings) {
      if (settings.proxyType == "manual") {
        settings.proxyType = "system";
      } else if (settings.proxyType == "system") {
        settings.proxyType = "manual";
      }
      updateBrowserProxySettings(settings);

    } else {
      console.log("Proxy settings are not setup.");
      browser.runtime.openOptionsPage();
    }
  });
}

function loadCachedProxySettings() {
  return browser.storage.local.get("cacheProxySettings")
    .then((item) => { return item.cacheProxySettings; })
    .catch((error) => {
      console.error("Error loading proxy settings from storage:", error);
      return null;
    });
}

function updateBrowserProxySettings(settings) {
  browser.proxy.settings.set({ value: settings });
  browser.storage.local.set({ cacheProxySettings: settings })
}
