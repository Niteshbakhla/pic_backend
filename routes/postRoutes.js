const { createPost,
            getAllPost,
            getMyPosts,
            deletePost,
            searchPost,
            addToFavourites,
            removeFromFavourites,
            getFavourites,
            getPostByRange } = require("../controllers/postController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/post/create", verifyToken, createPost);
router.get("/post/getAll", getAllPost)
router.get("/post/", verifyToken, getMyPosts)
router.delete("/post/delete/:id", verifyToken, deletePost);
router.get("/posts/search", searchPost)
router.put("/posts/addToFavourites/:postId", verifyToken, addToFavourites)
router.put("/posts/removeFavourites/:postId", verifyToken, removeFromFavourites)
router.get("/post/favourite", verifyToken, getFavourites)
router.get("/post/getPostByDateRange", verifyToken, getPostByRange)
module.exports = router