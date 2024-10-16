const Post = require("../models/PostModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");

const createPost = async (req, res, next) => {
  const { title, category, description } = req.body;
  if (!title || !category || !description)
    return next(new HttpError("Fill in all the fields", 422));

  const { thumbnail } = req.files;
  if (thumbnail.size > 200000) {
    return next(
      new HttpError("Thumbnail too big, file should be less than 2mb.", 422)
    );
  }
  let filename = thumbnail.name;
  let splittedName = filename.split(".");
  let newFileName =
    splittedName[0] + uuid() + "." + splittedName[splittedName.length - 1];
  thumbnail.mv(
    path.join(__dirname, "..", "/uploads", newFileName),
    async (err) => {
      if (err) {
        return next(new HttpError(err));
      } else {
        const newPost = await Post.create({
          title,
          category,
          description,
          thumbnail: newFileName,
          creator: req.user.id,
        });
        if (!newPost)
          return next(new HttpError("Post couldn't be created", 422));
        const currentUser = await User.findById(req.user.id);
        const userPostCount = currentUser.posts + 1;
        await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
        res.status(201).json(newPost);
      }
    }
  );
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(await Post.findById(id));

    const post = await Post.findById(id);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const CatPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(CatPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userPosts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(userPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const editPost = async (req, res, next) => {
  try {
    let fileName;
    let newFileName;
    let updatedPost;
    const postId = req.params.id;
    let { title, category, description } = req.body;
    if (!title || !category || description.length < 12)
      return next(new HttpError("Fill in all the fields", 422));

    if (!req.files) {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, description },
        { new: true }
      );
    } else {
      let oldPost = await Post.findById(postId);
      if (req.user.id == oldPost.creator) {
        fs.unlink(
          path.join(__dirname, "..", "uploads", oldPost.thumbnail),
          async (err) => {
            if (err) return next(new HttpError(err));
          }
        );
        const { thumbnail } = req.files;
        if (thumbnail.size > 2000000)
          return next(
            new HttpError("Thumbnail too big, file should be less than 2mb")
          );
        fileName = thumbnail.name;
        let splittedFileName = fileName.split(".");
        newFileName =
          splittedFileName[0] +
          uuid() +
          "." +
          splittedFileName[splittedFileName.length - 1];
        thumbnail.mv(
          path.join(__dirname, "..", "uploads", newFileName),
          async (err) => {
            if (err) {
              return next(new HttpError(err));
            }
          }
        );
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { title, category, description, thumbnail: newFileName },
          { new: true }
        );
      }
    }
    if (!updatedPost) return next(new HttpError("Couldn't update post", 400));
    res.status(200).json(updatedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const deletePost = async (req, res, next) => {
  try {
    let postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post Not Found", 400));
    }
    const post = await Post.findById(postId);
    const fileName = post?.thumbnail;
    if (req.user.id == post.creator) {
      fs.unlink(
        path.join(__dirname, "..", "uploads", fileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          } else {
            await Post.findByIdAndDelete(postId);

            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser?.posts - 1;
            res.json(`Post ${postId} has deleted successfully`);
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
          }
        }
      );
    } else {
      return next(new HttpError("Post couldn't be deleted"));
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
};
