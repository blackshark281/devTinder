const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["interested", "ignore"],
            message: `{VALUE} is not a valid status`
        },
        required: true
    }
}, {
    timestamps: true
});

connectionRequestSchema.index({ senderId: 1, receiverId: 1 });

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);