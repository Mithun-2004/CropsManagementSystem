const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    name : {type:String},
    messages : [{
        sender: "string",
        text: "string",
        sentAt: {
            type: Date,
            default: Date.now
          }
    }]
})

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;