const getExtension = (filePath) => {
  let mainFile = filePath.split("\\").pop();
  let ext = mainFile.split(".").pop();
  return ext;
};

const getMode = (extension) => {
  let modeInfo = CodeMirror.findModeByExtension(extension);
  console.log(modeInfo);
  return modeInfo;
};

let openFileBtn = document.getElementById("openFile");
let saveFileBtn = document.getElementById("saveFile");

const loadedFile = {
  filePath: "",
  extension: "",
  mode: "",
  languageName:'',
  mime: "",
  changed: false,
  saved: true,
};

/***********************************
            Opening File
***********************************/

const openFileInEditor = (file) => {
  console.log(file.filePaths[0]);
  let ext = getExtension(file.filePaths[0]);
  let modeInfo = getMode(ext);
  let mode = modeInfo.mode;
  let mime = modeInfo.mime;
  let languageName = modeInfo.name;
  loadedFile.filePath = file.filePaths[0];
  loadedFile.extension = ext;
  loadedFile.mode = mode;
  loadedFile.mime = mime;
  loadedFile.languageName = languageName;
  fs.readFile(file.filePaths[0], (err, content) => {
    // editorrrrrr
    editor.setValue(content.toString());
    editor.setOption("mode", loadedFile.mime);
    CodeMirror.autoLoadMode(editor, loadedFile.mode)
    console.log('added mode '+ loadedFile.mode+loadedFile.languageName);
    // editor.setOption("theme", "blackboard");
    document.getElementsByClassName("CodeMirror")[0].style.visibility =
      "visible";
    document.getElementsByClassName("language")[0].innerHTML = loadedFile.languageName;
    document.getElementsByClassName("saved")[0].innerHTML = editor.lineCount();
    // console.log(loadedFile);
  });
};

const openFile = (e) => {
  let openFile = dialog
    .showOpenDialog({
      properties: ["openFile"],
    })
    .then(openFileInEditor);
};

/***********************************
            Saving File
***********************************/

const saveFile = (e) => {
  if (loadedFile.filePath !== '') {
    if (loadedFile.changed === true && loadedFile.saved === false) {
      fs.writeFile(loadedFile.filePath, editor.getValue(), (err, data) => {
        alert("Doc Saved!");
        loadedFile.changed = false;
        loadedFile.saved = true;
        document.getElementsByClassName("saved").innerHTML = "Saved";
      });
    }
  } else {
    dialog.showSaveDialog({
      title: 'Save As'
    })
      .then(file => {
        console.log(file);
        fs.writeFile(file.filePath, editor.getValue(), () => {
          console.log('saved to: ' + file.filePath);
          loadedFile.filePath = file.filePath;
          loadedFile.extension = getExtension(file.filePath);
          loadedFile.mode = getMode(loadedFile.extension);
          loadedFile.saved = true;
          loadedFile.changed = false;
          document.getElementsByClassName('saved')[0].innerHTML = 'Saved';
          document.getElementsByClassName('language')[0].innerHTML = loadedFile.mode;
          console.log(loadedFile);
          editor.setOption('mode', loadedFile.mode)
        })
      })
  }
};


