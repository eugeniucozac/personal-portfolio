const express = require("express");
const mongoose = require("mongoose");
const Subtitle = require("../models/Subtitle");
const router = express.Router();

router.use((req, res, next) =>{
    if (req.query._method == "DELETE"){
        req.method = "DELETE";
        req.url = req.path;
    }       
    next(); 
});

router.post("/", (req, res) =>{
  let errors = [];
  if(!req.body.blockSubtitle){
    errors.push({text: "Please add a skill"})
  }
  if(!req.body.subtitle){
    errors.push({text: "Please add a icon"})
  }

  if(errors.length > 0){
    res.render("/admin/subtitle", {
      errors: errors,
      block: req.body.blockSubtitle,
      title: req.body.blockTitle,
      subtitle: req.body.subtitle
    });
  }else{
    const newSubtitle = {
      block: req.body.blockSubtitle,
      title: req.body.blockTitle,
      subtitle: req.body.subtitle
    }
    new Subtitle(newSubtitle)
    .save()
    .then(subtitle => {
      req.flash("success_msg", "Subtitle was added");
      res.redirect("/admin/dashboard#subtitles-tab");
    })
  } 
});

router.put("/:id",  (req, res) =>{
   Subtitle.findOne({
    _id: req.params.id
  })  
  .then(subtitle =>{
      subtitle.block = req.body.blockSubtitle,
      subtitle.title = req.body.blockTitle,
      subtitle.subtitle = req.body.subtitle;
      subtitle.save()
      .then(subtitle =>{
          res.redirect("/admin/dashboard#subtitles-tab");
      })
  })
});

router.delete("/:id", (req, res) =>{
  Subtitle.deleteOne({
    _id: req.params.id
  }) 
  .then(() =>{
      res.redirect("/admin/dashboard#subtitles-tab");  
  })
});

module.exports = router;