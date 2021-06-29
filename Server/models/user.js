import mongoose from "mongoose"
//const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/mern-03/image/upload/v1624536264/noimage_mv3ggz.jpg"
    },
    followers:[{type: mongoose.Schema.Types.ObjectId,ref:"User"}],
    following:[{type: mongoose.Schema.Types.ObjectId,ref:"User"}]
})

const User = mongoose.model("User",userSchema)

export default User; 