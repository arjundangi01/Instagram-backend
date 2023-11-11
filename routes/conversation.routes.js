const conversationModel = require("../model/conversation.model");

const conversationRouter = require("express").Router();

conversationRouter.post("/", async (req, res) => {
  try {
    const newConversation = await conversationModel.create({
      members: [req.body.senderId, req.body.receiverId],
    });
    res.status(200).json(newConversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
});

conversationRouter.get("/:userId", async (req, res) => {
  try {
    const userConversations = await conversationModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(userConversations);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

module.exports = conversationRouter;
