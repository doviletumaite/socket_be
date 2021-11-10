import mongoose from "mongoose";

const {Schema, model} = mongoose

const MessageSchema = new Schema({
    text: {type:String}
},
{
    timestamps: true
}
)

const RoomSchema = new Schema({
    name: {type: String, required: true},
    chatHistory: {
        type: [MessageSchema],
        required: true,
        default: []
    }
})

export default model("room", RoomSchema)