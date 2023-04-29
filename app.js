//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let itemSchema, Item, defaultItems, pri;
async function main() {
  try {
    await mongoose.connect(process.env.URI, { useNewUrlParser: true });
    console.log("Connected");

    itemSchema = new mongoose.Schema({
      name: String,
    });

    Item = mongoose.model("Item", itemSchema);

    const item1 = new Item({
      name: "Bathing",
    });
    const item2 = new Item({
      name: "Spray perfume",
    });
    const item3 = new Item({
      name: "Pull some bitches",
    });
    defaultItems = [item1, item2, item3];

    app.get("/", async function (req, res) {
      pri = await Item.find();
      console.log(pri);
      if (pri.length === 0) {
        Item.insertMany(defaultItems);
      }
      res.render("list", { listTitle: "Today", newListItems: pri });
    });

    // await process.env.DBNAME.dropDatabase();
    // app.post("/", function (req, res) {
    //   const item = req.body.newItem;
    //   Item.insertOne({ name: item });
    // });
  } catch (err) {
    console.log("ERR" + err);
  }
}

main();

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

// app.get("/",async function (req, res) {
//   // const day = date.getDate();
//   const pri=await Item.find();
//   console.log(pri);
//   res.render("list", { listTitle: "Today", newListItems: pri });
// });

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", async function (req, res) {
  const checkedID = req.body.checkbox;
  console.log(checkedID);
  await Item.findOneAndDelete(checkedID);
  res.redirect("/");
});

// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
