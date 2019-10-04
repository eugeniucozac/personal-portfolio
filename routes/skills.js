const express = require("express");
const mongoose = require("mongoose");
const Skill = require("../models/Skill");
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
  if(!req.body.skillType){
    errors.push({text: "Please add a skill"})
  }
  if(!req.body.skillPogress){
    errors.push({text: "Please add a progress"})
  }

  if(errors.length > 0){
    res.render("/admin/dashboard", {
      errors: errors,
      type: req.body.skillType,
      progress: req.body.skillPogress
    });
  }else{
    const newSkill = {
      type: req.body.skillType,
      progress: req.body.skillPogress
    }
    new Skill(newSkill)
    .save()
    .then(skill => {
      req.flash("success_msg", "Skill was added");
      res.redirect("/admin/dashboard#skills-tab");
    })
  } 
});

router.put("/:id", (req, res) =>{
   Skill.findOne({
    _id: req.params.id
  })  
  .then(skill =>{
      skill.type = req.body.skillType,
      skill.progress = req.body.skillPogress;
      skill.save()
      .then(skill =>{
          res.redirect("/admin/dashboard#skills-tab");
      })
  })
});

router.delete("/:id", (req, res) =>{
  Skill.deleteOne({
    _id: req.params.id
  }) 
  .then(() =>{
      res.redirect("/admin/dashboard#skills-tab");  
  })
});

module.exports = router;