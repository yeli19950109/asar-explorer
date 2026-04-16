<div align="center">
  <br><img width="250" src="logo.png" alt="asar-explorer"><br>
</div>

<p align="center">
  <em>Now you can snoop through all the electron apps</em>
</p>

<p align="center">
  <img width="720" src="workflow.gif">
</p>

---

#### [Download for macOS, Windows, or Linux](https://github.com/SimulatedGREG/asar-explorer/releases)

This project is still in development, but most core functionality is ready to use.

##### Build Setup

```bash
# install dependencies
npm install

# dev (Electron + Vite HMR)
npm start

# output unpacked app under ./out/
npm run package

# platform installers / archives (see forge.config.cjs makers)
npm run make
```

---

The app is built with [Electron Forge](https://www.electronforge.io/) and the [@electron-forge/plugin-vite](https://www.electronforge.io/config/plugins/vite) integration.
