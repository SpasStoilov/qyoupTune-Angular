let  {Schema, model} = require("mongoose")


let blogSchema = new Schema({
    title: {type: String, required: true},
    imgUrl: {type: String, required: true},
    songPath: {type: String, required: true},
    contacts: {type: String, required: true},
    genre: {type: String, required: true},
})


let Blogs = model('Blog', blogSchema)

module.exports = Blogs