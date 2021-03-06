const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt= require('jsonwebtoken');
const User = require('../models/user');
const Huts = require('../models/huts');

const config = require('../config/database');

//register
 router.post('/register', (req , res, next)=>{
let newUser = new User({
    name:     req.body.name,
    email:    req.body.email,
    username: req.body.username,
    password: req.body.password
});
User.addUser(newUser, (err,user)=>{
 if(err){
  res.json({success: false,msg:  'faild to register user'});
 }else{
  res.json({success: true, msg:  'user registered'});
    }
});
 });

//Authenticate
 router.post('/authenticate', (req , res, next)=>{
const email    =    req.body.email;
const password =    req.body.password;
User.getUserByEmail(email, (err, user)=>{
if(err) throw err;
if(!user){
    return res.json({success: false, msg: 'User not found'});
}
User.comparePassword(password, user.password, (err, isMatch) =>{
    if(err) throw err;
    if(isMatch){
        const token = jwt.sign(user, config.secret,{
            expiresIn: 604800 //1week
        });
        res.json({
            success: true,
            token: 'JWT '+ token,
            user:{
                id:        user._id,
                name:      user.name,
                username:  user.username,
                email:     user.email
            }
        });
    }else{
        return res.json({success: false, msg: 'wrong password'});
    }
});
});
 });
// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});
// find all user
router.get('/alluser' ,(req,res,next)=>{
    User.getUser((err,user)=>{
 if(err){
     throw err;
 }
 res.json(user);
});
});



 module.exports = router;