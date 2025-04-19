
const timeoutInput = document.getElementById('timeout');
const whitelistInput = document.getElementById('whitelistInput');
const whitelistUl = document.getElementById('whitelist');
const addBtn = document.getElementById('addBtn');
const pauseToggle = document.getElementById('pauseToggle');

chrome.storage.local.get(['inactivityMinutes', 'whitelist'], (data) => {
  timeoutInput.value = data.inactivityMinutes || 60;
  renderWhitelist(data.whitelist || []);
});

timeoutInput.addEventListener('change', () => {
  chrome.storage.local.set({ inactivityMinutes: parseInt(timeoutInput.value, 10) });
});

addBtn.addEventListener('click', () => {
  const host = whitelistInput.value.trim();
  if (!host) return;
  chrome.storage.local.get(['whitelist'], (data) => {
    const list = data.whitelist || [];
    if (!list.includes(host)) {
      list.push(host);
      chrome.storage.local.set({ whitelist: list }, () => {
        whitelistInput.value = '';
        renderWhitelist(list);
      });
    }
  });
});

function renderWhitelist(list) {
  whitelistUl.innerHTML = '';
  list.forEach((host, index) => {
    const li = document.createElement('li');
    li.textContent = host;
    const span = document.createElement('span');
    span.textContent = 'x';
    span.className = 'remove';
    span.addEventListener('click', () => {
      list.splice(index, 1);
      chrome.storage.local.set({ whitelist: list }, () => {
        renderWhitelist(list);
      });
    });
    li.appendChild(span);
    whitelistUl.appendChild(li);
  });
}

// Pause toggle logic
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTabId = tabs[0].id;
  chrome.storage.local.get(['pausedTabs'], (data) => {
    const pausedTabs = data.pausedTabs || [];
    pauseToggle.checked = pausedTabs.includes(currentTabId);
  });

  pauseToggle.addEventListener('change', () => {
    chrome.storage.local.get(['pausedTabs'], (data) => {
      let pausedTabs = data.pausedTabs || [];
      if (pauseToggle.checked) {
        if (!pausedTabs.includes(currentTabId)) pausedTabs.push(currentTabId);
      } else {
        pausedTabs = pausedTabs.filter(id => id !== currentTabId);
      }
      chrome.storage.local.set({ pausedTabs });
    });
  });
});

// Global toggle logic
const globalToggle = document.getElementById('globalToggle');

chrome.storage.local.get(['extensionEnabled'], (data) => {
  globalToggle.checked = data.extensionEnabled !== false;
});

globalToggle.addEventListener('change', () => {
  chrome.storage.local.set({ extensionEnabled: globalToggle.checked });
});
