const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

       // Querying the database to find messages between the specified sender and receiver
    const messages = await Messages.find({
      users: {
        $all: [from, to], // $all operator ensures that both sender and receiver IDs are present in the users array field.
      },
    }).sort({ updatedAt: 1 }); // This sorts the retrieved messages by their updatedAt field in ascending order

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from, // fromSelf property indicating whether the sender is the same as the current user 
        message: msg.message.text, // message property containing the text content of the message.
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body; 
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });

    
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
