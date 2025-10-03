import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

// send message
const sendMessage = asyncHandler(async (req, res) => {
    const senderId = req?.user?._id;
    const receiverId = req?.params?.id;
    const { message } = req?.body;

    let gotConversation = await Conversation.findOne({
        participants: {
            $all: [senderId, receiverId],
        },
    });

    if (!gotConversation) {
        gotConversation = await Conversation.create({
            participants: [senderId, receiverId],
        });
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
    });

    if (newMessage) {
        gotConversation.messages.push(newMessage._id);
    }

    await Promise.all([gotConversation.save(), newMessage.save]);

    // SOCKET IO (Later)
});

// get message
const getMessage = asyncHandler(async (req, res) => {
    const receiverId = req.params?.id;
    const senderId = req?.user?._id;
    const conversation = await Conversation.findOne({
        participants: {
            $all: [senderId, receiverId],
        },
    }).populate("messages");

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                messages: conversation?.messages,
            },
            "All messages between the sender and receiver are returned."
        )
    );
});

export { sendMessage, getMessage };
