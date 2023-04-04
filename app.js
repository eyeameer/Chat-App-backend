require("dotenv").config()
const express=require('express')
const app=express()
const authRouter=require('./routes/auth')
const chatRouter=require('./routes/chats')
const authorization=require('./middleware/authorization')
const cors=require('cors')

const port=process.env.port || 5000
// const io=require("socket.io")(port,{
    // cors:{
        // origin:'http://localhost:5000'
    // }
// })
// io.on('connection',socket=>{
// socket.emit('message','ayoooo')
// console.log(socket.id)
// })
app.use(cors({
    origin:'*'
}))
app.use(express.json())
app.use('/api',authRouter)
app.use('/api/chats',authorization,chatRouter)
const connectDB=require('./db/db')

const start=async()=>{
    await connectDB(process.env.MONGO_URI)
app.listen(port,()=>console.log(`listening on port ${port}`))
}
start() 