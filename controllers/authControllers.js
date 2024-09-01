const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../helpers/accessToken");
const { generateRefreshToken } = require("../helpers/refreshToken");


exports.signup = async (req, res) => {
            const { username, email, password, accountType } = req.body;
            try {
                        let isEmailExist = await User.findOne({ email }).select("email, password")

                        if (!username || !email || !password) {
                                    return res.status(400).json({ success: false, message: "All fields are required" });
                        }
                        if (isEmailExist) {
                                    return res.status(400).json({ success: false, message: "Email is already registered" });
                        }
                        const securedPassword = await bcrypt.hash(password, 10);
                        const user = new User({
                                    username,
                                    email,
                                    password: securedPassword,
                                    accountType
                        });

                        await user.save();
                        return res.status(200).json({ message: "Account is created", success: true, user });
            } catch (error) {
                        console.log(error)
                        if (error.code === 11000) return res.status(400).json({ message: "username already exist" })
                        return res.status(500).json({ message: "Internal server error", success: false })
            }
}

exports.login = async (req, res) => {

            const { email, password } = req.body
            try {
                        const isEmailExist = await User.findOne({ email });
                        if (!isEmailExist) return res.status(400).json({ message: "Email dosen't exist" })

                        const passwordMatch = await bcrypt.compare(password, isEmailExist.password)
                        if (!passwordMatch) return res.status(400).json({ message: "incorrect password" });

                        const data = {
                                    id: isEmailExist._id,
                                    accountType: isEmailExist.accountType,
                                    author: isEmailExist.username
                        }

                        const accessToken = generateAccessToken(data);
                        const refreshToken = generateRefreshToken(data);

                        return res.status(200).json({
                                    message: "login Successfully",
                                    success: true,
                                    accessToken,
                                    refreshToken,
                                    role: isEmailExist.accountType,
                                    author: isEmailExist.username
                        });

            } catch (error) {
                        console.log(error)
                        return res.status(500).json({ message: error.message, success: false });
            }
}

exports.refresh = async (req, res) => {
            const authHeader = req.header['Authorization']
            const token = authHeader && authHeader.split(" ")[1]
            if (!token) return res.status(401).json({ success: false, message: "Please Login" })

            try {

                        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                                    if (err) {
                                                return res.status(403).json({ success: false, message: err.message })
                                    }
                                    const accessToken = generateAccessToken({
                                                id: user.id,
                                                accountType: user.accountType,
                                                athor: user.author
                                    });

                                    const refreshToken = generateRefreshToken({
                                                id: user.id,
                                                accountType: user.accountType,
                                                author: user.author
                                    })


                                    return res.status(200).json({
                                                success: false,
                                                message: "Token refreshed Successfully",
                                                accessToken,
                                                refreshToken,
                                                role: user.accountType,
                                                author: user.author
                                    })
                        });


            } catch (error) {
                        return res.status(500).json({ success: false, message: error.message })
            }
}

exports.switchProfile = async (req, res) => {
            const authorId = req.id;
            const authorAccountType = req.accountType;

            
            try {
                        const user = await User.findByIdAndUpdate(
                                    authorId,
                                    { accountType: authorAccountType === "buyer" ? "seller" : "buyer" },
                                    { new: true }
                        );

                        if (!user) return res.status(404).json({
                                    success: false, message: "User not found"
                        });

                        const data = {
                                    id: user._id,
                                    accountType: user.accountType,
                                    author: user.username,
                        }

                        const accessToken = generateAccessToken(data);

                        return res.status(200).json({
                                    success: true,
                                    message: `Switched to  ${user.accountType}`,
                                    accessToken,
                                    role: user.accountType,
                                    author: user.username
                        })
            } catch (error) {
                        return res.status(500).json({ success: false, message: "Interval Server error" })
            }
}

