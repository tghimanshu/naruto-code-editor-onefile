// const { fstat } = require("fs");
// const { create } = require("domain");

const createAFile = (name, path) => {
  let ext = getExtension(path);
  let language = getMode(ext) === undefined ? "html" : getMode(ext).name;

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
