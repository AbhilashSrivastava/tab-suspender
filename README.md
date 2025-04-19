
# Tab Suspender Chrome Extension 🚀

A lightweight Chrome extension that automatically suspends inactive tabs to save memory and system resources — inspired by *The Great Suspender*. Built with performance, customizability, and user control in mind.

---

## 🧠 How It Works

- The extension monitors all open tabs.
- If a tab has been **inactive for a configurable time** (default: 60 minutes), it will be suspended.
- A **beautiful suspended page** replaces the tab, showing:
  - Page title
  - Original URL
  - Time of suspension
  - Button to restore the tab instantly

---

## ✨ Features

- ✅ Auto-suspends tabs after inactivity
- ✅ Suspend timeout is configurable via popup
- ✅ Whitelist specific domains (e.g., `www.youtube.com`, `www.gmail.com`)
- ✅ Per-tab suspension toggle (pause suspension for specific tabs)
- ✅ Global ON/OFF toggle for the entire plugin
- ✅ Never re-suspends a tab that's already suspended
- ✅ Safe and clean with Chrome Manifest V3 compliance (no inline scripts)

---

## 📦 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/abhilashsrivastava/tab-suspender.git
cd tab-suspender
```

### 2. Load Extension in Chrome

1. Open Chrome and navigate to: `chrome://extensions`
2. Enable **Developer Mode** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the folder where this repo was cloned

Done ✅

---

## ⚙️ Usage Guide

Click the Tab Suspender extension icon (top-right in Chrome) to open the settings popup.

### Available Controls:
- ⏲️ **Suspension Timeout**: Set the idle duration before a tab is auto-suspended
- 🧾 **Whitelist**: Add domains you don’t want suspended
- 🛑 **Pause Suspension (per tab)**: Disable auto-suspension for the current tab
- 🧯 **Global Toggle**: Enable or disable the plugin entirely

---

## 🔄 Suspended Tab UI

When a tab is suspended, it shows a friendly page with:
- The title of the original page
- The original URL
- Timestamp of suspension
- A button to **Reload Tab** and restore the session

---

## 🧠 Why Use This?

- Free up memory from inactive tabs
- Prevent Chrome slowdown from heavy tab usage
- Fully customizable and privacy-friendly (all local, no external APIs)

---

## 🛠 Development Notes

- Manifest Version: **v3**
- Scripts are all separated from HTML (CSP-compliant)
- Uses:
  - `chrome.tabs` API
  - `chrome.storage.local` for settings
  - `chrome.alarms` for periodic checks
  - `chrome.scripting` & `URL` APIs

---

## 👨‍💻 Made By

**Abhilash Srivastava**  
GitHub: [@abhilashsrivastava](https://github.com/abhilashsrivastava)  

---

## 📄 License

MIT License
