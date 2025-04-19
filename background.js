const DEFAULT_INACTIVITY_MINUTES = 30;

function isGenuineExternalURL(url) {
    try {
        const parsed = new URL(url);

        // Reject browser-internal protocols
        const invalidProtocols = ["chrome:", "about:", "edge:", "file:"];
        if (invalidProtocols.includes(parsed.protocol)) {
            return false;
        }

        // Reject localhost URLs
        const localHostnames = ["localhost", "127.0.0.1", "[::1]"];
        if (localHostnames.includes(parsed.hostname)) {
            return false;
        }

        return true; // Passed all checks — it's a genuine external URL
    } catch (e) {
        return false; // Invalid URL
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("checkTabs", { periodInMinutes: 5 });
    chrome.storage.local.set({
        inactivityMinutes: DEFAULT_INACTIVITY_MINUTES,
        whitelist: [],
        pausedTabs: [],
        extensionEnabled: true,
    });

    chrome.tabs.query({}, (tabs) => {
        const now = Date.now();
        const updates = {};
        tabs.forEach((tab) => {
            updates["tab-" + tab.id] = now;
        });
        chrome.storage.local.set(updates);
    });
});

chrome.tabs.onCreated.addListener((tab) => {
    chrome.storage.local.set({ ["tab-" + tab.id]: Date.now() });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.storage.local.set({ ["tab-" + activeInfo.tabId]: Date.now() });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && changeInfo.status === "complete") {
        chrome.storage.local.set({ ["tab-" + tabId]: Date.now() });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkTabs") {
        chrome.storage.local.get(
            [
                "extensionEnabled",
                "inactivityMinutes",
                "whitelist",
                "pausedTabs",
            ],
            (config) => {
                if (config.extensionEnabled === false) return;

                const limit =
                    config.inactivityMinutes || DEFAULT_INACTIVITY_MINUTES;
                const whitelist = config.whitelist || [];
                const pausedTabs = config.pausedTabs || [];

                chrome.tabs.query({}, (tabs) => {
                    const now = Date.now();
                    tabs.forEach((tab) => {
                        if (pausedTabs.includes(tab.id)) return;
                        if (
                            tab.url.startsWith(
                                chrome.runtime.getURL("suspended.html")
                            ) ||
                            !isGenuineExternalURL(tab.url)
                        )
                            return;

                        try {
                            const urlObj = new URL(tab.url);

                            if (whitelist.includes(urlObj.hostname)) return;
                        } catch (e) {
                            return; // ignore invalid URLs
                        }

                        const key = "tab-" + tab.id;
                        chrome.storage.local.get([key], (result) => {
                            const lastActive = result[key];
                            if (
                                !tab.active &&
                                lastActive &&
                                now - lastActive > limit * 60 * 1000
                            ) {
                                const suspendedTime = new Date().toISOString();
                                const suspendedUrl =
                                    chrome.runtime.getURL("suspended.html") +
                                    "?url=" +
                                    encodeURIComponent(tab.url) +
                                    "&title=" +
                                    encodeURIComponent(tab.title || "") +
                                    "&time=" +
                                    encodeURIComponent(suspendedTime);
                                chrome.tabs.update(tab.id, {
                                    url: suspendedUrl,
                                });
                            }
                        });
                    });
                });
            }
        );
    }
});
