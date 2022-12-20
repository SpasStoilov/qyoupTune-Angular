let  {Schema, model} = require("mongoose")


let postSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    title: {type: String, required: true},
    text: {type: String, required: true},
    users: [
        {
            username: {type: String, required: true},
            post: {type: String, required: true},
        }
    ],
})

let Post = model('Post', postSchema)

module.exports = Post