const mongoose=require('mongoose')


const bcrypt=require('bcryptjs')
const jwt_string=process.env.JWT_SECRET
const JWT=require('jsonwebtoken')
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'pls enter a name'],

    },
    number:{
        type: Number,
        required:[true,'pls enter a valid number'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'pls enter a password'],
        
    },
    Friends:{
        type:Array
    }

})
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  })
  



UserSchema.methods.createJWT=function(){
    return JWT.sign({id:this._id, userName:this.name},process.env.JWT_SECRET,{expiresIn:'30d'})
    
}

UserSchema.methods.passCheck=async function(pass){
    const isCorrect=await bcrypt.compare(pass,this.password)
    return isCorrect
    next()
    
}

module.exports=mongoose.model('User',UserSchema) 