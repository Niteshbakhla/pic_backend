const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000
const { readdirSync } = require("fs");
const { connectDB } = require("./database/connectionDB");
const cors = require("cors");
dotenv.config();
connectDB();


app.use(express.json());
app.use(cors(
            {
                        origin: "https://pic-frontend-tau.vercel.app",
                        credentials: true
            }
));
readdirSync("./routes").map((route) => {
            app.use("/api", require(`./routes/${route}`));
})


app.listen(PORT, () => {
            console.log(`Server is running at ${PORT}`);
});

// Types of reques=>
// GET- To get the data from  the server.
// POST - To post  the data  to the server.
// PUT - To update the data  on the server.
// DELETE-To delete the data form the server.
