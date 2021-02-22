const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const date = require(__dirname + "/date.js")
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Yakshit:CrW7t7u3k58XW7S@cluster0.unbn0.mongodb.net/todolistDB",{useNewUrlParser: true});

const itemSchema = {
    name : String,
};

const Item = mongoose.model("Item",itemSchema);

const i1 = new Item({
    name : "Buy Food",
})
const i2 = new Item({
    name : "Cook Food",
})
const i3 = new Item({
    name : "Eat Food",
})

const i4 = new Item({
    name : "Work",
})

const defautArray = [i1,i2,i3];

const listSchema = {
    name : String,
    items : [itemSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/",(req,res)=>{

    Item.find({},(err,items)=>{
        
        if(items.length === 0){
            Item.insertMany(defautArray,(err)=>{
                if(err)
                    console.log("error");
                else
                    console.log("Successfully created the item database");
            })

            res.redirect("/");
        }
        else
            res.render("list",{ListTitle : "Today" ,  newListItems : items});
    });

});

app.get("/:customListName",(req,res)=>{

    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name : customListName}, (err,result)=>{
        if(result === null){
            const list = new List({
                name : customListName,
                items : defautArray,
            })

            list.save();
            res.redirect("/"+ customListName);
        }
        else{
            res.render("list",{ListTitle : result.name, newListItems : result.items})
        }
    })


});

app.get("/about",(req,res)=>{

    res.render("about.ejs");

});

app.use(bodyParser.urlencoded({extended:true}));

app.post("/",(req,res)=>{
    
    const itemName = req.body.NewItem;
    const listName = req.body.list;

    const item = new Item({
        name : itemName,
    })

    if(listName === "Today"){
        if(item.name.length >= 1)
            item.save();
            
        res.redirect("/");
    }
    else{
        List.findOne({name: listName},(err,result)=>{
            result.items.push(item);
            result.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete",(req,res)=>{

    const checkedItemId = req.body.checkBox;
    const listName = req.body.listName;

    if(listName === "Today"){

        Item.findByIdAndRemove(checkedItemId,(err)=>{
            if(!err)
                console.log("Successfully deleted element");
        
        });
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name : listName},{$pull : {items : {_id : checkedItemId}}}, (err,foundList)=>{
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }


})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,()=>{
    console.log("server started on port 3000");
})