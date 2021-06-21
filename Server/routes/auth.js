import express,{Router} from 'express';
//const express = require('express')
import userSchema from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../keys.js";
import request  from "../middleware/requireLogin.js";
//import User from '../models/user.js';



// const userSchema = mongoose.model("userSchema");
const router = Router();

// router.get('/protected',request,(req,res)=>{
//     res.send("Hello")
// })

router.post('/signup',(req,res)=>{
//console.log(req.body.name)
  const {name,email,password} = req.body
  console.log(req.body)
  console.log(`name ${name} , Email,${email} , Password :${password}` )
  if(!email || !password || !name)
  {
    res.status(422).json({error: "please add all the fields"})
  }
 //res.json({message: "succesfully posted"})
  userSchema.findOne({email:email})
  .then((savedUser)=>{
      if(savedUser){
          return res.status(422).json({error:"user already exists with this email"})
      }
      bcrypt.hash(password,12)
      .then(hashedpassword=>{
        const user = new userSchema({
          email,
          password:hashedpassword,
          name
      })
      user.save()
      .then(user=>{
          res.json({message:"saved sucessfully"})
      })
      .catch((error)=>{
        console.log(error);
    });
      })
      
  })
  .catch((error)=>{
    console.log(error);
   });
})

router.post('/signin',(req,res)=>{
  const{email,password} = req.body
  if(!email || !password){
    return res.status(422).json({error:"Please add email and Password"})
  }
  userSchema.findOne({email:email})
  .then(savedUser=>{
    if(!savedUser){
      return res.status(422).json({error:"Invalid Email or Password"})
    }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch=>{
      if(doMatch){
        // res.json({message:"Successfully signed in"})
        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
        const {_id,name,email} = savedUser
        res.json({token,user:{_id,name,email}})
      }
      else{
        return res.status(422).json({error:"Invalid Email or Password"})
      }
    })
    .catch(error=>{
      console.log(error)
    })
  })
})

//module.exports = router;
export default router;


