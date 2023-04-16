const express=require('express')

const router=express.Router()
const {register,login,search,addFriend,getFriends,setProfile,getProfile,ourCleanup,upload}=require('../controllers/auth')
router.post('/register',ourCleanup,register)
router.post('/login',ourCleanup,login)
router.get('/search/:number',search)
router.post('/addFriend',addFriend)
router.get('/displayFriends/:myId',getFriends)
router.post('/uploadProfile',upload.single('photo'),ourCleanup,setProfile)
router.get('/dowloadProfile/:id',getProfile)
module.exports=router