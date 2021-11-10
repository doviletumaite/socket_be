import express from "express"
import cors from "cors"
import {createServer} from "http"
import { Server } from "socket.io";
import  mongoose  from "mongoose"
import RoomModel from "./rooms/schema.js"

let onlineUsers = []

const app = express()
app.use(cors())
app.use(express.json())

app.get('/online-users', (req, res, next) => {
    res.send({onlineUsers})
})

app.get('/chat/:room', async (req, res, next) => {
    const room = await RoomModel.findOne({ name: req.params.room})
    if(!room){
        res.status(404).send("room not found")
        return
    }
    res.send(room.chatHistory)
})

const httpServer = createServer(app)

const io = new Server(httpServer, {allowEIO3:true})

io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on("setUserName", ({userName, room}) => {
        onlineUsers.push({userName, id: socket.id, room})
        socket.join(room)
        socket.emit("loggedIn")
        socket.broadcast.emit("newConnection")
    })
       socket.on("loggetIn", ({userName}) => {
           console.log(`hello ${userName}`)
           socket.emit("welcome", {message:"hi"})
       })
          socket.on("sendMessage", async({message, room}) => {
             const mess =  await RoomModel.findOneAndUpdate({room},
                {
                    $push: {chatHistory: message}
                })
                console.log(mess)
                socket.broadcast.emit("message", message)
          })
})

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected with MongoDB!")
    httpServer.listen(3030)
})