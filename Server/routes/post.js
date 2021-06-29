import express,{Router} from 'express';
import mongoose from "mongoose";
// router from './auth';
import requireLogin  from "../middleware/requireLogin.js";
import Post from "../models/post.js";

const routers = Router();

routers.get('/allpost',requireLogin,(req,res)=>{
  Post.find()
  .populate("postedBy","_id name")
  .populate("comments.postedBy","_id name")
  .sort('-createdAt')
  .then(posts=>{
    res.json({posts})
  })
  .catch(err=>{
    console.log(err)
  })

})


routers.get('/getsubpost',requireLogin,(req,res)=>{
  Post.find({postedBy:{$in:req.user.following}})
  .populate("postedBy","_id name")
  .populate("comments.postedBy","_id name")
  .sort('-createdAt')
  .then(posts=>{
    res.json({posts})
  })
  .catch(err=>{
    console.log(err)
  })
})

routers.post('/createpost',requireLogin,(req,res)=>{
    //console.log(req.body.name)
      const {title,body,pic} = req.body
      if(!title || !body || !pic )
      {
        res.status(422).json({error: "please add all the fields"})
      }
      req.user.password = undefined
      const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
      })
      post.save().then(result=>{
        res.json({post:result})
      })
      .catch(err=>{
        console.log(err)
      })

    })

routers.get('/mypost',requireLogin,(req,res)=>{
  Post.find({postedBy:req.user._id})
  .populate("postedBy","_id name")
  .then(mypost=>{
    res.json({mypost})
  })
  .catch(err=>{
    console.log(err)
  })
})

routers.put('/like',requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }else{
      res.json(result)
    }
  })
})

routers.put('/unlike',requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }else{
      res.json(result)
    }
  })
})


routers.put('/comment',requireLogin,(req,res)=>{
  const comment = {
    text:req.body.text,
    postedBy:req.user._id
  }

  Post.findByIdAndUpdate(req.body.postId,{
    $push:{comments:comment}
  },{
    new:true
  })
  .populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }else{
      res.json(result)
    }
  })
})

routers.delete('/deletepost/:postId',requireLogin,(req,res)=>{
  Post.findOne({_id:req.params.postId})
  .populate("postedBy","_id")
  .exec((err,post)=>{
    if(err || !post){
      return res.status(422).json({error:err})
    }
    if(post.postedBy._id.toString() === req.user._id.toString())
    {
      post.remove()
      .then(result=>{
        res.json({result})
      }).catch(err=>{
        console.log(err)
      })
    }
    else{
      res.json(result)
    }
  })
})

export default routers;
