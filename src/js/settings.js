let settings;
fs.readFile("src/data/settings.json", (err, content) => {
  // file data to string to json
  settings = JSON.parse(content.toString());
  console.log(settings);
  if (settings.background !== undefined) {
    document.getElementsByClassName(
      "container"
    )[0].style.background = `url("${settings.background}") no-repeat center center/cover`;
  }
});
