/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable no-console */

Object.assign(process.env, { NODE_ENV: 'development' })

try {
  const electronDebug = require('electron-debug')
  const runDebug = typeof electronDebug === 'function' ? electronDebug : electronDebug.default
  if (typeof runDebug === 'function') {
    runDebug({ showDevTools: true })
  }
} catch (err) {
  console.warn('[dev] electron-debug skipped:', err.message)
}

require('./index')
