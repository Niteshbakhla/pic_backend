const mongoose = require("mongoose")


exports.connectDB = async () => {


            try {
                        const connection = await mongoose.connect(process.env.MONGO_URI)
                        if (connection.STATES.connected) return console.log("Database is connected!")
                        if (connection.STATES.disconnected) return console.log("Database is disconneted")
            } catch (error) {
                        console.log(error)
            }
}

// exports.module = { connectDB }