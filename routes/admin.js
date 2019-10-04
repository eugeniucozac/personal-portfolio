const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const async = require("async");
const Pastexperience = require("../models/Pastexperience");
const Logoexperience = require("../models/Logoexperience");
const Contact = require("../models/Contact");
const Project = require("../models/Project");
const Experience = require("../models/Experience");
const Header = require("../models/Header");
const About = require("../models/About");
const Subtitle = require("../models/Subtitle");
const Skill = require("../models/Skill");
const {eunsureAuthenticated} = require("../helpers/auth");
const router = express.Router();

router.get("/login", (req, res) =>{
  res.render("admin/login");
});

router.get("/dashboard", eunsureAuthenticated, (req, res) =>{
  let locals = {};
  let data = [
    (callback) => {
      About.find({}).then(abouts =>{
        locals.abouts = abouts;
        callback();
      });
    },
    (callback) => {
      Header.find({}).then(headers =>{
        locals.headers = headers;
        callback();
      });
    },
    (callback) => {
      Pastexperience.find({}).then(pastexperiences =>{
        locals.pastexperiences = pastexperiences;
        callback();
      });
    },
    (callback) => {
      Logoexperience.find({}).then(logoexperiences =>{
        locals.logoexperiences = logoexperiences;
        callback();
      });
    },
    (callback) => {
       Contact.find({}).then(contacts =>{
        locals.contacts = contacts;
        callback();
      });
    },
    (callback) => {
       Project.find({}).then(projects =>{
        locals.projects = projects;
        callback();
      });
    },
    (callback) => {
       Experience.find({}).then(experiences =>{
        locals.experiences = experiences;
        callback();
      });
    },
    (callback) => {
        Subtitle.find({}).then(subtitles =>{
        locals.subtitles = subtitles;
        callback();
      });
    },
    (callback) => {
        Skill.find({}).then(skills =>{
        locals.skills = skills;
        callback();
      });
    }
  ];

  async.parallel(data, (err) =>{ 
    if (err) return next(err); 
    res.render("admin/dashboard", locals);
  });
});

router.post("/login", (req, res, next) =>{
  passport.authenticate("local", {
  	successRedirect: "/admin/dashboard",
  	failureRedirect: "/admin/login",
  	failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) =>{
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/admin/login");
});

module.exports = router;