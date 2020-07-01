const mongoose = require('mongoose')
const uniqueVlidator = require('mongoose-unique-validator')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    name: String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        }
    ]
})
userSchema.plugin(uniqueVlidator)
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.ID = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User