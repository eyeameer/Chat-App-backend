const express=require('express')

const router=express.Router()
const {register,login,search,addFriend,getFriends}=require('../controllers/auth')
router.post('/register',register)
router.post('/login',login)
router.get('/search/:number',search)
router.post('/addFriend',addFriend)
router.get('/displayFriends/:myId',getFriends)
module.exports=router