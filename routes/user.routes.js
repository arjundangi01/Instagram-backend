const express = require("express");
const bcrypt = require("bcrypt");
const { authentication } = require("../middlewares/authentication.middleware");
const UserModel = require("../model/user.model");

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

userRouter.post("/signup", async (req, res) => {
  let { profileImage, userName, name, email, phone, password } = req.body;

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    if (err) {
      res.status(500).send({ msg: "error creating user/try again" });
    }
    try {
      profileImage = profileImage
        ? profileImage
        : "https://www.beelights.gr/assets/images/empty-image.png";
      await UserModel.create({
        userName,
        name,
        email,
        phone,
        password: hash,
        profileImage,
      });
      res.send({ msg: "user created successfully" });
    } catch (err) {
      res.status(500).send({ msg: "internal server error/missing parameter" });
    }
  });
});

module.exports = userRouter;
