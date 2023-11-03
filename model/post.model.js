const { default: mongoose } = require("mongoose");

const postSchema = mongoose.Schema(
  {
    mediaUrl: {
      required: true,
      type: String,
    },
    authorId: {
      required: true,
      type: String,
    },
    caption: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("instagram_post", postSchema);
module.exports = PostModel;
