const jwt = require("jsonwebtoken")

exports.generateRefreshToken = (user) => {
            return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" })
}