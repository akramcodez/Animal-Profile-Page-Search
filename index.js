const express = require("express");
const app = express();
const path = require("path");

const port = 8080;

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/icon")));

app.listen(port, () => {
  console.log("App is listening :", port);
});

app.get("/ig/:username", (req, res) => {
  let instadata = require("./data.json");
  let { username } = req.params;
  let data = instadata[username];
  console.log(data);
  if (data) {
    res.render("insta.ejs", { data });
  } else {
    res.render("error.ejs", { data });
  }
});   



