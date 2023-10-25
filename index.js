const express = require("express");
const cors = require("cors")

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
app.use('/users',userRouter)
app.use('/posts',postRouter)
app.use('/comments',commentRouter)
app.use('/notifications',notificationRouter)
app.use('/followers',followerRouter)

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`server running on ${PORT}`);
  } catch (error) {
    console.log("error while listening", error);
  }
});