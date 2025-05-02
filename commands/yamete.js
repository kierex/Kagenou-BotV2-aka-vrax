const fs = require("fs");
const path = require("path");

module.exports = {
    name: "yamete",
    author: "Vern",
    description: "Plays 'Yamete' sound when triggered.",
    nonPrefix: true,

    async run({ api, event }) {
        const { threadID, messageID, body } = event;

        // Check if the trigger word "yamete" is present
        if (!body || !/^yamete/i.test(body)) return;

        const audioPath = path.join(__dirname, "nopPrefix", "yamete.mp3");

        // Check if the audio file exists
        if (!fs.existsSync(audioPath)) {
            console.error("Audio file not found at:", audioPath);
            return api.sendMessage("❌ Audio file not found!", threadID, messageID);
        }

        try {
            // Send the audio as an attachment
            api.sendMessage({
                attachment: fs.createReadStream(audioPath)
            }, threadID, undefined, messageID);
        } catch (error) {
            console.error("Error sending audio file:", error);
            api.sendMessage("❌ An error occurred while sending the audio file.", threadID, messageID);
        }
    }
};
