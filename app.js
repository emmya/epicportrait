var express = require("express");
	bodyParser = require("body-parser"),
	app = express(),
	db = require("./models/index.js"),
	passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  session = require("cookie-session"),
  flash = require("connect-flash"),
  methodOverride = require('method-override'),
  fs = require('fs'),
  cors = require("cors"),
  imgur = require('imgur-node-api'),
  imgur2 = require('imgur'),
	path = require('path'),
	multer  = require('multer');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(multer({ dest: './img/'}));

//set up session
app.use(session({
	secret:'thisismysecretkey',
	name: 'coookie',
	maxage: 3600000000//sets life of cookie in milliseconds
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session()); //tells passport to create a session when authenticated
//include flash messages
app.use(flash());

//lets serialize the user when authenticated
passport.serializeUser(function(user,done){
	console.log("SERIALIZE JUST RAN");
	done(null,user.id); //will get sent to cookie. cookie will store user id
});

//deserializing. checks to see if user is still authenticated.
passport.deserializeUser(function(id,done) { 
	console.log("DESERIALIZED JUST RAN");
	db.User.find({ //getting user
		where: { //deserialize checks if user is authenticated
			id: id 
		} 
	}).done(function(error,user){ //sequelize done. will either throw error or whatever the query gave us
		done(error,user); //if error is null, then this calls "done(null, user)"
	}); //if success, returns user rec.user
});

//=================
//  LOGIN PROCESS
//=================
//Home
app.get('/', function(req,res){
	if (!req.user) {  //IF NOT LOGGED IN
		res.render("login/index", {message:null}); //message will be the result of the user callbacks
	} else { //REDIRECTS TO HOME IF ALREADY LOGGED IN
		res.redirect('/tada');
	}
});

//Render signup page
app.get('/signup', function(req,res){
	if (!req.user) {
		res.render("login/signup", {message:null, username:""}); 
	} else {
		res.redirect('/tada');
	}
});

//Post signup data
app.post('/signup', function(req,res) {
	db.User.createNewUser(req.body.username, req.body.password, //callback function
		//err
		function(error) { //param could be anything
			res.render("login/signup", {message: error.message, username: req.body.username});
		},
		//success
		function(success) {
			res.render("login/index", {message: success.message});
		}
	);
});

//Render login page
app.get('/login', function(req,res){
	if (!req.user) {
		res.render("login/login", {message:req.flash('loginMessage'), username: req.session.username}); 
	} else {
		res.redirect('/tada');
	}
});

//Login post (using passport)
app.post('/login', passport.authenticate('local', {
	successRedirect: '/tada', //second param is if success
	failureRedirect: '/login', //third is if failure
	failureFlash: true //lets render flash messages when there are failures
})); //if success, have an object called rec.user.
	//serialize and deserialize functions have run and returned user obj.

//Render homepage if user is logged in
app.get('/home', function(req,res){
	if (req.user !== undefined) {
		res.render("home", {
			//runs a function to see if user is authenticated
			isAuthenticated: req.isAuthenticated(),
			user: req.user,
		});
} else {
	res.redirect('/');
}
});

//Log out
app.get('/logout', function(req,res) {
	req.logout();
	res.redirect('/');
});

//==================
//  IMAGE HANDLING
//==================

//imgur client ID: 4d214ab434e821a
//imgur client secret: dc524848ca53444f9e673a27eabf895577313685
//CREATE NEW IMAGE
app.post('/userimage', function(req, res, next) {
	var fstream;

 	var background = getBackground(req.body.backgroundpick) || "http://i.imgur.com/2YhTlKD.jpg";
	var animal = getAnimal(req.body.animalpick) || "http://i.imgur.com/gahqY6S.png";
  var itemone = getItem(req.body.itemone) || "http://i.imgur.com/gahqY6S.png";
  var itemtwo = getItem(req.body.itemtwo) || "http://i.imgur.com/gahqY6S.png";

  if (req.files.displayImage !== undefined) {
  	console.dir(req.files);
  	console.dir("Uploading "+req.files.displayImage.originalname);
		imgur2.setClientId("4d214ab434e821a");
		imgur2.getClientId();
		imgur2.saveClientId().done(function(err) {
			console.log('saved');
		});
		imgur2.uploadFile(__dirname + "/" + req.files.displayImage.path)
			.done(function(json) {
				console.log("LINK IS "+json.data.link);
				db.Photo.create({
  				background: background,
  				animal: animal,
  				itemone: itemone,
  				itemtwo: itemtwo,
  				img: json.data.link
  			}).done(function(err, image) {
  				req.user.addPhoto(image).done(function(err) {
  					console.log("add successful.");
  					var userid = req.user.id;
  					var imgid = image.id;
  					console.log("User id: "+userid + " img id: "+imgid);
  					res.redirect("/tada/"+imgid);
  				});
  			});
			});
    //If no image was uploaded
    } else {
    db.Photo.create({
 		background: background,
    	animal: animal,
 			itemone: itemone,
 			itemtwo: itemtwo,
 			img: "http://i.imgur.com/oY9WlIJ.png"
  		}).done(function(err, image) {
   			req.user.addPhoto(image).done(function(err) {
   				console.log("? used. Add successful.");
   				var userid = req.user.id;
   				var imgid = image.id;
  				console.log("User id: "+userid + " img id: "+imgid);
   				res.redirect("/tada/"+imgid);
    		});
    	});
    }
  }); //closes image upload


//All photos page. Passes array 'images' and 'recentImages' to page.
app.get('/tada', function(req,res){
	if (req.user) {
		//getting all images that aren't the users
		db.Photo.findAll().done(function(err, allImages) {
			console.log("img user id "+allImages[1].UserId);
			console.log("user id "+req.user.id);
			console.log("LENGTH IS "+allImages.length);
			var otherIms = []; //images not belonging to user
			for (var j=0; j<allImages.length; j++) {
				console.log(allImages[j].UserId);
				if (allImages[j].UserId != req.user.id) {
					otherIms.push(allImages[j]);
				}
			}
			var recentImages = [];
			console.log("other ims is "+otherIms.length);
			var len = otherIms.length;
			//getting the other photos' creators
			var otherUsers = [];
			for (var i=len-1; i>len-6; i--) {
				console.log("user in other ims is "+otherIms[i].UserId);
				recentImages.push(otherIms[i]);
			}

			//getting all of the user's images
			req.user.getPhotos().done(function(err, images) {
				res.render("tada", {
					images: images,
					recentImages: recentImages,
				});
			});
		});
	} else {
		res.render("login/login", {message:req.flash('loginMessage'), username: req.session.username}); 
	}
});

//Results page. Passes 'thisimage' to page.
app.get('/tada/:imgid', function(req,res){
	if (req.user) {
		var isOwner = false;
		var imgid = req.params.imgid;
		var otherOwner = "";
		console.log(req.params);
		db.Photo.find(imgid).done(function(err, thisimg) {
			if (thisimg.UserId === req.user.id) {
				isOwner = true;
				res.header("Access-Control-Allow-Origin", "*");
  			res.header("Access-Control-Allow-Headers", "Origin, CORS, X-Requested-With, Content-Type, Accept");
				res.render("result", {
				thisimg: thisimg, isOwner: isOwner
			});
		} else {
				db.User.find(thisimg.UserId).done(function(err, thisuser) {
					console.log("OWNER???? "+isOwner);
					otherOwner = thisuser.username;
					console.log("username found!!! "+otherOwner);
					res.header("Access-Control-Allow-Origin", "*");
		  		res.header("Access-Control-Allow-Headers", "Origin, CORS, X-Requested-With, Content-Type, Accept");
					res.render("result", {
						thisimg: thisimg, 
						isOwner: isOwner,
						otherOwner: otherOwner
					});
				});
			}
		});
	} else {
		res.render("login/login", {message:req.flash('loginMessage'), username: req.session.username}); 
	}
});

//Save page. Passes 'thisimage' to page.
app.get('/save/:imgid', function(req, res) {
	if (req.user) {
		var imgid = req.params.imgid;
		console.log(req.params);
		db.Photo.find(imgid).done(function(err, thisimg) {
			res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "Origin, CORS, X-Requested-With, Content-Type, Accept");
			res.render("save", {
				thisimg: thisimg
			});
		});
	} else {
		res.render("login/login", {message:req.flash('loginMessage'), username: req.session.username}); 
	}
});

//Delete
app.delete('/tada/:imgid', function (req, res) {
  var imgid = req.params.imgid;
  db.Photo.find(imgid).done(function (err, image) {
    image.destroy().done(function(err) {
      res.redirect('/tada');
    });
  });
});

//=====================
// FUN WITH FUNCTIONS
// This is where additional photo options can be added
// Update the radio buttons in "/home" accordingly
//======================
//Background
function getBackground(entry) {
	if (entry === "sunset") {
		console.log("sunset");
		return "http://i.imgur.com/Bs4uk8k.jpg";
	} else if (entry === "sky") {
		console.log("sky!");
		return "http://i.imgur.com/JRE4H9N.jpg";
	} else if (entry === "space1") {
		return "http://i.imgur.com/qcE2lmf.jpg";
	} else if (entry === "space2") {
		return "http://i.imgur.com/np9MjPh.jpg";
	} else if (entry === "vista") {
		return "http://i.imgur.com/Y3FrAr1.jpg";
	} else {
		return "http://i.imgur.com/2YhTlKD.jpg";
	}
}
//Animal
function getAnimal(entry) {
	if (entry === "lion") {
		console.log("lion");
		return "http://i.imgur.com/5RSkZSc.png";
	} else if (entry === "doge") {
		return "http://i.imgur.com/sXS9i0Q.png";
	} else if (entry === "horse") {
		return "http://i.imgur.com/NefZofo.png";
	} else if (entry === "cat") {
		return "http://i.imgur.com/aoB4sUZ.png";
	} else if (entry === "ron") {
		return "http://i.imgur.com/9UVxH3Q.png";
	} else if (entry === "giraffe") {
		return "http://i.imgur.com/pGpxrUy.png";
	} else {
		return "http://i.imgur.com/gahqY6S.png";
	}
}

function getItem(entry) {
	if (entry === "bacon") {
		return "http://i.imgur.com/ECJTBsV.png";
	} else if (entry === "cards") {
		return "http://i.imgur.com/ovFs6VV.png";
	} else if (entry === "buzz") {
		return "http://i.imgur.com/YahIj8m.png";
	} else if (entry ==="cassette") {
		return "http://i.imgur.com/nWDtYpU.png";
	} else if (entry === "football") {
		return "http://i.imgur.com/DJ9HZQs.png";
	} else if (entry === "rainbow") {
		return "http://i.imgur.com/JjfpiTc.png";
	} else if (entry === "martini") {
		return "http://i.imgur.com/fslbZAU.png";
	} else if (entry === "jesus") {
		return "http://i.imgur.com/OyAdifg.png";
	} else if (entry === "xbox") {
		return "http://i.imgur.com/ILnDe9d.png";
	} else {
		return "http://i.imgur.com/gahqY6S.png";
	}
}

app.listen(process.env.PORT || 3000);

