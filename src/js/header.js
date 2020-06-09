let maximize = document.getElementById("maximize");
let minimize = document.getElementById("minimize");
let close = document.getElementById("close");

maximize.addEventListener("click", (e) => {
   remote.getCurrentWindow().isMaximized()
     ? remote.getCurrentWindow().unmaximize()
     : remote.getCurrentWindow().maximize();
  // if(remote.getCurrentWindow().is)
});

minimize.addEventListener("click", (e) => {
  remote.getCurrentWindow().minimize();
});

close.addEventListener("click", (e) => {
  remote.getCurrentWindow().close();
});
