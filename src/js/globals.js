const { remote } = require("electron");
const { dialog } = remote;
const ipcRenderer = require("electron").ipcRenderer;
const fs = require("fs");
const path = require("path");

const activeFiles = [];

// let activeFile = {
//   editorId: id,
//   fileId: id.slice(7),
//   filePath: document.getElementById(id.slice(7)).getAttribute("data-path"),
//   active: true,
//   saved: true,
//   changed: false,
// };

const getActiveFile = () => {
  return activeFiles.find((file) => file.active === true);
};

const getActiveFileIndex = (id) => {
  return activeFiles.findIndex((file) => file.editorId === id);
};

$(".left-panel").resizable({
  handles: "e",
  minWidth: 150,
});

const leftPanelHeight = document.getElementsByClassName("left-panel")[0]
  .clientHeight;

const openedFolderHeight =
  leftPanelHeight -
  document.getElementById("active-files").clientHeight -
  document.getElementById("explorer-options").clientHeight;
