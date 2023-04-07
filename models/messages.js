const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt_string=process.env.JWT_SECRET
const JWT=require('jsonwebtoken')
const messagesSchema=new mongoose.Schema({
    id:{
        type:String,
        required:[true,'friends id must be provided']
    },
    messages:[
        {   
            id:{type:String},
            message:{type:String},
            time:{type:Number}
        }
    ],
    time:{
        type:Number
    }
},
)
module.exports=mongoose.model("Message",messagesSchema)    