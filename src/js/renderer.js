openFile.addEventListener("click", (e) => {
  let openFile = dialog
    .showOpenDialog({
      properties: ["openFile"],
    })
    .then(openFileInEditor);
});

editor.on("change", (e) => {
  // console.log(e);
  loadedFile.changed = true;
  loadedFile.saved = false;
  // document.getElementsByClassName("saved")[0].innerHTML = editor.lineCount();
  // console.log(loadedFile);
});

saveFile.addEventListener("click", (e) => {
  if (loadedFile.changed === true && loadedFile.saved === false) {
    fs.writeFile(loadedFile.filePath, editor.getValue(), (err, data) => {
      alert("Doc Saved!");
      loadedFile.changed = false;
      loadedFile.saved = true;
      document.getElementsByClassName("saved").innerHTML = "Saved";
    });
  }
});
