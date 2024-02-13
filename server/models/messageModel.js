const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array, // used to store an array of user IDs associated with the message. have field 'from' and 'to' each have users
    
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  // createdAt and updatedAt. These fields will automatically store the timestamp of when the document was created and last updated
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
