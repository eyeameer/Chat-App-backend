const express= require('express')
const router=express.Router()
const {sendMessage,getAllMessages,syncAllMessages}=require('../controllers/chats')
router.post('/sendMessage',sendMessage)
router.get('/getMessages/:theirId',getAllMessages)
router.get('/syncMessages/:theirId',getAllMessages)
module.exports=router