const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //will help us for the cookie things
const jwtsecret = process.env.JWT_SECRET;

//auth middleware

const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    try{
        const decoded = jwt.verify(token,jwtsecret);
        req.userId = decoded.userId;
        next();
    }catch(error){
        console.log(error);
        }
}


//register submit
router.post('/register', async(req,res)=>{
    try{

        console.log(req.body);
        const{username,email,password,repeatPassword} = req.body;

        if(repeatPassword === password){

        const hashedpassword = await bcrypt.hash(password,10);

        try{
            const user = await User.create({username , password : hashedpassword , email});
            res.status(201).redirect('/home');
        }

        catch(error){

            if (error.code === 11000){
                res.status(409).json({message : 'user alreadey in use'})
                                     }
            res.status(500).json({message: 'internal server error'});
        }
                                        }
        else{
            console.log("passwords don't match");
            }
        }
    catch(error){
        console.log(error); 
                }
    });

//login submit
router.post('/login', async (req, res) => {
    const {username,password,email} = req.body;

    try{
        const user = await User.findOne({username});

        if(!user){
            console.log('user is not exists');
        }

        const isPassword = await bcrypt.compare(password , user.password);

        if(!isPassword){
            console.log('invalid password try again');
        }

        else{
            const token = jwt.sign({ userId : user._id } , jwtsecret );
            res.cookie('token',token,{httpOnly:true});
            req.session.user = {
                username : user.username
            }
            res.redirect('/home');
        }

    }
    
    catch(err){
        console.log(err)
    }
});

//logout
router.post('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('/index');
})

//landing :
router.get('/index',(req,res)=>{
    const local = {
        title : "Authentication Node.js"
    }
    res.render('partials/index',{local});
});

router.get('/',(req,res)=>{
    const local = {
        title : "Authentication Node.js"
    }
    res.redirect('/index');
});

//login :
router.get('/login', (req,res)=>{

    const local = {
        title : "Authentication | Login"
    }

    res.render('partials/login',{local});
});

//register :
router.get('/register',(req,res)=>{

    const local = {
        title : "Authentication | Register"
    }
    res.render('partials/register',{local});
})

//home :
router.get('/home',authMiddleware,(req,res)=>{
    const local = {
        title : "Authentication | Home"
    }
    const user = req.session.user;
    res.render('partials/home',{local,user:user});
})
module.exports = router;
