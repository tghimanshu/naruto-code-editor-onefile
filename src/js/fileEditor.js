const getExtension = (filePath) => {
  let mainFile = filePath.split("\\").pop();
  let ext = mainFile.split(".").pop();
  return ext;
};

const getMode = (extension) => {
  let modeInfo = CodeMirror.findModeByExtension(extension);
  // console.log(modeInfo);
  return modeInfo;
};

let openFileBtn = document.getElementById("openFile");
let saveFileBtn = document.getElementById("saveFile");

/***********************************
            Opening File
***********************************/

const openFileInEditor = (editorId, file) => {
  let cm = document.getElementsByClassName("CodeMirror");
  for (let i = 0; i < cm.length; i++) {
    cm[i].style.display = "none";
  }
  let ext = getExtension(file);
  let modeInfo = getMode(ext);
  let mode = modeInfo.mode;
  let mime = modeInfo.mime;
  let languageName = modeInfo.name;
  let editor = fileEditor(editorId);
  if (editor.getValue() === "") {
    fs.readFile(file, (err, content) => {
      editor.setValue(content.toString());
      editor.setOption("mode", mime);
      CodeMirror.autoLoadMode(editor, mode);
      editor.setOption("theme", "blackboard");
      document.getElementsByClassName("language")[0].innerHTML = languageName;
      document.getElementsByClassName(
        "saved"
      )[0].innerHTML = editor.lineCount();
      // console.log(activeFile);
    });
  } else {
    editor.setOption("mode", mime);
    CodeMirror.autoLoadMode(editor, mode);
    // console.log("added mode " + mode + languageName);
    editor.setOption("theme", "blackboard");
    // document.getElementsByClassName("CodeMirror")[0].style.visibility =
    ("visible");
    document.getElementsByClassName("language")[0].innerHTML = languageName;
    document.getElementsByClassName("saved")[0].innerHTML = editor.lineCount();
  }
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
  let activeFile = getActiveFile();
  let editor = document.getElementById(activeFile.editorId).nextSibling
    .CodeMirror;
  if (activeFile.filePath !== "") {
    if (activeFile.changed === true && activeFile.saved === false) {
      fs.writeFile(activeFile.filePath, editor.getValue(), (err, data) => {
        alert("Doc Saved!");
        activeFile.changed = false;
        activeFile.saved = true;
        document.getElementsByClassName("saved").innerHTML = "Saved";
      });
    }
  } else {
    dialog
      .showSaveDialog({
        title: "Save As",
      })
      .then((file) => {
        // console.log(file);
        fs.writeFile(file.filePath, editor.getValue(), () => {
          // console.log("saved to: " + file.filePath);
          // activeFile.filePath = file.filePath;
          // activeFile.extension = getExtension(file.filePath);
          // activeFile.mode = getMode(activeFile.extension);
          // activeFile.saved = true;
          // activeFile.changed = false;
          document.getElementsByClassName("saved")[0].innerHTML = "Saved";
          document.getElementsByClassName("language")[0].innerHTML = getMode(
            getExtension(file.filePath)
          );
          // activeFile.mode;
          // console.log(activeFile);
          editor.setOption("mode", getMode(getExtension(file.filePath)));
        });
      });
  }
};

const fileEditor = (id) => {
  let editor;

  if (document.getElementById(id) === null) {
    activeFiles.forEach((file) => (file.active = false));

    let activeFile = {
      editorId: id,
      fileId: id.slice(7),
      filePath: document.getElementById(id.slice(7)).getAttribute("data-path"),
      active: true,
      saved: true,
      changed: false,
    };
    activeFiles.push(activeFile);

    let cm = document.getElementsByClassName("CodeMirror");

    for (let i = 0; i < cm.length; cm++) {
      cm[i].style.display = "none";
    }

    let textArea = document.createElement("textarea");
    textArea.setAttribute("id", id);
    document.getElementsByClassName("editor-panel")[0].appendChild(textArea);

    editor = CodeMirror.fromTextArea(document.getElementById(id), {
      lineNumbers: true,
      mode: "",
      matchBrackets: true,
      lineWrapping: "wrap",
      autoComplete: true,
      foldGutters: true,
      autoCloseBrackets: true,
      autoCloseTags: true,
      // theme: "blackboard",
      // styleActiveLine: true,
      // scrollbarStyle: "overlay",
    });
  } else {
    let activeFileIndex = getActiveFileIndex(id);
    activeFiles.forEach((file) => (file.active = false));
    activeFiles[activeFileIndex].active = true;

    let cm = document.getElementsByClassName("CodeMirror");
    for (let i = 0; i < cm.length; cm++) {
      cm[i].style.display = "none";
    }

    document.getElementById(id).nextSibling.style.display = "block";
    editor = document.getElementById(id).nextSibling.CodeMirror;
  }

  editor.setSize("100%", leftPanelHeight);

  editor.on("change", (e) => {
    let editorId = editor.getTextArea().getAttribute("id");
    let fId = editorId.slice(7);

    let activeFileIndex = getActiveFileIndex(editorId);
    activeFiles[activeFileIndex].changed = true;
    activeFiles[activeFileIndex].saved = false;

    let dblcFile = document.getElementById(fId).cloneNode(true);
    dblcFile.setAttribute("id", "active_" + fId);

    dblcFile.addEventListener("click", function (e) {
      let editorId = "editor_" + fId;
      let editor = openFileInEditor(
        editorId,
        dblcFile.getAttribute("data-path")
      );
    });

    if (document.getElementById("active_" + fId) === null) {
      document
        .getElementsByClassName("active-files-ul")[0]
        .appendChild(dblcFile);
    }
  });
  return editor;
};

CodeMirror.modeURL = "editor/mode/%N/%N.js";
