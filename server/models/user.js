let  {Schema, model} = require("mongoose")


let userSchema = new Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    songs: [{type: Schema.Types.ObjectId, ref: "Blog"}]
})

userSchema.index({username: 1}, {
    unique: true,
    collation: {
        locale: "en",
        strength: 2
    }
})

userSchema.index({email: 1}, {
    unique: true,
    collation: {
        locale: "en",
        strength: 2
    }
})

let User = model('User', userSchema)

module.exports = User