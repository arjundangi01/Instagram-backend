const express = require("express");
const PostModel = require("../model/post.model");
const FollowerModel = require("../model/follower.model");
const UserModel = require("../model/user.model");

const postRouter = express.Router();

//getting post for homepage if user  logged in
postRouter.get("/private", async (req, res) => {
  const { userId } = req.userId;
  //   const userId = "user1";

  const { page, limit } = req.query;

  const findUserFollowsTo = await FollowerModel.find(
    { followedBy: userId },
    { _id: 0, followedBy: 0, __v: 0 }
  );
  const followedUserIds = findUserFollowsTo.map((ele) => ele.followedTo);
  //  console.log(followedUserIds,findUserFollowsTo )
  const followedUserPosts = await PostModel.find({
    authorId: { $in: followedUserIds },
  })
    .skip(page * limit - limit)
    .limit(limit);

  const remainingPosts = await PostModel.find({
    authorId: { $nin: followedUserIds },
  })
    .skip(page * limit - limit)
    .limit(limit);
  //   console.log(followedUserPosts);
  followedUserPosts.sort((a, b) => b.createdAt - a.createdAt);
  remainingPosts.sort((a, b) => b.createdAt - a.createdAt);
  const combinedPost = followedUserPosts.concat(remainingPosts);
  // combinedPost.sort((a, b) => b.createdAt - a.createdAt);
  res.send(combinedPost);
});

//getting post for homepage if user not logged in
postRouter.get("/public", async (req, res) => {
  const { page, limit } = req.query;
  const allPostFromDB = await PostModel.find({})
    .skip(page * limit - limit)
    .limit(limit);
  res.send(allPostFromDB);
});

// getting all post of particular user
postRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const allPostOfUser = await PostModel.find({ authorId: userId });
  res.send(allPostOfUser);
});

// getting single post
postRouter.get("/post:postId", async (req, res) => {
  const { postId } = req.params;
  const retrievedPost = await PostModel.findOne({ _id: postId });
  const authorId = retrievedPost.authorId;
  const authorOfPost = await UserModel.findOne({ _id: authorId });
  res.send({ post: retrievedPost, user: authorOfPost });
});

postRouter.post("/", async (req, res) => {
  try {
    const userId = req.userId;
    // const userId = "aman";

    const input = req.body;
    const newObj = { ...input, authorId: userId };
    const newPostAddedToDataBase = await PostModel.create(newObj);
    res.send({ message: "Post Added", newPost: newPostAddedToDataBase });
  } catch (error) {
    console.log("error while creating new Post", error);
  }
});

postRouter.delete("/:postId", async (req, res) => {
  try {
    const userId = req.userId;
    // const userId = 'user1';
    const { postId } = req.params;

    const checkForPostPresentInDB = await PostModel.findOne({
      _id: postId,
    });
    if (!checkForPostPresentInDB) {
      return res
        .status(404)
        .send({ message: "The post you're trying to delete does not exist" });
    }

    const checkForUserRelateToPost = await PostModel.findOne({
      _id: postId,
      authorId: userId,
    });

    if (!checkForUserRelateToPost) {
      return res
        .status(404)
        .send({ message: "You can only delete your own posts" });
    }

    await PostModel.deleteOne({ _id: postId });
    res.send({ message: "Post Deleted" });
  } catch (error) {}
});

module.exports = postRouter;