const asyncWrapper=require('../middleware/async')
const User=require('../models/auth')
const { MongoClient, ObjectId } = require("mongodb")
const fs = require('fs');

const sharp=require('sharp')
// const gridfs = require('mongoose-gridfs');
// let gfs
const path=require('path')
const {StatusCodes}=require('http-status-codes')
const mongoose = require('mongoose');
const {BadRequest,NotFound, UnauthenticatedError}=require('../errors/index')
const sanitizeHTML = require("sanitize-html")

const multer = require('multer');
const upload = multer();
// const upload = multer({ storage: multer.memoryStorage() });
const connectDB=require('../db/db')
const register=asyncWrapper(async(req,res)=>{
   
    if (!req.body.number || !req.body.password || !req.body.name) {
        throw new BadRequest('Please provide name, number and password')
      }
   const user=await User.create({...req.body})
   const token=user.createJWT()
    res.status(StatusCodes.OK).json({name:user.name,token:token,id:user._id,photo:user.Photo})
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
res.status(StatusCodes.OK).json({name:user.name,token:token,id:user._id,photo:user.Photo})
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
  const tempUser2=await User.findOne({_id:req.body.theirId})
    const user=await User.findOneAndUpdate({_id:req.body.myId},{$push:{Friends:{myName:req.body.myName,friendName:req.body.theirName,myId:req.body.myId,theirId:req.body.theirId,photo:tempUser2.Photo}}})
    const user2=await User.findOneAndUpdate({_id:req.body.theirId},{$push:{Friends:{myName:req.body.theirName,friendName:req.body.myName,myId:req.body.theirId,theirId:req.body.myId,photo:user.Photo}}})

    req.body.photo=user2.Photo
    res.status(StatusCodes.OK).json(req.body)
})
const getFriends=asyncWrapper(async(req,res)=>{
    const {myId}=req.params
    const friends=await User.findOne({_id:myId})
    res.status(StatusCodes.OK).json({friends:friends.Friends})
})

// mongoose.connection.once('open', () => {
//     const { model } = gridfs({
//         collection: 'uploads',
//         model: 'Upload',
//         mongooseConnection: mongoose.connection
//     });
//     gfs = model;
// });
// var Grid = require('gridfs-stream');
// var GridFS = Grid(mongoose.connection.db  , mongoose.mongo);
// const setProfile=asyncWrapper(async(req,res)=>{
  
//     try{
   
//     upload.single('file')(req, res, err => {
//         console.log(req.body.id)
//         if (err) throw err;
//         const writestream = GridFS.createWriteStream({
//           filename: req.file.originalname,
//           mode: 'w',
//           content_type: req.file.mimetype,
//           metadata: {
//             id:req.body.id,
//           },
//         });
//         writestream.on('close', file => {
//           res.json({ success: true, file });
//         });
//         writestream.write(req.file.buffer);
//         writestream.end();
//       }); 
//     }catch(e){  
//         console.log(e)
//     }

// })

const GridFSBucket = require('mongodb').GridFSBucket;

const setProfile = asyncWrapper(async (req, res)=> {
 
  if(req.file){
   
    const photoName=`${Date.now()}.jpg`
    await sharp(req.file.buffer).resize(200,200,{"fit":"cover","position":"center"}).jpeg({quality:60}).toFile(path.join('public','profile-pictures',photoName)).catch(err=>console.log(err))
    const imageData = fs.readFileSync(path.join('public','profile-pictures',photoName));
    const imageBase64 = imageData.toString('base64');
  
    req.cleanData.photo=imageBase64
    
    const photo=await User.updateOne({_id:req.body.id},{$set:{"Photo":req.cleanData.photo}})
   
    res.status(StatusCodes.OK).json({photo:req.cleanData.photo})
  }
  else{
    res.status(StatusCodes.BAD_REQUEST).json({success:false})
  }


  
//   try {
//     console.log('node ran')
    
   
//     upload.single('file')(req, res, err => {
//       console.log(req.body.id)
//       if (err) throw err;
//       console.log("bucket ran")
//       let conn 
//       try {
//         conn = mongoose.connection;
//       } catch (error) {
//         console.log(error)
//       }
     
//       const bucket = new GridFSBucket(conn.db);
//       let uploadStream
//   try {
//      uploadStream = bucket.openUploadStream(req.file.originalname, {
//       metadata: {
//         id: req.body.id,
//       },
//     });
   
//   } catch (error) {
//     console.log(error)
//   }
//       uploadStream.on('error', function(error) {
//         assert.ifError(error);
        
//         console.log(error)
//       });
//       try {
//         uploadStream.end(req.file.buffer);
//       } catch (error) {
//         console.log(error)
//       }
//       uploadStream.on('finish', function(file) {
//         console.log('did this ran?')
//         res.json({ success: true, file });
//       });
    
     
//     });
  
// } 
//   catch (e) {
//     console.log(e);
//   }
});
const getProfile = asyncWrapper(async (req, res) => {
//   console.log('get ran')
//   try {
//     const conn = mongoose.connection;
//     const bucket = new GridFSBucket(conn.db);
    
//     const files = await bucket.find({ 'metadata.id': req.params.id }).toArray();
    
//     if (files.length === 0) {
//       res.status(404).json({ success: false, message: 'File not found' });
//       return;
//     }
    
//     const downloadStream = bucket.openDownloadStream(files[0]._id);
    
//     res.set('Content-Type', files[0].contentType);
//     downloadStream.pipe(res);
//   } catch (e) {
//     console.log(e);
//   }

});
function ourCleanup(req, res, next) {

  if (typeof req.body.name != "string") req.body.name = ""
  if (typeof req.body.number != "number") req.body.number = ""
  if (typeof req.body.password != "string") req.body.password= ""

  req.cleanData = {
    name: sanitizeHTML(req.body.name.trim(), { allowedTags: [], allowedAttributes: {} }),
    number: sanitizeHTML(parseInt(req.body.number.toString().trim()), { allowedTags: [], allowedAttributes: {} }),
    password: sanitizeHTML(req.body.password.trim(), { allowedTags: [], allowedAttributes: {} })
  }

  next()
}
module.exports={register,login,search,addFriend,getFriends,setProfile,getProfile,ourCleanup,upload}
 