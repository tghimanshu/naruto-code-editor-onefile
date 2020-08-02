$(window).bind("keydown", (e) => {
  // console.log(e.ctrlKey);
  if (e.ctrlKey) {
    // console.log(String.fromCharCode(e.which).toLowerCase());
    let key = String.fromCharCode(e.which).toLowerCase();
    switch (key) {
      case "n":
        NewFile();
        return;
      case "o":
        openFile(e);
        return;
      case "s":
        console.log("saveFile");
        saveFile(e);
        return;
      default:
        return;
    }
  }
});
