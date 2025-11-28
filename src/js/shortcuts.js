/**
 * @fileoverview Handles keyboard shortcuts for the application.
 * Binds keydown events to the window to trigger file operations like New, Open, and Save.
 */

$(window).bind("keydown", (e) => {
  // console.log(e.ctrlKey);
  if (e.ctrlKey) {
    // console.log(String.fromCharCode(e.which).toLowerCase());
    let key = String.fromCharCode(e.which).toLowerCase();
    switch (key) {
      case "n":
        /**
         * Ctrl+N: Create a new file.
         */
        NewFile();
        return;
      case "o":
        /**
         * Ctrl+O: Open a file.
         */
        openFile(e);
        return;
      case "s":
        console.log("saveFile");
        /**
         * Ctrl+S: Save the current file.
         */
        saveFile(e);
        return;
      default:
        return;
    }
  }
});
