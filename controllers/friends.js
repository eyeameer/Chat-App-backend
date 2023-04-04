const asyncWrapper=require('../middleware/async')
const {StatusCodes}=require("http-status-codes")
const Friends=require("../models/friends")
const {ObjectId, $push}=require('mongodb')
const addFriend=asyncWrapper(async(req,res)=>{
    
})