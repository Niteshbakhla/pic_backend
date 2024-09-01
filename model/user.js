const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
            email: {
                        type: String,
                        unique: true,
                        required: true
            },
            username: {
                        type: String,
                        unique: true,
                        required: true
            },
            password: {
                        type: String,
                        required: true,
            },

            accountType: {
                        type: String,
                        default: "buyer"
            },

            uploads: [  
                        {
                                    type: mongoose.Schema.Types.ObjectId,
                                    ref: "Post"
                        }
            ],

            purchased: [
                        {
                                    type: mongoose.Schema.Types.ObjectId,
                                    ref: "Post"
                        }
            ],

            favourites: [
                        {
                                    type: mongoose.Schema.Types.ObjectId,
                                    ref: "Post"
                        }
            ]
})
module.exports = mongoose.model("User", userSchema)

