const User=require('../models/auth')
const Jwt=require('jsonwebtoken')
const asyncWrapper=require('../middleware/async')
const {BadRequest, UnauthenticatedError}=require('../errors/index')
const authorization=asyncWrapper( async(req,res,next)=>{
    const auth=req.headers.authorization
    if(!auth || !auth.startsWith('Bearer')){
        throw new UnauthenticatedError('connection invalid')

    }
try {
    const token=auth.split(' ')[1]
    const payload=Jwt.verify(token,process.env.JWT_SECRET)
req.user={userId:payload.id,username:payload.userName}
next()
} catch (error) {
    throw new UnauthenticatedError('Authentication failed')
}



})
module.exports=authorization 