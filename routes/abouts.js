const express = require("express");
const mongoose = require("mongoose");
const About = require("../models/About");
const multer = require('multer');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const { NAME_CLOUDINARY, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY } = require("../config/passwords");
const router = express.Router();

router.use((req, res, next ) =>{
    if (req.query._method == 'DELETE'){
        req.method = 'DELETE';
        req.url = req.path;  
    }       
    next();   
}); 

cloudinary.config({
  cloud_name: NAME_CLOUDINARY,
  api_key: API_KEY_CLOUDINARY,
  api_secret: API_SECRET_CLOUDINARY
});

const storage = cloudinaryStorage({  
  cloudinary,
  folder: "eugeniucozac",
  allowedFormats: ["jpg", "png"]
});

const parser = multer({ storage: storage });

router.post("/", parser.single("imageabout"), (req, res) =>{
  let errors = [];
  const file = req.file;
 
  if(!req.body.contentabout){
    errors.push({text: "Please add a content"})
  }
  if(!file.url){
    errors.push({text: "Please add a image"})
  } 

  if(errors.length > 0){
    res.render("/admin/about", {
      errors: errors,  
      content: req.body.contentabout,
      image: file.url
    });
  }else{
    const newAbout = {
      content: req.body.contentabout,
      image: file.url
    }
    new About(newAbout)
    .save()
    .then(about => {
      req.flash("success_msg", "About was added");
      res.redirect("/admin/dashboard#about-tab");
    })
  } 
});

router.put("/:id", parser.single("imageabout"), (req, res) =>{
  const file = req.file;
  let urlFile = "";

  About.findOne({
    _id: req.params.id
  })  
  .then(about =>{
    !file ? urlFile = about.image : urlFile = file.url;
    let url = about.image,
        cloudinaryId = url.slice(url.indexOf("eugeniucozac"), url.lastIndexOf(".")); 
    cloudinary.api.delete_resources(cloudinaryId , (result) => {
      about.content = req.body.contentabout,
      about.image = urlFile;
      about.save()
      .then(about =>{
          res.redirect("/admin/dashboard#about-tab");
      })
    });  
  })
});  

router.delete("/:id", (req, res) =>{
  About.findOne({
    _id: req.params.id
  })
  .then(about =>{
    let url = about.image,
        cloudinaryId = url.slice(url.indexOf("eugeniucozac"), url.lastIndexOf(".")); 
    cloudinary.api.delete_resources(cloudinaryId , (result) => { 
      about.deleteOne().then(about =>{ 
        res.redirect("/admin/dashboard#about-tab");
      })
    });
  });  
}); 

module.exports = router;