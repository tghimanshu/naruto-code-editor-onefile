let openFileBtn = document.getElementById("openFile");
let saveFileBtn = document.getElementById("saveFile");

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
          document.getElementsByClassName("saved")[0].innerHTML = "Saved";
          document.getElementsByClassName("language")[0].innerHTML = getMode(
            getExtension(file.filePath)
          );

          editor.setOption("mode", getMode(getExtension(file.filePath)));
        });
        document
          .getElementById(activeFile.fileId)
          .setAttribute("data-path", file.filePath);
        document
          .getElementById("active_" + activeFile.fileId)
          .setAttribute("data-path", file.filePath);

        fs.readFile("src/data/opened-folder.json", (err, content) => {
          // file data to string to json
          let data = JSON.parse(content.toString());
          // opening folder
          changeFolder(data.path);
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
      gutter: true,
      foldGutters: true,
      autoCloseBrackets: true,
      autoCloseTags: true,
      theme: "blackboard",
      styleActiveLine: true,
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
    dblcFile.classList.remove("untitled");

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

const createAFile = (name, path) => {
  let ext = getExtension(path);
  let language = getMode(ext) === undefined ? "document" : getMode(ext).name;
  if (language === "Plain Text") {
    language = "document";
  }
  if (language === "SQL") {
    language = "database";
  }
  if (ext === "webp" || ext === "jpg" || ext === "png" || ext === "gif") {
    language = "image";
  }
  console.log(language, getMode(ext), ext);
  let li = document.createElement("li");
  li.classList.add("file");
  li.setAttribute("id", "file_" + fileNum);
  li.setAttribute("data-path", path);
  li.setAttribute("data-active", false);
  li.innerHTML = `<i class="file-icon colored"><img src="languages/icons/${language}.svg" /></i>
  <div class="file-name">${path.split("\\").pop()}</div>
  <div class="file-close">&times;</div>`;
  fileNum++;
  return li;
};

const createAUntitledFile = (id) => {
  let language = getMode("html") === undefined ? "html" : getMode("html").name;

  let li = document.createElement("li");
  li.classList.add("file");
  li.setAttribute("id", "untitled_" + id);
  li.setAttribute("class", "file untitled");
  li.setAttribute("data-path", "");
  li.setAttribute("data-active", false);
  li.innerHTML = `<i class="file-icon colored"><img src="languages/icons/${language}.svg" /></i>
  <div class="file-name">Untitled-${id}</div>
  <div class="file-close">&times;</div>`;
  document.getElementById("untitled-files").appendChild(li);

  let dblcFile = li.cloneNode(true);
  dblcFile.setAttribute("id", "active_untitled_" + id);
  let active = document
    .getElementsByClassName("active-files-ul")[0]
    .appendChild(dblcFile);

  dblcFile.addEventListener("click", function (e) {
    let editorId = "editor_" + fId;
    let editor = openFileInEditor(editorId, dblcFile.getAttribute("data-path"));
  });
};

const createAFolder = (path) => {
  let li = document.createElement("li");
  li.classList.add("folder");
  // li.setAttribute("data-folder-expanded", "false");
  li.innerHTML = `<div class="folder-div" data-folder-expanded="false">
                    <div class="folder-toggle">
                      <i class="material-icons">play_arrow</i>
                    </div>
                    <div class="folder-icon">
                      <i class="material-icons">folder</i>
                    </div>
                    <div class="folder-name">${path.split("\\").pop()}</div>
                  </div>`;
  return li;
};
/***************************************
            Recursive File Walker
****************************************/
let fileNum = 1;

function filewalker(elem, dir, done) {
  let results = [];

  fs.readdir(dir, function (err, list) {
    if (err) return done(err);

    var pending = list.length;

    if (!pending) return done(null, results, elem);
    // console.log(list);
    list.forEach(function (file) {
      file = path.resolve(dir, file);

      fs.stat(file, function (err, stat) {
        // If directory, execute a recursive call
        if (stat && stat.isDirectory()) {
          // Add directory to array [comment if you need to remove the directories from the array]
          results.push(file);
          let newElem = document.createElement("ul");
          // console.log(dir + "\\" + file);
          filewalker(newElem, file.toString(), function (err, res, resHtml) {
            results = results.concat(res);
            let appendingFolder = createAFolder(file);
            let folderContents = document.createElement("ul");
            folderContents.classList.add("folder-contents");
            folderContents.append(resHtml);
            appendingFolder.append(folderContents);
            elem.prepend(appendingFolder);
            if (!--pending) done(null, results, elem);
          });
        } else {
          // results.push(file);
          let nayaFile = createAFile(file, file);
          elem.appendChild(nayaFile);
          if (!--pending) done(null, results, elem);
        }
      });
    });
  });
}

const changeFolder = (folderPath) => {
  // console.log(data.filePaths[0]);
  let ul = document.createElement("ul");
  ul.classList.add("folder-contents");

  // changing folder name
  document.getElementById("folder-name").innerHTML = folderPath
    .split("\\")
    .pop();

  // calling file walker function
  filewalker(ul, folderPath, (err, res, res2) => {
    let openedFolder = document.getElementById("opened-folder-ul");
    openedFolder.innerHTML = "";
    openedFolder.appendChild(res2);

    // adding click listener to folders
    let folderDiv = document.getElementsByClassName("folder-div");
    for (let elemId = 0; elemId < folderDiv.length; elemId++) {
      folderDiv[elemId].addEventListener("click", function (e) {
        e.preventDefault();
        let content = folderDiv[elemId].nextSibling;
        if (
          folderDiv[elemId].getAttribute("data-folder-expanded") === "false"
        ) {
          content.style.display = "block";
          folderDiv[elemId].setAttribute("data-folder-expanded", "true");
          folderDiv[elemId].querySelector(
            ".folder-toggle .material-icons"
          ).style.transform = "rotate(90deg)";
          folderDiv[elemId].querySelector(
            ".folder-icon .material-icons"
          ).textContent = "folder_open";
          // fixing client Height
          if (
            leftPanelHeight !=
            document.getElementsByClassName("left-panel")[0].clientHeight
          ) {
            document.getElementsByClassName("left-panel")[0].style.height =
              leftPanelHeight + "px";
            document.getElementById(
              "opened-folder"
            ).style.height = openedFolderHeight;
          }
          //fixing client height end
        } else if (
          folderDiv[elemId].getAttribute("data-folder-expanded") === "true"
        ) {
          content.style.display = "none";
          folderDiv[elemId].setAttribute("data-folder-expanded", "false");
          folderDiv[elemId].querySelector(
            ".folder-toggle .material-icons"
          ).style.transform = "rotate(0deg)";
          folderDiv[elemId].querySelector(
            ".folder-icon .material-icons"
          ).textContent = "folder";
        }
      });
    }

    // adding on click event listener to the files
    let files = document
      .getElementById("opened-folder-ul")
      .getElementsByClassName("file");
    for (let elemId = 0; elemId < files.length; elemId++) {
      files[elemId].addEventListener("dblclick", function (e) {
        let fId = files[elemId].getAttribute("id");
        let dblcFile = files[elemId].cloneNode(true);
        dblcFile.setAttribute("id", "active_" + fId);
        console.log(dblcFile);
        dblcFile.addEventListener("click", function (e) {
          let editorId = "editor_" + fId;
          let editor = openFileInEditor(
            editorId,
            files[elemId].getAttribute("data-path")
          );
        });
        if (document.getElementById("active_" + fId) === null) {
          document
            .getElementsByClassName("active-files-ul")[0]
            .appendChild(dblcFile);
        }
      });
      files[elemId].addEventListener("click", function (e) {
        let fId = files[elemId].getAttribute("id");
        let editorId = "editor_" + fId;
        let editor = openFileInEditor(
          editorId,
          files[elemId].getAttribute("data-path")
        );
      });
    }
  });

  // changing the folder in data folder
  fs.readFile("src/data/opened-folder.json", (err, content) => {
    let contentJson = JSON.parse(content);
    contentJson.path = folderPath;
    fs.writeFile(
      "src/data/opened-folder.json",
      JSON.stringify(contentJson),
      () => {}
    );
  });

  // clearing the text editor
  document.getElementsByClassName("editor-panel")[0].innerHTML = "";
};

// last opened folder data
fs.readFile("src/data/opened-folder.json", (err, content) => {
  // file data to string to json
  let data = JSON.parse(content.toString());
  // opening folder
  changeFolder(data.path);
});

let folderChange = document.getElementById("folder-change");

folderChange.addEventListener("click", (e) => {
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((data) => {
      changeFolder(data.filePaths[0].toString());
    });
});

const NewFile = () => {
  let untitled = document
    .getElementsByClassName("active-files-ul")[0]
    .getElementsByClassName("untitled").length;
  createAUntitledFile(untitled + 1);
  let id = "untitled_" + (untitled + 1);
  let editor = fileEditor("editor_" + id);
};
