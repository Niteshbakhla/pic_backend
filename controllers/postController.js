
const Post = require("../model/post")
const User = require("../model/user")



const createPost = async (req, res) => {


            const authorId = req.id;
            const authorAccountType = req.accountType;


            if (authorAccountType === "buyer") {
                        return res.status(403).json({ success: false, message: "Forbidden, only seller can post" })
            }

            const { title, author, price, image } = req.body;



            try {
                        const post = new Post({ title, author, price, image, authorId })

                        await post.save();

                        await User.findByIdAndUpdate(authorId, {
                                    $push: { uploads: post._id }
                        });



                        return res.status(201).json({ success: true, message: "Post created successfully", post })

            } catch (error) {
                        console.log(error)
                        return res.status(500).json({ success: false, message: error.message })
            }
}

const getAllPost = async (req, res) => {
            try {
                        const post = await Post.find({})
                        if (post.length === 0) return res.status(404).json({ success: false, message: "No post found!" })

                        return res.status(200).json({ success: true, data: post })

            } catch (error) {
                        return res.status(500).json({ success: false, message: error.message })
            }
}

const getMyPosts = async (req, res) => {

            const authorId = req.id;
            const authorAccountType = req.accountType;



            try {
                        if (authorAccountType.toLowerCase() === "buyer") {
                                    const { purchased } = await User.find(authorId).populate("purchased");
                                    if (!purchased) {
                                                return res.status(404).json({ success: false, message: "No post found" })
                                    }

                                    return res.status(200).json({ success: true, data: purchased })
                        }

                        if (authorAccountType.toLowerCase() === "seller") {
                                    const { uploads } = await User.findById(authorId).populate("uploads")
                                    if (!uploads) {
                                                return res.status(404).json({ success: false, message: error.message });
                                    }
                                    return res.status(200).json({ success: true, data: uploads })
                        }
            } catch (error) {
                        return res.status(500).json({ success: false, message: "internal sever error" })
            }
}

const deletePost = async (req, res) => {
            const { id } = req.params;

            try {
                        // Find the post by ID
                        const post = await Post.findById(id);
                        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

                        // Extract authorId from the found post
                        const { authorId } = post;

                        // Remove the post reference from the author's uploads
                        await User.findByIdAndUpdate(authorId, {
                                    $pull: { uploads: id }
                        }, { new: true });

                        // Delete the post
                        await Post.findByIdAndDelete(id);

                        // Send success response
                        return res.status(200).json({ success: true, message: "Post deleted successfully" });

            } catch (error) {
                        return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
}


const searchPost = async (req, res) => {
            const { search } = req.query;
            try {
                        const posts = await Post.find({ title: { $regex: search, $options: "i" } })
                        if (posts.length === 0) {
                                    return res.status(404).json({ success: false, message: "no post found" })
                        }

                        return res.status(200).json({ success: false, data: posts })

            } catch (error) {
                        return res.status(500).json({ success: false, message: "Internal Server Error" })
            }
}

const addToFavourites = async (req, res) => {
            const authorId = req.id;
            const { postId } = req.params;

            try {
                        // Find the user first
                        const user = await User.findById(authorId);

                        if (!user) {
                                    return res.status(404).json({ success: false, message: "User Not Found!" });
                        }

                        // Check if the post is already in favourites
                        if (user.favourites.includes(postId)) {
                                    return res.status(200).json({ success: false, message: "Post is already in favourites" });
                        }

                        // If not, add it using $addToSet
                        await User.findByIdAndUpdate(
                                    authorId,
                                    { $addToSet: { favourites: postId } }, // This ensures only unique items are added
                                    { new: true } // Returns the updated document
                        );

                        return res.status(200).json({ success: true, message: "Added to favourites" });
            } catch (error) {
                        return res.status(500).json({ success: false, message: "Internal server error" });
            }
};

const removeFromFavourites = async (req, res) => {
            const authorId = req.id
            const { postId } = req.params

            try {
                        const user = await User.findByIdAndUpdate(authorId, {
                                    $pull: { favourites: postId }
                        });

                        if (!user) {
                                    return res.status(404)
                                                .json({ success: false, message: "User Not Found!" })
                        }

                        return res.status(200).json({ success: true, message: "Removed from  favourite" })
            } catch (error) {
                        return res.status(500).json({ success: false, message: "Internal server error" })
            }
}


const getFavourites = async (req, res) => {
            const authorId = req.id;
            try {
                        const { favourites } = await User.findById(authorId).populate("favourites")
                        if (!favourites) {
                                    return res.status(404).json({ success: false, message: "No favourites added" })
                        }

                        return res.status(200).json({ success: true, data: favourites })
            } catch (error) {
                        return res.status(500).json({ success: false, message: "Internal Server Error" })
            }
}


const getPostByRange = async (req, res) => {

            const authorId = req.id;
            const authorAccountType = req.accountType;
            let data;

            try {
                        if (authorAccountType === "Buyer") {
                                    const { purchased } = await User.findById(authorId).populate("purchase")
                                    data = purchased;

                        } else {
                                    const { uploads } = await User.findById(authorId).populate("uploads")
                                    data = uploads;
                        }



                        if (!data) {
                                    return res.status(500).json({ success: false, message: "No posts found" })
                        }

                        const now = new Date();
                        const startOfYear = new Date(now.getFullYear(), 0, 1)
                        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
                        const startOfWeek = new Date(now.setDate(now.getDate(), now.getDay()))

                        const postOfThisYear = data.filter((post) => new Date(post.createdAt) >= startOfYear)
                        const postOfThisMonth = data.filter((post) => new Date(post.createdAt) >= startOfMonth)
                        const postOfThisWeek = data.filter((post) => new Date(post.createdAt) >= startOfWeek)


                        return res.status(200).json({
                                    success: true, data: {
                                                tillNow: data,
                                                thisYear: postOfThisYear,
                                                thisMonth: postOfThisMonth,
                                                thisWeek: postOfThisWeek
                                    }
                        })
            } catch (error) {
                        return res.status(500).json({ success: false, message: "Internal Server error" })
            }
}

module.exports = {
            createPost,
            getAllPost,
            getMyPosts,
            deletePost,
            searchPost,
            addToFavourites,
            removeFromFavourites,
            getFavourites,
            getPostByRange
}