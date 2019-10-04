const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const {USER_LOGIN, USER_PASS} = require("./passwords");

module.exports = function(passport){
  passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
  }, 
  (username, password, done) =>{   
    var hashuser = bcrypt.hashSync(USER_LOGIN, 10);
    var hashpass = bcrypt.hashSync(USER_PASS, 10);
    if(bcrypt.compareSync(password, hashpass) && bcrypt.compareSync(username, hashuser)) {
      return done(null, username);
    }else{
       return done(null, false, { message: 'Incorrect username or password' });
    } 
  }));

  passport.serializeUser(function(username, done) {
    done(null, username);
  });

  passport.deserializeUser(function(username, done) {
    done(null, USER_LOGIN);
  }); 
}