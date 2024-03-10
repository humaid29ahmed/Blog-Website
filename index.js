import express from "express";
import bodyParser from "body-parser";
import path from "path";
import _ from "lodash";
import multer from "multer";
import fs from "fs";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/post/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-'+path.extname(file.originalname));
  }
});
const upload = multer({ storage:storage });
const data ={
    id:[0,1],
    image:['Car.jpg','Humaid.jpeg'],
    title:["hello","Humaid"],
    info:["Hurray","I am a good Boy"],
};
var len = (data["id"].length)-1;
function updateId(req,res,next)
{
   for(let i=0;i< data["id"].length;i++)
   {
    data.id[i]=i;
   }
   if(data["id"].length === 0)
   {
    len = -1;
   }
   next();
}
app.use(updateId);
app.get("/",(req,res)=>
{

res.render("index.ejs",data);
});

app.get("/compose",(req,res)=>
{
res.render("compose.ejs");
});


app.post("/create",upload.single('avatar'),(req,res)=>
{
    // console.log(req.body);
    data["id"].push(++data.id[len]);
    data["image"].push(req.file.filename);
    data["title"].push(req.body["title"]);
    data["info"].push(req.body["info"]);
    // console.log(data["id"]);
    // console.log(req.file);
    // console.log(data["image"]);
    // console.log(data["title"]);
    // console.log(data["info"]);
    res.redirect("/");
});

app.get("/post/:title", (req,res)=>{
  
    console.log(typeof(req.params.title));
    // var reqTitle = _.lowerCase(req.params.title);
    for(let i=0; i<data["id"].length; i++)
    {
    if(data.id[i] == (req.params.title))
    {
      // console.log(data.image[i]);
      res.render("read.ejs", {data:data.title[i], info: data.info[i], use:_, id:data.id[i],images:data.image[i]});
    }
  }
    
  });
app.get("/post/:title/delete", (req,res)=>{

  // var deleteTitle = _.lowerCase(req.params.title);
  for(let i=0;i<data["id"].length;i++)
  {
    if(data.id[i] == req.params.title)
    {
      data["id"].splice(i,1);
      data["title"].splice(i,1);
      data["info"].splice(i,1);
       fs.unlink(`./public/post/images/${data.image[i]}`, (err,fd) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File is deleted.');
        }
        console.log(fd);
        // fs.close(fd,(err)=>{
        //   if(err)
        //   {
        //   console.error("Failed to close file", err); 
        //   }
        //   else { 
        //     console.log("File Closed successfully");
        //   }
          
        // });
      });
   
    }
  }

  res.redirect("/");

});

app.get("/post/:title/edit",(req,res)=>{

  // var editTitle = _.lowerCase(req.params.title);
  var editData = {};
  for(let i=0;i<data["id"].length;i++)
  {
    if(data.id[i] == req.params.title)
    {
      editData ={
        id:data.id[i],
        Titles:data.title[i],
        Infos:data.info[i],
        use:_
      };
    }
  }
  // console.log(editData["Titles"]);
  res.render("edit.ejs", editData);

});

app.post("/post/:title/edit",(req,res)=>{

  console.log(req.params.title);
  console.log(req.body);
  // var editTitle = _.lowerCase(req.params.title);
  var editData = {
    id:req.params.title,
    title:req.body.title,
    info:req.body.info
  };
  for(let i=0;i<data["id"].length;i++)
  {
    if(data.id[i] == editData["id"])
    {
      data.title[i] = editData["title"];
      data.info[i] = editData["info"];
    }
  }
  res.redirect("/");

});

  app.listen(port,()=>{
  console.log(`The server is listening on ${port} .`);
});