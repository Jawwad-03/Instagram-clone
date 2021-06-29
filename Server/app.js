import  express  from "express";
import mongoose from "mongoose"
const app = express();
const PORT= 5000;
import {MANGOURI} from "./keys.js";
import userSchema  from "./models/user.js";
//import postSchema from "./models/post.js";
import router from "./routes/auth.js";
import routers from "./routes/post.js";
import routerr from "./routes/user.js";


//promises in js
//anonymus funct in 
//modules in js

app.use(express.json());
app.use(router);
app.use(routers);
app.use(routerr);

mongoose.connect(MANGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    app.listen(PORT,()=>{
        console.log("server is running on",PORT)
    })
})
.catch((error)=>{
    console.error('tabahi match gayee');
});


//YHASyzpNkZq0jdlM
// const customMiddleware = (req,res,next)=>{
//     console.log("middleware executed!!")
//     next()
// }


// app.get('/',(req,res)=>{
//     console.log("home")
//     res.send("hello world")
// })

// app.get('/about',customMiddleware,(req,res)=>{
//     console.log("about")
//     res.send("about page")
// })

