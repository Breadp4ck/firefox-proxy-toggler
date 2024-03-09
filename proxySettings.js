class AddonProxySettings {
  http = "";
  httpPort = 0;
  httpForHttps = false;
  https = "";
  httpsPort = 0;
  socks = "";
  socksPort = 0;
  socksVersion = 5;

  #toBrowserProxySettings() {
    var settings = { proxyType: "system" };

    // Setup HTTP
    if (this.http != "") {
      if (this.httpPort != 0) { settings.http = this.http + ":" + this.httpPort; }
      else { settings.http = this.http; }
    }

    // Setup HTTPS
    if (this.httpForHttps && settings.http) {
      settings.ssl = settings.http;
    } else if (this.https != "") {
      if (this.httpsPort != 0) { settings.ssl = this.https + ":" + this.httpsPort; }
      else { settings.ssl = this.https; }
    }

    // Setup SOCKS
    if (this.socks != "") {
      if (this.socksPort != 0) { settings.socks = this.socks + ":" + this.socksPort; }
      else { settings.socks = this.socks; }

      settings.socksVersion = this.socksVersion;
    }

    return settings;
  }

  static load() {
    var settings = new AddonProxySettings();
    return browser.storage.local.get("proxySettings")
      .then((item) => {
        return item.proxySettings;
      })
      .catch((error) => {
        console.error("Error loading proxy settings from storage:", error);
        return null;
      });
  }

  upload() {
    var cache = this.#toBrowserProxySettings();

    browser.storage.local.set({ proxySettings: this })
    browser.storage.local.set({ cacheProxySettings: cache })
  }
}
