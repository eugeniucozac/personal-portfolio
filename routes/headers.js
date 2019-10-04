const express = require("express");
const mongoose = require("mongoose");
const Header = require("../models/Header");
const multer  = require('multer');
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

router.post("/", parser.single("devphoto"), (req, res) =>{
  let errors = [];
  const file = req.file;

  if(!req.body.devname){
    errors.push({text: "Please add a name of developer"})
  }
  if(!req.body.devexperience){
    errors.push({text: "Please add experience"})
  }
  if(!req.body.devposition){
    errors.push({text: "Please add dev position"})
  }
  if(!file.url){
    errors.push({text: "Please add a image"})
  } 

  if(errors.length > 0){
    res.render("/admin/header", {
      errors: errors,
      name: req.body.devname,
      experience: req.body.devexperience,
      position: req.body.devposition,
      image: file.url
    });
  }else{
    const newHeader = {
      name: req.body.devname,
      experience: req.body.devexperience,
      position: req.body.devposition,
      image: file.url
    }
    new Header(newHeader)
    .save()
    .then(header => {
      req.flash("success_msg", "Header was added");
      res.redirect("/admin/dashboard#header-tab");
    })
  } 
});

router.put("/:id", parser.single("devphoto"), (req, res) =>{
  const file = req.file;
  let urlFile = "";

  Header.findOne({
    _id: req.params.id
  })  
  .then(header =>{
    !file ? urlFile = header.image : urlFile = file.url;
    let url = header.image,
        cloudinaryId = url.slice(url.indexOf("eugeniucozac"), url.lastIndexOf(".")); 
    cloudinary.api.delete_resources(cloudinaryId , (result) => {
      header.name = req.body.devname,
      header.experience = req.body.devexperience,
      header.position = req.body.devposition,
      header.image =  urlFile;
      header.save()
      .then(header =>{
          res.redirect("/admin/dashboard#header-tab");
      })
    });  
  })
}); 

router.delete("/:id", (req, res) =>{
  Header.findOne({
    _id: req.params.id
  })
  .then(header =>{
    let url = header.image,
        cloudinaryId = url.slice(url.indexOf("eugeniucozac"), url.lastIndexOf(".")); 
    cloudinary.api.delete_resources(cloudinaryId , (result) => { 
      header.deleteOne().then(header =>{ 
        res.redirect("/admin/dashboard#header-tab");
      })
    }); 
  }); 
});

module.exports = router;