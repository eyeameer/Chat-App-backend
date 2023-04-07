const asyncWrapper=require('../middleware/async')
const User=require('../models/auth')
const {StatusCodes}=require('http-status-codes')
const {BadRequest,NotFound, UnauthenticatedError}=require('../errors/index')
const register=asyncWrapper(async(req,res)=>{
   const user=await User.create({...req.body})
   const token=user.createJWT()
    res.status(StatusCodes.OK).json({name:user.name,token:token,id:user._id})
})
const login=asyncWrapper(async(req,res)=>{
    if (!req.body.number || !req.body.password) {
        throw new BadRequest('Please provide number and password')
      }
const user=await User.findOne({"number":req.body.number})
if(!user){
    throw new UnauthenticatedError('user not found')
}
const isPasswordCorrect = await user.passCheck(req.body.password)
if (!isPasswordCorrect) {
  throw new UnauthenticatedError('Invalid Credentials')
}
const token=user.createJWT()
res.status(StatusCodes.OK).json({name:user.name,token:token,id:user._id})
})
const search=asyncWrapper(async(req,res)=>{
const {number}=req.params
const user=await User.findOne({number})
if(!user){
    throw new NotFound('user not found')
}
user.password=''
res.status(StatusCodes.OK).json(user)
})
const addFriend=asyncWrapper(async(req,res)=>{
    const user=await User.updateOne({_id:req.body.myId},{$push:{Friends:{myName:req.body.myName,friendName:req.body.theirName,myId:req.body.myId,theirId:req.body.theirId}}})
    const user2=await User.updateOne({_id:req.body.theirId},{$push:{Friends:{myName:req.body.theirName,friendName:req.body.myName,myId:req.body.theirId,theirId:req.body.myId}}})
    res.status(StatusCodes.OK).json(req.body)
})
const getFriends=asyncWrapper(async(req,res)=>{
    const {myId}=req.params
    const friends=await User.findOne({_id:myId})
    res.status(StatusCodes.OK).json({friends:friends.Friends})
})
module.exports={register,login,search,addFriend,getFriends}
