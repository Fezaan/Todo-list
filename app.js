//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
var _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let itemSchema, Item, defaultItems, pri, listSchema, List;
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
    listSchema = {
      name: String,
      items: [itemSchema],
    };
    List = mongoose.model("List", listSchema);

    app.get("/", async function (req, res) {
      pri = await Item.find();
      // console.log(pri);
      if (pri.length === 0) {
        Item.insertMany(defaultItems);
      }
      res.render("list", { listTitle: "Today", newListItems: pri });
    });

  } catch (err) {
    console.log("ERR" + err);
  }
}

main();

app.post("/", async function (req, res) {
  let itemName = req.body.newItem;
  let listName = req.body.list;
  // console.log(listName);
  const item = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    let lostList = await List.findOne({ name: listName });
    // console.log(lostList._id);
    lostList.items.push(item);
    lostList.save();
    res.redirect("/" + listName);
  }
});

app.post("/delete", async function (req, res) {
  let checkedID = req.body.checkbox;
  let listToUpdate = req.body.listName;
  // console.log(listToUpdate, checkedID);

  if (listToUpdate === "Today") {
    await Item.findByIdAndRemove(checkedID);
    res.redirect("/");
  } else {
    // console.log(await List.findOne( {name: listToUpdate}));
    await List.findOneAndUpdate(
      { name: listToUpdate },
      {
        $pull: { items: { _id: checkedID } },
      }
    );
    res.redirect("/" + listToUpdate);
  }
});

app.get("/:customName", async function (req, res) {
  let customName = _.capitalize(req.params.customName);
  let list = new List({
    name: customName,
    items: defaultItems,
  });
  let pri = await List.findOne({ name: customName });
  if (pri) {
    // console.log('Already in db');
    res.render("list", { listTitle: pri.name, newListItems: pri.items });
  } else {
    // console.log("List doesnt exist");
    list.save();
    res.redirect("/" + customName);
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
