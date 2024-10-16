const { Router } = require("express");

const {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
} = require("../Controllers/postController");

const authMiddleWare = require("../Middleware/authMiddleWare");

const router = Router();

router.post("/", authMiddleWare, createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/categories/:category", getCatPosts);
router.get("/users/:id", getUserPosts);
router.patch("/:id", authMiddleWare, editPost);
router.delete("/:id", authMiddleWare, deletePost);

module.exports = router;


