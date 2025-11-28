/**
 * @fileoverview Handles window management actions such as minimize, maximize, and close.
 * Uses Electron's remote module to control the current window.
 */

let maximize = document.getElementById("maximize");
let minimize = document.getElementById("minimize");
let close = document.getElementById("close");

/**
 * Toggles the maximize/unmaximize state of the current window.
 */
maximize.addEventListener("click", (e) => {
   remote.getCurrentWindow().isMaximized()
     ? remote.getCurrentWindow().unmaximize()
     : remote.getCurrentWindow().maximize();
  // if(remote.getCurrentWindow().is)
});

/**
 * Minimizes the current window.
 */
minimize.addEventListener("click", (e) => {
  remote.getCurrentWindow().minimize();
});

/**
 * Closes the current window.
 */
close.addEventListener("click", (e) => {
  remote.getCurrentWindow().close();
});
