require("dotenv").config()
const Grid = require('gridfs-stream');
const express=require('express')
const app=express()
const authRouter=require('./routes/auth')
const chatRouter=require('./routes/chats')
const authorization=require('./middleware/authorization')
const connectDB=require('./db/db')
const cors=require('cors')
const path=require('path')
const fse=require('fs-extra')
const {ourCleanup}=require('./controllers/auth.js')
fse.emptyDirSync(path.join('public','profile-pictures'))
app.use(express.static('public'));
const port=process.env.port || 5000
app.use(cors({
    origin:'*'
}))

app.use(express.json())
app.use('/api',authRouter)

app.use('/api/chats',authorization,chatRouter)


const start=async()=>{
    const connection = await connectDB(process.env.MONGO_URI);
     

app.listen(port,()=>console.log(`listening on port ${port}`))
}
start() 
