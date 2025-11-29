/**
 * @fileoverview Preload script for the renderer process.
 * This file allows exposure of Node.js APIs to the renderer process
 * in a secure manner. Currently commented out but retained for future use.
 */

// // All of the Node.js APIs are available in the preload process.
// // It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }
// })
