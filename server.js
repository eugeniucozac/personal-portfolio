const express = require("express");
const path = require("path");
const Pastexperience = require("./models/Pastexperience");
const Logoexperience = require("./models/Logoexperience");
const Contact = require("./models/Contact");
const Project = require("./models/Project");
const Experience = require("./models/Experience");
const Header = require("./models/Header");
const About = require("./models/About");
const Subtitle = require("./models/Subtitle");
const Skill = require("./models/Skill");
const sass = require("node-sass");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");   
const async = require("async");
const ejs = require("ejs");   
const { equalSubtitle } = require("./helpers/helpers");
const app = express();    

app.locals.moment = require("moment");
require("./helpers/nodemailer");  

app.set('views', __dirname + '/views');  
app.set('view engine', 'ejs');
app.use(express.static("public")); 
app.use(cors());    

app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); 
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/test', express.static(__dirname + '/public/'));

const admin = require("./routes/admin");
app.use(cookieParser());  
app.use(session({
  secret: "eugeniucozac",
  proxy: true,  
  resave: true,
  saveUninitialized: true,
  cookie : {
    maxAge: 3600000 
  }
}));
require("./config/passport")(passport);

mongoose.Promise = global.Promise;
const db = require("./config/db");

mongoose.connect(db.mongoURI, {
	useNewUrlParser: true
})
.then(() => console.log("connected"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) =>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.cv_url = "/files/Eugene_Cozac_UI_Developer.docx";
  res.locals.linkedin = "https://www.linkedin.com/in/eugene-cozac-0a917b7b";
  res.locals.github = "https://github.com/eugeniucozac"; 
  next();  
});

ejs.filters.equalSubtitle = (obj, cat) =>{
   let result = obj.find(({block}) => block === cat);
   if(result){
      return `<h2>${result.title}</h2><p class="mb-5">${result.subtitle}</p>`;
   }
}; 

const pastexperiences = require("./routes/pastexperiences");
const logoexperiences = require("./routes/logoexperiences"); 
const skills = require("./routes/skills");
const contacts = require("./routes/contacts");
const experiences = require("./routes/experiences");
const projects = require("./routes/projects");
const headers = require("./routes/headers");
const abouts = require("./routes/abouts");
const subtitles = require("./routes/subtitles");

app.use("/logoexperiences", logoexperiences);
app.use("/pastexperiences", pastexperiences);
app.use("/contacts", contacts);
app.use("/experiences", experiences);
app.use("/projects", projects);
app.use("/headers", headers);
app.use("/abouts", abouts);
app.use("/subtitles", subtitles);
app.use("/skills", skills);
app.use("/admin", admin);

app.get("/", (req, res) =>{
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
    res.render("pages/index", {locals});
  });
});

const PORT = process.env.PORT || 8080;  
app.listen(PORT);