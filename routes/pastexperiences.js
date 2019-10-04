const express = require("express");
const mongoose = require("mongoose");
const Pastexperience = require("../models/Pastexperience");
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
  if(!req.body.skill){
    errors.push({text: "Please add a skill"})
  }
  if(!req.body.iconExperience){
    errors.push({text: "Please add a icon"})
  }
  if(!req.body.detailsExperience){
    errors.push({text: "Please add a details"})
  }

  if(errors.length > 0){
    res.render("/admin/dashboard", {
      errors: errors,
      skill: req.body.skill,
      icon: req.body.iconExperience,
      details: req.body.detailsExperience
    });
  }else{
    const newPastexperience = {
      skill: req.body.skill,
      icon: req.body.iconExperience,
      details: req.body.detailsExperience
    }
    new Pastexperience(newPastexperience)
    .save()
    .then(pastexperience => {
      req.flash("success_msg", "Skill was added");
      res.redirect("/admin/dashboard#design-tab");
    })
  } 
});

router.put("/:id",  (req, res) =>{
   Pastexperience.findOne({
    _id: req.params.id
  })  
  .then(pastexperience =>{
      pastexperience.skill = req.body.skill,
      pastexperience.icon = req.body.iconExperience,
      pastexperience.details = req.body.detailsExperience;
      pastexperience.save()
      .then(pastexperience =>{
          res.redirect("/admin/dashboard#design-tab");
      })
  })
});

router.delete("/:id", (req, res) =>{
  Pastexperience.deleteOne({
    _id: req.params.id
  }) 
  .then(() =>{
      res.redirect("/admin/dashboard#design-tab");  
  })
});

module.exports = router;