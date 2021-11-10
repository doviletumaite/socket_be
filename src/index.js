import express from "express"
import cors from "cors"
import {createServer} from "http"
import { Server } from "socket.io";
import  mongoose  from "mongoose"

const app = express()
app.use(cors())
app.use(express.json())

app.get('/online-users', (req, res, next) => {
    res.send({onlineUsers})
})

const httpServer = createServer(app)

const io = new Server(httpServer, {allowEIO3:true})

io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on("setUserName", ({userName}) => {
        onlineUsers.push({userName, id: socket.id})
        socket.emit("loggedIn")
        socket.broadcast.emit("newConnection")
    })
       socket.on("loggetIn", ({userName}) => {
           console.log(`hello ${userName}`)
           socket.emit("welcome", {message:"hi"})
       })
})

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected with MongoDB!")
    httpServer.listen(3030)
})