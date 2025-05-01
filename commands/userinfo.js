module.exports = {
    name: "userinfo",
    description: "Displays your user information.",

    async run({ api, event }) {
        const { senderID, threadID } = event;

        try {
            // Fetch user information
            const userInfo = await api.getUserInfo(senderID);
            const user = userInfo[senderID];

            // Handle missing data gracefully
            const name = user.name || "Unknown";
            const gender = user.gender === 1 ? "Female" : user.gender === 2 ? "Male" : "Unknown";
            const profileUrl = user.profileUrl || "Not available";

            // Construct the message
            const message = `👤 User Info\n\n` +
                `🔹 Name: ${name}\n` +
                `🔹 User ID: ${senderID}\n` +
                `🔹 Gender: ${gender}\n` +
                `🔹 Profile URL: ${profileUrl}`;

            // Send the message
            api.sendMessage(message, threadID);
        } catch (error) {
            console.error("Error fetching user info:", error);

            // Notify the user about the failure
            api.sendMessage("❌ Failed to fetch user info. Please try again later.", threadID);
        }
    }
};