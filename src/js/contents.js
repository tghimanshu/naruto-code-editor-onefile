const { remote } = require("electron");
const { dialog } = remote;
const ipcRenderer = require("electron").ipcRenderer;
const fs = require("fs");
const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  lineNumbers: true,
  mode: "",
  styleActiveLine: true,
  matchBrackets: true,
  theme: "dracula",
  lineWrapping: "wrap",
  autoComplete: true,
  foldGutters: true,
  scrollbarStyle: "overlay",
});
editor.setSize(
  "100%",
  document.getElementsByClassName("code-editor")[0].clientHeight
);
