const getExtension = (filePath) => {
  let mainFile = filePath.split("\\").pop();
  let ext = mainFile.split(".").pop();
  return ext;
};

const getMode = (extension) => {
  switch (extension) {
    case "js":
      return "javascript";
    case "py":
      return "python";
    case "dart":
      return "dart";
    case ("html", "htm"):
      return "html";
    case "css":
      return "css";
    case "php":
      return "php";
    default:
      return "javascript";
  }
};

let openFile = document.getElementById("openFile");
let saveFile = document.getElementById("saveFile");

const loadedFile = {
  filePath: "",
  extension: "",
  mode: "",
  changed: false,
  saved: true,
};

const openFileInEditor = (file) => {
  console.log(file.filePaths[0]);
  let ext = getExtension(file.filePaths[0]);
  let mode = getMode(ext);
  loadedFile.filePath = file.filePaths[0];
  loadedFile.extension = ext;
  loadedFile.mode = mode;
  fs.readFile(file.filePaths[0], (err, content) => {
    // editorrrrrr
    editor.setValue(content.toString());
    editor.setOption("mode", loadedFile.mode);
    editor.setOption("theme", "blackboard");
    document.getElementsByClassName("CodeMirror")[0].style.visibility =
      "visible";
    document.getElementsByClassName("language")[0].innerHTML = loadedFile.mode;
    document.getElementsByClassName("saved")[0].innerHTML = editor.lineCount();
    // console.log(loadedFile);
  });
};
