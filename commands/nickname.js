const config = require("../config.json");

module.exports = {
    name: "nickname",
    handleEvent: true,

    async handleEvent({ api, event }) {
        try {
            // Check if the event is a subscription (user added to the thread)
            if (
                event.logMessageType === "log:subscribe" &&
                event.logMessageData.addedParticipants.some(user => user.userFbId === api.getCurrentUserID())
            ) {
                // Get the bot's ID and name
                const botID = api.getCurrentUserID();
                const botName = config.botName || "Bot";

                // Change the nickname of the bot in the thread
                api.changeNickname(botName, event.threadID, botID, (err) => {
                    if (err) {
                        console.error("Failed to set nickname:", err);
                    } else {
                        console.log(`Successfully set bot nickname to "${botName}" in thread ${event.threadID}`);
                    }
                });
            }
        } catch (error) {
            // Log any unexpected errors
            console.error("Error in nickname event handler:", error);
        }
    }
};