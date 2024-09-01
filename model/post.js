const mongoose = require("mongoose")
// const { Schema } = require("mongoose")

const postSchema = new mongoose.Schema({
            title: {
                        type: String,
                        required: true,
            },
            author: {
                        type: String,
                        required: true

            },

            price: {
                        type: Number,
                        required: true
            },

            image: {
                        type: String,
                        required: true,
            },

            publicId: {
                        type: String,
            },

            authorId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
            },

            purchaseBy: [
                        {
                                    type: mongoose.Schema.Types.ObjectId,
                                    ref: "User"
                        },
            ],
}, { timestamps: true }
)


module.exports = mongoose.model("Post", postSchema)

