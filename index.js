const express = require("express");

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
app.use('/user',userRouter)
app.use('/post',postRouter)
app.use('/comment',commentRouter)
app.use('/notification',notificationRouter)
app.use('/follower',followerRouter)

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`server running on ${PORT}`);
  } catch (error) {
    console.log("error while listening", error);
  }
});