const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const commentRouter = require("./routes/comment.routes");
const notificationRouter = require("./routes/notification.routes");
const followerRouter = require("./routes/follower.routes");

// --------------------
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(express.json());
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/notifications", notificationRouter);
app.use("/followers", followerRouter);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),

  function (req, res) {
    // Successful authentication, redirect home.
    const token = req.token;
    res.cookie("insta_token", token, {
      httpOnly: false,
      sameSite: "lax",
    });
    res.redirect(`http://localhost:3000`);
  }
);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`server running on ${PORT}`);
    console.log("database connected");
  } catch (error) {
    console.log("error while listening", error);
  }
});