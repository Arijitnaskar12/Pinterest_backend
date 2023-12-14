var express = require('express');
var router = express.Router();
const userModel=require('./users');
const postModel=require('./Post');
const localStrategy=require('passport-local');
const passport = require('passport');
const upload=require('./multer');
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/profile',isLoggedIn,async(req,res)=>{
  const user= await userModel.findOne({
    username:req.session.passport.user
  })
  .populate('posts');  
  res.render('profile',{user:user});
})
router.get('/login',(req,res)=>{
 
  res.render('login',{error:req.flash('error')});
})
router.get('/feed',isLoggedIn,async(req,res)=>{
  const user=await userModel.findOne({username:req.session.passport.user});
  const posts=await await postModel.find().populate('user');
  res.render('feed',{user,posts});
})
router.get('/add',(req,res)=>{
  res.render('add');
})
router.post('/upload',isLoggedIn,upload.single('file'),async(req,res)=>{
  if(!req.file){
    return res.status(400).send('No Files were uploaded');
  }
  const user=await userModel.findOne({username:req.session.passport.user})
 const postData=await postModel.create({
    image:req.file.filename,
    postText:req.body.filecaption,
    user:user._id,
  })
  user.posts.push(postData._id);
  await user.save();
  res.redirect('/profile');
})
router.post('/register',(req,res)=>{
  const userData=new userModel({
    username:req.body.username,
  fullname: req.body.fullname,
  email:req.body.email,
});
userModel.register(userData,req.body.password)
.then(function(){
  passport.authenticate('local')(req,res,function(){
    res.redirect('/profile');
  })
})
  })
  router.post('/fileupload',isLoggedIn,upload.single('image'),async function(req,res){
    if(!req.file){
      return res.status(400).send('No Files were uploaded');
    }
    const user=await userModel.findOne({username:req.session.passport.user});
    console.log(user);
    user.dp=req.file.filename;
    await user.save();
    res.redirect('/profile');
  })
  router.post('/login',passport.authenticate('local',{
    successRedirect:'/profile',
    failureRedirect:'/login',
    failureFlash:true
  }),function(req,res){});
  router.get('/logout',(req,res,next)=>{
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  })

  function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
  }
module.exports = router;
 