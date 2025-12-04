import express from "express"
import mongoose from "mongoose"
import {UserModel} from "db"
mongoose.connect(process.env.mongo_url!);
const app=express();
app.post("/signup",(req,res)=>{
    
})
app.listen(3000);