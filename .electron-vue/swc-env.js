'use strict'

/**
 * SWC options per webpack target (main / electron-renderer / web).
 * Output stays ESM for webpack; final bundle shape comes from webpack `output`.
 */
function getSwcLoaderOptions (env) {
  const dev = process.env.NODE_ENV !== 'production'

  const parser = {
    syntax: 'ecmascript',
    jsx: true,
    dynamicImport: true,
    topLevelAwait: true,
    importMeta: true,
    exportNamespaceFrom: true,
    exportDefaultFrom: true
  }

  /** Electron 41 + current browsers: modern syntax, light downlevel if needed */
  const target =
    env === 'web'
      ? 'es2020'
      : 'es2022'

  return {
    jsc: {
      parser,
      target,
      loose: false,
      externalHelpers: false
    },
    module: {
      type: 'es6',
      strict: false,
      strictMode: true,
      lazy: false,
      noInterop: false
    },
    minify: false,
    sourceMaps: dev,
    inlineSourcesContent: dev
  }
}

module.exports = { getSwcLoaderOptions }
