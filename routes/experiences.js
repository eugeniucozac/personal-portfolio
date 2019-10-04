const express = require("express");
const mongoose = require("mongoose");
const Experience = require("../models/Experience");
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
  if(!req.body.titleExperience){
    errors.push({text: "Please add a title"})
  }
  if(!req.body.company){
    errors.push({text: "Please add a company"})
  }
  if(!req.body.detailsExperience){
    errors.push({text: "Please add details"})
  }
  if(!req.body.startDate){
    errors.push({text: "Please add a startDate"})
  }
  if(!req.body.endDate){
    errors.push({text: "Please add a endDate"})
  }
  if(!req.body.categoryExperience){
    errors.push({text: "Please add categoryExperience"})
  }

  if(errors.length > 0){
    res.render("/admin/dashboard", {
      errors: errors,
      title: req.body.titleExperience,
      company: req.body.company,
      details: req.body.detailsExperience,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      category: req.body.categoryExperience
    });
  }else{
    const newExperience = {
      title: req.body.titleExperience,
      company: req.body.company,
      details: req.body.detailsExperience,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      category: req.body.categoryExperience
    }
    new Experience(newExperience)
    .save()
    .then(experience => {
      req.flash("success_msg", "Experience was added");
      res.redirect("/admin/dashboard#experience-tab");
    })
  } 
});

router.put("/:id",  (req, res) =>{
   Experience.findOne({
    _id: req.params.id
  })  
  .then(experience =>{
      experience.title = req.body.titleExperience,
      experience.company = req.body.company,
      experience.details = req.body.detailsExperience,
      experience.startDate = req.body.startDate,
      experience.endDate = req.body.endDate,
      experience.category = req.body.categoryExperience

      experience.save()
      .then(experience =>{
          res.redirect("/admin/dashboard#experience-tab");
      })
  })
});

router.delete("/:id", (req, res) =>{
  Experience.deleteOne({
    _id: req.params.id
  }) 
  .then(() =>{
      res.redirect("/admin/dashboard#experience-tab");  
  })
});

module.exports = router;