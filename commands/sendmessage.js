module.exports = {
    name: "sendmessage",
    description: "Send an anonymous message to a user by their UID.",
    author: "coffee",
    usage: "/sendmessage <UID> <message>",

    async execute(api, event, args, commands, prefix, admins, appState, sendMessage) {
        const { threadID } = event;

        // Extract user ID and message content from the arguments
        const userID = args[0];
        const messageContent = args.slice(1).join(" ");

        // Validate the user ID
        if (!userID || isNaN(userID)) {
            return sendMessage(api, { threadID, message: "⚠️ | Please provide a valid **User ID (UID)**." });
        }

        // Validate the message content
        if (!messageContent) {
            return sendMessage(api, { threadID, message: "⚠️ | Please provide a **message** to send." });
        }

        // Format the message to send
        const formattedMessage = `📩 | Message from an anonymous person\n\n${messageContent}\n\n___________________________________________________\n📒: *This bot is for educational purposes only.*`;

        try {
            // Send the message to the target user
            await sendMessage(api, { threadID: userID, message: formattedMessage });

            // Acknowledge the sender
            sendMessage(api, { threadID, message: `✅ | Your message has been sent to **${userID}**.` });
        } catch (error) {
            console.error("Error sending message:", error);

            // Notify the sender about the failure
            sendMessage(api, { threadID, message: "❌ | Failed to send the message. Please check the UID and try again." });
        }
    }
};