// THIS IS THE IMPORTANT COMMAND FOR OUR BOTFILES

const axios = require("axios");
const fs = require("fs");
const { exec } = require("child_process");

module.exports = {
    name: "update",
    description: "Check for updates and apply them.",
    usage: "/update",

    async run({ api, event }) {
        const updateUrl = "https://raw.githubusercontent.com/DeveloperOfGeoArchonMorax/Kagenou-Bot/main/package.json";
        const updateFilePath = "./package.json";

        try {
            // Fetch the latest update data
            const response = await axios.get(updateUrl);
            const latestUpdate = response.data;

            // Read the current version from the local package.json file
            let currentUpdate;
            try {
                currentUpdate = JSON.parse(fs.readFileSync(updateFilePath, "utf8"));
            } catch (err) {
                console.error("Error reading the local package.json file", err);
                return api.sendMessage("❌ Error reading local package information. Please try again later.", event.threadID);
            }

            // Check if the version is up to date
            if (latestUpdate.version === currentUpdate.version) {
                return api.sendMessage("✅ You are already using the latest version.", event.threadID);
            }

            // Prepare the update message
            const updateMessage = `⚡ A new update is available!\n\n` +
                `📌 Version: ${latestUpdate.version}\n\n` +
                `🔹 List of updates:\n${latestUpdate.changelog ? latestUpdate.changelog.join("\n") : "- No changelog provided -"}\n\n` +
                `➡ React to this message to confirm the update.`;

            api.sendMessage(updateMessage, event.threadID, (err, info) => {
                if (err) return console.error(err);

                // Listen for a reaction from the user to confirm the update
                global.client.reactionListener[info.messageID] = async ({ userID, messageID }) => {
                    if (userID === event.senderID) {
                        api.sendMessage("⏳ Updating... Please wait.", event.threadID);

                        // Run update command using exec
                        exec("git pull && npm install", (error, stdout, stderr) => {
                            if (error) {
                                console.error("Error executing update command", error);
                                return api.sendMessage(`❌ Update failed: ${error.message}`, event.threadID);
                            }

                            // Log the output and errors
                            if (stderr) {
                                console.error("stderr:", stderr);
                            }
                            console.log("stdout:", stdout);

                            // Notify the user that the update is complete and restart the bot
                            api.sendMessage("✅ Update completed! Restarting bot...", event.threadID, () => {
                                process.exit(1);
                            });
                        });
                    }
                };
            });
        } catch (error) {
            console.error("Update check error:", error);
            api.sendMessage("❌ Failed to check for updates. Please try again later.", event.threadID);
        }
    }
};
