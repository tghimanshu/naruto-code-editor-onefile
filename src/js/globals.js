/**
 * @fileoverview Defines global variables and utility functions used throughout the application.
 * Includes module imports, state management for active files, and UI initialization for the left panel.
 */

const { remote } = require("electron");
const { dialog } = remote;
const ipcRenderer = require("electron").ipcRenderer;
const fs = require("fs");
const path = require("path");

/**
 * Array to store the state of currently active (open) files.
 * Each element is an object representing a file's state.
 * @type {Array<Object>}
 */
const activeFiles = [];

// let activeFile = {
//   editorId: id,
//   fileId: id.slice(7),
//   filePath: document.getElementById(id.slice(7)).getAttribute("data-path"),
//   active: true,
//   saved: true,
//   changed: false,
// };

/**
 * Retrieves the currently active file object from the `activeFiles` array.
 *
 * @function getActiveFile
 * @returns {Object|undefined} The active file object, or undefined if no file is active.
 */
const getActiveFile = () => {
  return activeFiles.find((file) => file.active === true);
};

/**
 * Retrieves the index of a file in the `activeFiles` array based on its editor ID.
 *
 * @function getActiveFileIndex
 * @param {string} id - The editor ID of the file to find.
 * @returns {number} The index of the file in the `activeFiles` array, or -1 if not found.
 */
const getActiveFileIndex = (id) => {
  return activeFiles.findIndex((file) => file.editorId === id);
};

// Initialize resizable left panel using jQuery UI
$(".left-panel").resizable({
  handles: "e",
  minWidth: 150,
});

/**
 * The initial client height of the left panel.
 * @type {number}
 */
const leftPanelHeight = document.getElementsByClassName("left-panel")[0]
  .clientHeight;

/**
 * Calculated height for the opened folder view, based on left panel height and other elements.
 * @type {number}
 */
const openedFolderHeight =
  leftPanelHeight -
  document.getElementById("active-files").clientHeight -
  document.getElementById("explorer-options").clientHeight;
