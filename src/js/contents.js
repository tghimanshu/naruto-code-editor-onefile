const { remote } = require("electron");
const { dialog } = remote;
const ipcRenderer = require("electron").ipcRenderer;
const fs = require("fs");
const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  lineNumbers: true,
  mode: "",
  styleActiveLine: true,
  matchBrackets: true,
  theme: "blackboard",
  lineWrapping: "wrap",
  autoComplete: true,
  foldGutters: true,
  scrollbarStyle: "overlay",
  autoCloseBrackets: true,
  autoCloseTags: true,
});


CodeMirror.modeURL = "editor/mode/%N/%N.js";
editor.setSize(
  "100%",
  document.getElementsByClassName("code-editor")[0].clientHeight
);
