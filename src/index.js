import express from "express"
import cors from "cors"
import {createServer} from "http"
import { Server } from "socket.io";
import  mongoose  from "mongoose"

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)

const io = new Server(httpServer, {allowEIO3:true})

io.on("connection", (socket) => {

})

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected with MongoDB!")
    httpServer.listen(3030)
})