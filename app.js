const express= require("express");
const bodyParser= require("body-parser");
const date= require(__dirname+"/date.js");

const app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

let items=["Bath", "Spray Perfume", "Get Bitches"];
let workItems=[];
app.get("/",(req,res)=>{
    // let day=date.getDay();
    let day=date.getDate();
    res.render('list',{kindOfDay: day, Item: items }); 
});

app.get("/work", (req,res)=>{
  res.render('list' ,{kindOfDay: 'Work', Item: workItems});
});
app.post("/",(req,res)=>{
  let item= req.body.inp;
  if(req.body.list === 'Work'){
    workItems.push(item);
    res.redirect("/work");
  }
  else{
    items.push(item);
    res.redirect("/");
  }
  console.log(req.body);
});
// app.post("/work", (req,res)=>{
//   let item= req.body.inp;
//   workItems.push(item);
//   res.redirect("/work");
// });
app.get("/about", (req,res)=>{
  res.render("about");
})
app.listen(3000, ()=>{
    console.log("Server running");
});