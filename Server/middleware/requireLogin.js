
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../keys.js";
import mongoose from "mongoose";
import User from "../models/user.js";

const request = (req,res,next)=>{
    console.log(req.headers);
    const authorization = req.headers.authorization;
// authorization === Bearer abcd123abcd
    if(!authorization){
       return res.status(401).json({error:"You must logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
          return  res.status(401).json({error:"You must be logged in "})
        }
        const{_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
        
    })
}

//const Require = mongoose.model("Require",require)
export default request; 

