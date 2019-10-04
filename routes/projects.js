const express = require("express");
const mongoose = require("mongoose");
const Project = require("../models/Project");
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

router.post("/", parser.single("imageproject"), (req, res) =>{
  let errors = [];
  const file = req.file;

  if(!req.body.titleproject){
    errors.push({text: "Please add a name"})
  }
  if(!req.body.viewproject){
    errors.push({text: "Please add a image"})
  }
  if(!req.body.viewgithub){
    errors.push({text: "Please add a live"})
  }
  if(!req.body.technologies){
    errors.push({text: "Please add a github"})
  }
  if(!file.url){
    errors.push({text: "Please add a file"})
  }

  if(errors.length > 0){
    res.render("/admin/project", {
      errors: errors,
      title: req.body.titleproject,
      viewproject: req.body.viewproject,
      viewgithub: req.body.viewgithub,
      technologies: req.body.technologies,
      image: file.url
    });
  }else{
    const newProject = {
      title: req.body.titleproject,
      viewproject: req.body.viewproject,
      viewgithub: req.body.viewgithub,
      technologies: req.body.technologies,
      image: file.url
    }
    new Project(newProject)
    .save()
    .then(project => {
      req.flash("success_msg", "Project was added");
      res.redirect("/admin/dashboard#projects-tab");
    })
  } 
}); 

router.put("/:id", parser.single("imageproject"), (req, res) =>{
  const file = req.file;
  let urlFile = "";

  Project.findOne({
    _id: req.params.id
  })     
  .then(project =>{
    !file ? urlFile = project.image : urlFile = file.url;
    let url = project.image,
        cloudinaryId = url.slice(url.indexOf("eugeniucozac"), url.lastIndexOf(".")); 
    cloudinary.api.delete_resources(cloudinaryId , (result) => {
      project.title = req.body.titleproject,
      project.viewproject = req.body.viewproject,
      project.viewgithub = req.body.viewgithub,
      project.technologies = req.body.technologies,
      project.image = urlFile;
      project.save()
      .then(project =>{
          res.redirect("/admin/dashboard#projects-tab");
      }) 
    });   
  })
});

router.delete("/:id", (req, res) =>{
  Project.findOne({
    _id: req.params.id
  }) 
  .then(project =>{
    let url = project.image,
        cloudinaryId = url.slice(url.indexOf("eugeniucozac"), url.lastIndexOf(".")); 
    cloudinary.api.delete_resources(cloudinaryId, (result) => { 
      project.deleteOne().then(project =>{ 
        res.redirect("/admin/dashboard#projects-tab");
      })
    }); 
  }); 
});

module.exports = router;