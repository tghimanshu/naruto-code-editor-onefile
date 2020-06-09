openFileBtn.addEventListener("click", openFile);

editor.on("change", (e) => {
  // console.log(e);
  loadedFile.changed = true;
  loadedFile.saved = false;
  // document.getElementsByClassName("saved")[0].innerHTML = editor.lineCount();
  // console.log(loadedFile);
});

saveFileBtn.addEventListener("click", saveFile);
