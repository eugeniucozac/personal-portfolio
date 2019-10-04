const express = require("express");
const mongoose = require("mongoose");
const Contact = require("../models/Contact");
const mailContact = require('../helpers/nodemailer');
const { EMAIL_USERNAME } = require("../config/passwords");
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
  if(!req.body.type){
    errors.push({text: "Please add a contact"})
  }
  if(!req.body.icon){
    errors.push({text: "Please add an icon"})
  }
  if(!req.body.details){
    errors.push({text: "Please add details"})
  }

  if(errors.length > 0){
    res.render("/admin/dashboard", {
      errors: errors,
      type: req.body.type,
      icon: req.body.icon,
      details: req.body.details
    });
  }else{
    const newContact = {
      type: req.body.type,
      icon: req.body.icon,
      details: req.body.details
    }
    new Contact(newContact)
    .save()
    .then(contact => {
      req.flash("success_msg", "Contact was added");
      res.redirect("/admin/dashboard#contact-tab");
    })
  } 
});

router.put("/:id",  (req, res) =>{
   Contact.findOne({
    _id: req.params.id
  })  
  .then(contact =>{
      contact.type = req.body.type,
      contact.icon = req.body.icon,
      contact.details = req.body.details;
      contact.save()
      .then(contact =>{
          res.redirect("/admin/dashboard#contact-tab");
      })
  })
});

router.delete("/:id", (req, res) =>{
  Contact.deleteOne({
    _id: req.params.id
  }) 
  .then(() =>{
      res.redirect("/admin/dashboard#contact-tab");  
  })
});

router.post('/email', (req, res, next) => {
  mailContact({
      to: EMAIL_USERNAME, 
      subject: req.body.dropLineName,
      text:`From: ${req.body.dropLineEmail}
Message: ${req.body.dropLineMessage}`,    
      auth: {
          user: EMAIL_USERNAME 
      } 
  });
  req.flash("success", "Thanks for contacting me");
  res.locals.message = req.flash();
  res.redirect("/#contact"); 
});  

module.exports = router;