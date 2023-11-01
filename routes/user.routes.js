const express = require("express");
const bcrypt = require("bcrypt");
const { authentication } = require("../middlewares/authentication.middleware");
const UserModel = require("../model/user.model");
const checkUser = require("../middlewares/userMiddlewares/checkUser.middleware");
const jwt = require("jsonwebtoken");
const FollowerModel = require("../model/follower.model");

const userRouter = express.Router();
const saltRounds = 10;
userRouter.get("/", authentication, async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.userId });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ msg: "user not found" });
    }
  } catch (err) {
    res.status(500).send({ msg: "internal server error" });
  }
});
userRouter.get("/single/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send({ msg: "user not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ msg: "internal server error" });
  }
});
userRouter.get("/unfollowedUsers", authentication, async (req, res) => {
  try {
    const followers = await FollowerModel.distinct("followedBy", {
      followedTo: req.userId,
    });
    const following = await FollowerModel.distinct("followedTo", {
      followedBy: req.userId,
    });
    const unfollowedUsers = await UserModel.find({ _id: { $nin: following } });
    console.log(unfollowedUsers);
    res.send(unfollowedUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "internal server error" });
  }
});

userRouter.get("/search", async (req, res) => {
  try {
    const { input } = req.body;

    const regexp = new RegExp(input, "i");

    const searchedUsers = await UserModel.find({
      $or: [{ name: { $regex: regexp } }, { userName: { $regex: regexp } }],
    });

    res.send(searchedUsers);
  } catch (err) {
    console.log(err);
  }
});

userRouter.post("/signup", checkUser, async (req, res) => {
  let { profileImage, userName, name, email, phone, password, bio } = req.body;

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    if (err) {
      res.status(500).send({ msg: "error creating user/try again" });
    }
    try {
      profileImage = profileImage
        ? profileImage
        : "https://www.beelights.gr/assets/images/empty-image.png";
      await UserModel.create({
        bio,
        userName,
        name,
        email,
        phone,
        password: hash,
        profileImage,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
      });
      res.send({ msg: "user created successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: "internal server error/missing parameter" });
    }
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    bcrypt.compare(password, user.password, async function (err, result) {
      if (err || !result) {
        return res.send("please signup first");
      } else {
        const userObj = {
          userId: user._id,
        };
        const token = jwt.sign(userObj, "secretkey");
        res.cookie("insta_token", token, {
          httpOnly: false,
          sameSite: "lax",
        });
        res.send({ msg: "logged in successfully", token });
      }
    });
  } else {
    res.status(404).send({ msg: "user not found" });
  }
});

module.exports = userRouter;