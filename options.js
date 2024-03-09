document.addEventListener("DOMContentLoaded", function() {
  var saveButton = document.getElementById("saveButton");

  var httpAddress   = document.getElementById("httpAddress");
  var httpPort      = document.getElementById("httpPort");
  var httpForHttps  = document.getElementById("httpForHttps");
  var httpsAddress  = document.getElementById("httpsAddress");
  var httpsPort     = document.getElementById("httpsPort");
  var socksAddress  = document.getElementById("socksAddress");
  var socksPort     = document.getElementById("socksPort");
  var socksVersion4 = document.getElementById("socksVersion4");
  var socksVersion5 = document.getElementById("socksVersion5");

  // Update css colors
  updateTheme();

  // Load settings from storage and insert them in UI
  AddonProxySettings.load().then(settings => {

    // Insert values, if there are some
    if (settings) {
      console.log("Inserting data...");

      httpAddress.value = settings.http;
      httpPort.value = settings.httpPort;
      httpForHttps.value = settings.httpForHttps;
      httpsAddress.value = settings.https;
      httpsPort.value = settings.httpsPort;
      socksAddress.value = settings.socks;
      socksPort.value = settings.socksPort;
      if (settings.socksVersion == 4) { socksVersion4.checked = true; } else { socksVersion5.checked = true; }

      console.log("Data inserted.");

    // If there are no values, do nothing
    } else { }

  });

  // Disable HTTPS fields, if httpForHttps checkbox is set
  httpForHttps.addEventListener("change", function(event) {
    httpsAddress.disabled = httpForHttps.checked;
    httpsPort.disabled = httpForHttps.checked;
  });

  // Save settings to storage
  saveButton.addEventListener("click", function() {
    var settings = new AddonProxySettings();

    settings.http = httpAddress.value;
    settings.httpPort = parseInt(httpPort.value);
    settings.httpForHttps = httpForHttps.checked;
    settings.https = httpsAddress.value;
    settings.httpsPort = parseInt(httpsPort.value);
    settings.socks = socksAddress.value;
    settings.socksPort = parseInt(socksPort.value);
    if (socksVersion4.checked) { settings.socksVersion = 4; } else { settings.socksVersion = 5; }

    // settings.httpPort = Number.isInteger(parseInt(httpPort.value)) ? parseInt(httpPort.value) : 0;
    // settings.httpsPort = Number.isInteger(parseInt(httpsPort.value)) ? parseInt(httpsPort.value) : 0;
    // settings.socksPort = Number.isInteger(parseInt(socksPort.value)) ? parseInt(socksPort.value) : 0;

    settings.upload();

    // Close tab on save
    browser.tabs.getCurrent().then((tab) => {
      browser.tabs.remove(tab.id);
    });
  });

});

// Adapt colors to browser theme, somehow
browser.theme.onUpdated.addListener(async ({ theme, windowId }) => {
  updateTheme();
});

function updateTheme() {
  browser.theme.getCurrent().then(theme => {
    if (!(theme && theme.colors)) {
      return;
    }

    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.colors.tab_background_text);
    root.style.setProperty('--solid-color', theme.colors.toolbar);
    root.style.setProperty('--fg-main-color', theme.colors.popup_text);
    root.style.setProperty('--fg-secondary-color', theme.colors.toolbar_field_text);
    root.style.setProperty('--fg-input-color', theme.colors.toolbar_field_text_highlight);
    root.style.setProperty('--bg-main-color', theme.colors.frame);
    root.style.setProperty('--bg-panel-color', theme.colors.popup);
    root.style.setProperty('--bg-input-color', theme.colors.toolbar_field);
    if (theme.colors.button) { root.style.setProperty('--bg-button-color', theme.colors.button); }
    if (theme.colors.button_hover) { root.style.setProperty('--bg-button-color_hover', theme.colors.button_active); }
    if (theme.colors.button_active) { root.style.setProperty('--bg-button-color_active', theme.colors.button_hover); }
    root.style.setProperty('--border-color', theme.colors.toolbar_top_separator);
    
  });
}
