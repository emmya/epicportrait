"use strict";

var bcrypt = require("bcrypt"),
    salt = bcrypt.genSaltSync(10), //tells bcrypt to generate some salt
    passport = require("passport"),
    passportLocal = require("passport-local");

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      validate: {
        len: [4, 30] //username must be 4-30 chars
      }
    },
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Photo);
      },
      encryptPass: function(password) {
        var hash = bcrypt.hashSync(password, salt);
        return hash;
      },
      comparePass: function(userpass, dbpass) { //first param is plaintext; second is prev hashed password
        return bcrypt.compareSync(userpass, dbpass);
      },
      createNewUser: function(username, password, err, success) {
        if (password.length < 6) {
          err({message: "Password should exceed 6 characters"});
        } else {
          User.create({
            username: username,
            password: this.encryptPass(password)
          }).done(function(error, user){ //second param is whatever was produced when done
            if(error) {
              console.log(error);
              if (error.name === "SequelizeValidationError") { //if username is not long enough
                err({message: "Your username should be 4+ chars"});
              } else if (error.name === "SequelizeUniqueConstraintError") {
                err({message: "Username is taken."});
              }
            } else {
              success({message: "Account created! Please log in."});
            }
          });
        }
      },
    } //close classMethods
  } //close classMethods outder
  ); //close define user
//PASSPORT TIME

passport.use(new passportLocal.Strategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
},
//the done parameter here is PASSPORT
//passing req lets us call flash
//passport function. done is a callback
  function(req, username, password, done) {
  User.find({
    where: {
      username: username
    }
  //now that username has been looked for/found...
  //the done method here is SEQUELIZE
  }).done(function(error, user) { //user is the user object passed to this
    if(error) { //if error occured on server end
      console.log(error);
      return done(err, req.flash('loginMessage', 'Oops! Something went wrong.'));
      //passing in name of message and message to print
    } else if (user === null) {
      return done(null,false,req.flash('loginMessage', 'Username does not exist'));
    } else if (User.comparePass(password, user.password) !== true) {
      return done(null, false, req.flash('loginMessage', 'Invalid password'));
    } //continues if no errors found
    req.session.username  = user.username; //allows us to call username via req.session.username in app.js
    done(null, user);
    });
  }));
  return User;
}; //close user function


