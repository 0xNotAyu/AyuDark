# 🌙 AyuDark

> A beautiful, lightweight dark mode for Medium.

AyuDark brings a comfortable dark reading experience to **Medium**, covering the entire Medium experience — from articles and feeds to profiles, settings, search, lists, notifications, and the editor.

Built with **Manifest V3**, AyuDark is designed to work seamlessly with Medium's single-page navigation, so your theme stays active as you browse without needing to refresh the page.

## ✨ Features

* 🌑 **Site-wide dark mode** — not just article pages
* 🖥️ **System mode** — automatically follows your device's light/dark preference
* 🌙 **Always On / Off** — manually control when dark mode is active
* 🎨 **Multiple themes**

  * Dark Gray
  * OLED Black
  * Claude
  * Custom
* 🖌️ **Custom themes** — choose your own background, text, and accent colors
* ⚡ **Lightweight** — designed to stay out of your way
* 🔄 **SPA support** — works while navigating Medium without refreshing
* 💾 **Persistent settings** — your preferences stay saved
* 🖼️ **Images stay natural** — article images and photos aren't inverted

---

## 🎨 Themes

### Dark Gray

A comfortable dark gray theme designed for everyday reading and long sessions.

### OLED Black

A true-black theme designed for OLED displays and users who prefer maximum contrast.

### Claude

A warm, soft dark theme inspired by the visual feel of Claude, with warm backgrounds, cream-colored text, and subtle accent colors.

### Custom

Create your own look with custom background, text, and accent colors.

---

## 🌐 Supported Browsers

AyuDark supports modern Chromium-based browsers:

* Google Chrome
* Brave
* Microsoft Edge
* Opera
* Vivaldi
* Arc

AyuDark uses **Manifest V3** and does not depend on Chrome-only APIs.

---

## 📍 Works Across Medium

AyuDark is designed to keep Medium dark wherever you go.

### Supported pages

* 🏠 Home feed
* 📖 Article pages
* ✍️ Write / Editor
* 👤 Profiles
* 👥 Followers / Following
* ⚙️ Settings
* 🔔 Notifications
* 📊 Stats / Dashboard
* 🔎 Search
* 📰 Publication pages
* 💬 Responses and comments
* 📚 Lists

Whether you're reading an article or browsing your Medium dashboard, AyuDark keeps the experience consistent.

---

## ⚙️ How It Works

Medium is a single-page application, so navigating between pages doesn't always trigger a complete page reload.

AyuDark handles this by monitoring page and navigation changes and automatically applying the selected theme whenever new content appears.

The extension uses:

* CSS custom properties for theme colors
* Content scripts for page styling
* Mutation observers for dynamically loaded content
* History API navigation detection
* Browser storage for preferences

The result is a dark theme that follows you as you browse.

---

## 🔐 Privacy

AyuDark is built with privacy in mind.

* No Medium login or account access is required.
* No passwords or credentials are collected.
* No browsing history is sent to a server.
* Theme preferences are stored using browser storage.
* The core extension does not require analytics or tracking.

AyuDark only needs access to Medium pages in order to apply its theme.

---

## 🐛 Found a Bug?

Medium's interface changes frequently. If something doesn't look right, I'd love to know about it.

When reporting an issue, please include:

1. The Medium page where the problem occurred
2. Your browser
3. Your selected AyuDark theme
4. A screenshot, if possible
5. Steps to reproduce the issue

### Report an issue

🐙 **GitHub Issues:**
https://github.com/YOUR_USERNAME/ayudark/issues

---

## 💬 Feedback & Contact

Have a feature request, found something weird, or just want to share feedback?

I'd love to hear from you.

📸 **Instagram:**
https://instagram.com/0xnotayu

𝕏 **X / Twitter:**
https://x.com/0xNotAyu

🐙 **GitHub:**
https://github.com/0xNotAyu/ayudark

Feel free to reach out — feedback helps make AyuDark better.

---

## 📥 Installation

### Chrome Web Store

Install AyuDark from the Chrome Web Store:

**[Install AyuDark](YOUR_CHROME_WEB_STORE_URL)**

### Manual Installation

If you'd rather install the extension manually:

1. Download or clone this repository.
2. Open your browser's extension management page.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Select the AyuDark directory.
6. Open Medium and start reading.

---

## 🛠️ Built With

* **HTML**
* **CSS**
* **TypeScript / JavaScript**
* **Manifest V3**
* **Chrome Extension APIs**

No heavy framework is required for the core extension.

---

## 🤝 Contributing

AyuDark is open source, and contributions are welcome.

If you have an improvement or bug fix:

1. Fork the repository.
2. Create a branch.

```bash
git checkout -b feature/my-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "feat: improve dark mode"
```

5. Push your branch.

```bash
git push origin feature/my-feature
```

6. Open a Pull Request.

For larger changes, opening an issue first is recommended so we can discuss the idea.

---

## 📄 License

AyuDark is open source and released under the **MIT License**.

See [LICENSE](LICENSE) for details.

---

## ⭐ Like AyuDark?

If AyuDark makes your Medium reading experience better, consider giving the project a ⭐ on GitHub.

It helps other people discover the project and supports continued development.

---

<p align="center">
  🌙 Made for better Medium reading.
</p>
