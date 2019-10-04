const express = require("express");
const mongoose = require("mongoose");
const Logoexperience = require("../models/Logoexperience");
const multer  = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const { NAME_CLOUDINARY, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY } = require("../config/passwords");
const router = express.Router();

router.use((req, res, next) =>{
    if (req.query._method == "DELETE"){
        req.method = "DELETE";
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

router.post("/", parser.single("logoimage"), (req, res) =>{
  let errors = [];
  const file = req.file;

  if(!req.body.typeLogo){
    errors.push({text: "Please add a type"})
  }
  if(!file.url){
    errors.push({text: "Please add a logo"})  
  }
  if(errors.length > 0){
    res.render("/admin/logoexperience", {
      errors: errors,
      type: req.body.typeLogo,
      image: file.url
    });
  }else{  
    const newLogoexperience = {
      type: req.body.typeLogo,
      image: file.url
    }
    new Logoexperience(newLogoexperience)
    .save()
    .then(logoexperience => {
      req.flash("success_msg", "Logo was added");
      res.redirect("/admin/dashboard#logo-tab");
    })
  } 
}); 

router.put("/:id", parser.single("logoimage"), (req, res) =>{
  const file = req.file;
  let urlFile = "";

  Logoexperience.findOne({
    _id: req.params.id
  })  
  .then(logoexperience =>{
    !file ? urlFile = logoexperience.image : urlFile = file.url;
    let url = logoexperience.image,
        cloudinaryId = url.slice(url.indexOf("eugeniucozac"), url.lastIndexOf(".")); 
    cloudinary.api.delete_resources(cloudinaryId , (result) => {
      logoexperience.type = req.body.typeLogo,
      logoexperience.image = urlFile;
      logoexperience.save()
      .then(logoexperience =>{
          res.redirect("/admin/dashboard#logo-tab");
      })
    });  
  })
}); 

router.delete("/:id", (req, res) =>{
  Logoexperience.findOne({
    _id: req.params.id
  })
  .then(logoexperience =>{
    let url = logoexperience.image,
        cloudinaryId = url.slice(url.indexOf("eugeniucozac"), url.lastIndexOf(".")); 
    cloudinary.api.delete_resources(cloudinaryId , (result) => { 
      logoexperience.deleteOne().then(logoexperience =>{ 
        res.redirect("/admin/dashboard#logo-tab");
      })
    }); 
  }); 
});

module.exports = router;