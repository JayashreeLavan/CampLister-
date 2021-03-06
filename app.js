var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    flash                   = require("connect-flash"),
    methodOverride          = require("method-override"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");

var seedDB      = require("./seeds"),
    Campground  = require("./models/campground"),
    User        = require("./models/user"),
    Comment     = require("./models/comment");
    
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

//seedDB(); // seed the DB

mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://localhost/yelp_camp");
// mongoose.connect("mongodb://Jay:password@ds135983.mlab.com:35983/camplister");



app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method")); 
app.use(flash());
app.locals.moment = require('moment');

//=======================
//PASSPORT CONFIGURATION
//=======================

app.use(require("express-session")({
   secret:"We will conquer",
   resave:false,
   saveUninitialized :false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


//===============================
//
//===============================
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


//==================
//  SERVER LISTEN
//==================

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server started"); 
});