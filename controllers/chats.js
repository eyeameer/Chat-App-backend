const asyncWrapper=require('../middleware/async')
const {StatusCodes}=require("http-status-codes")
const Message=require("../models/messages")
const {ObjectId, $push}=require('mongodb')
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const sendMessage=asyncWrapper(async(req,res)=>{
     req.body.createdBy=req.user.userId
     
     let user=await Message.find({id:req.user.userId+req.body.theirId})
     if(user.length===0){
        user=await Message.find({id:req.body.theirId+req.user.userId})
     }
     const time=new Date()
if(user.length>0){
    const message=await Message.updateOne({id:user[0].id},{
    $push:{messages:{id:req.body.createdBy,message:req.body.messages.message,time:time.getTime()}
            }})
    res.status(StatusCodes.OK).json(message)
}else{
// const newUser=await Message.create({theirId:req.body.theirId,messages:[],createdBy:req.body.createdBy})
const friendUser=await Message.create({id:req.body.createdBy+req.body.theirId,messages:[{id:req.body.createdBy, message:req.body.messages.message,time:time.getTime()}]})
res.status(StatusCodes.OK).json({main:friendUser})
    }
    res.status(StatusCodes.EXPECTATION_FAILED).json({mssg:"failed"})
})
const getAllMessages = asyncWrapper(async (req, res) => {
  let id = req.user.userId + req.params.theirId;
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });
  let messgArray = await Message.findOne({ id: id });
  if(messgArray===null){
   id=req.params.theirId + req.user.userId 
   messgArray = await Message.findOne({ id: id });
  }
  if(messgArray===null){
    res.write(`data: ${JSON.stringify([{id:'unknown',message:'send your first message😊'}])}\n\n`);
  }
  else{
    res.write(`data: ${JSON.stringify(messgArray.messages)}\n\n`);
  }
  if(messgArray!==null){
  const pipeline = [
    {
      $match: {
        "fullDocument.id": id,
        operationType: "update",
      },
    },
  ];
  const db = mongoose.connection;
  
  const changeStream = db.collection("messages").watch(pipeline, {
    fullDocument: "updateLookup",
  });
  const sendChange = async (change) => {
    const message = await Message.findOne({ id: id });

    res.write(`data: ${JSON.stringify(message.messages)}\n\n`);
  };
  changeStream.on("change", sendChange);

  // send heartbeat message every 15 seconds
  const intervalId = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 15000);
  
  // Stop sending changes when client disconnects
  req.on("close", () => {
    changeStream.removeListener("change", sendChange);
    clearInterval(intervalId); // clear interval on request close
  });
  }
});
module.exports={sendMessage,getAllMessages}