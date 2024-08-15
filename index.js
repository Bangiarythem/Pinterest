var express = require('express');
var router = express.Router();

const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const upload = require('./multer');


const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {error: req.flash('error')});
});

const axios = require('axios');

router.get('/feed', async function(req, res, next) {
  let posts = [];

  try {
    if(req.query.search){
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: { 
          query: req.query.search,
          client_id: '-0UjXzK1cYzJB5CnY0vRckjr6J_a33ElqkfmzoeQqjw'
        }
      });
      posts = response.data.results;
    } else {
      const response = await axios.get('https://api.unsplash.com/photos/random', {
        params: { 
          count: 50, // Number of random images to fetch
          client_id: '-0UjXzK1cYzJB5CnY0vRckjr6J_a33ElqkfmzoeQqjw'
        }
      });
      posts = response.data;
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching posts");
  }

  res.render('feed', { posts });
});



router.post('/upload', isLoggedIn,upload.single("file") , async function(req, res, next) {
  if(!req.file){
     return res.status(400).send("no files were given");
  }
  // jo file upload hui hai use save karo as a post and uska postid user ko do and post ka userid do.
  const user = await userModel.findOne({username: req.session.passport.user})
  const postdata = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });
  user.posts.push(postdata._id);
  await user.save();
  res.redirect("/profile");
});



router.get('/profile', isLoggedIn , async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  .populate("posts")
  res.render('profile', {user});
});

router.post("/register", function(req, res){
  const { username, email, fullName } = req.body;
  const userData = new userModel({ username, email, fullName });

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
    })
  })
});


router.post("/login",passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}));


router.get("/logout", function(req, res, next){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect('/');
  })
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}



module.exports = router;































































/*router.get('/alluserposts',async function(req, res, next) {
  let user = await userModel
  .findOne({_id: "66b78c4a6ebdeb29e8fe8a93"})
  .populate('posts')   // real data
  res.send(user);
});

router.get('/createuser',async function(req, res, next) {
let createduser =  await userModel.create({
    username: "Rythem",
  password: "Rishi",
  posts: [],
  email: "rythembangia2004@gmail.com",
  fullName: "Rythem Bangia",
  })

  res.send(createduser);
});


router.get('/createpost',async function(req, res, next) {
  let createdpost = await postModel.create({
    postText: "Hello Kaise ho saare",
    user: "66b78c4a6ebdeb29e8fe8a93"
  });
  let user =  await userModel.findOne({_id: "66b78c4a6ebdeb29e8fe8a93"});
   user.posts.push(createdpost._id)
   await user.save();
   res.send("Done");
});
*/

