const fs = require("fs");
const path = require("path");

module.exports = {
    name: "addadmin",
    category: "Admin",
    description: "Adds a new user as an admin.",
    usage: "/addadmin <userID>",
    execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
        const { threadID, senderID } = event;

        // Validate if sender is an admin
        if (!admins.includes(senderID)) {
            return sendMessage(api, {
                threadID,
                message: "❌ You are not an admin.",
            });
        }

        // Validate the provided user ID
        const newAdminID = args[0];
        if (!newAdminID || isNaN(newAdminID)) {
            return sendMessage(api, {
                threadID,
                message: "⚠ Please provide a valid user ID to add as an admin.",
            });
        }

        // Check if the user is already an admin
        if (admins.includes(newAdminID)) {
            return sendMessage(api, {
                threadID,
                message: "⚠ This user is already an admin.",
            });
        }

        // Add the user to the admin list
        admins.push(newAdminID);

        // Path to admin storage (adjust as necessary for your setup)
        const adminFilePath = path.join(__dirname, "..", "config", "admins.json");

        try {
            // Save updated admin list to file
            fs.writeFileSync(adminFilePath, JSON.stringify(admins, null, 2));
        } catch (error) {
            console.error("Error saving admin list:", error);
            return sendMessage(api, {
                threadID,
                message: "❌ Failed to save the admin list. Please try again later.",
            });
        }

        // Notify success
        sendMessage(api, {
            threadID,
            message: `✅ Successfully added ${newAdminID} as an admin.`,
        });
    },
};