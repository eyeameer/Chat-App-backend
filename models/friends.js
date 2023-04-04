const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt_string=process.env.JWT_SECRET
const JWT=require('jsonwebtoken')
const friendsSchema=new mongoose.Schema({
friends:{
    type:Object
},
createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:[true,'pls provide user']
}

},
{timestamps:true}
)
module.exports=mongoose.model("Friends",friendsSchema)