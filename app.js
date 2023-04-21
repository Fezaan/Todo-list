//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

async function main() {
  try {
    await mongoose.connect(process.env.URI, { useNewUrlParser: true });
    console.log("Connected");

    const itemSchema = new mongoose.Schema({
      name: String,
    });

    const Item = mongoose.model("Item", itemSchema);

    const item1 = new Item({
      name: "Bathing",
    });
    const item2 = new Item({
      name: "Spray perfume",
    });
    const item3 = new Item({
      name: "Pull some bitches",
    });
    const defaultItems = [item1, item2, item3];
    Item.insertMany(defaultItems);

    const pri = await Item.find();
    console.log(pri);
  } catch (err) {
    console.log("ERR");
  }
}
main();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.get("/", function (req, res) {
  // const day = date.getDate();

  res.render("list", { listTitle: "Today" });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;

  if (req.body.list === "Work") {
    // workItems.push(item);
    res.redirect("/work");
  } else {
    // items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List" });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
