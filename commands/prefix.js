const fs = require("fs");
const path = require("path");

module.exports = {
    name: "prefix",
    author: "Vern AKA Vraxy",
    nonPrefix: true,
    description: "Shows the bot's current prefixes for all systems.",

    async run({ api, event }) {
        try {
            // Helper function to load a configuration file and return the prefix
            const loadPrefix = (configPath, defaultPrefix) => {
                if (fs.existsSync(configPath)) {
                    try {
                        const config = require(configPath);
                        return config.Prefix?.[0] || defaultPrefix;
                    } catch (error) {
                        console.error(`Error loading config file at ${configPath}:`, error);
                        return defaultPrefix; // Fallback to default if parsing fails
                    }
                }
                return defaultPrefix; // Fallback to default if file doesn't exist
            };

            // Define configuration file paths and defaults
            const mainConfigPath = path.join(__dirname, "..", "config.json");
            const tokitoConfigPath = path.join(__dirname, "..", "tokito-system", "config.json");
            const cidConfigPath = path.join(__dirname, "..", "cid-kagenou-system", "config.json");
            const vipConfigPath = path.join(__dirname, "..", "system", "config.json");

            // Load prefixes with defaults
            const mainPrefix = loadPrefix(mainConfigPath, "/");
            const tokitoPrefix = loadPrefix(tokitoConfigPath, "?");
            const cidPrefix = loadPrefix(cidConfigPath, "!");
            const vipPrefix = loadPrefix(vipConfigPath, "+");

            // Construct the response message
            const message =
                "📌 **System Prefix Information**\n\n" +
                `🌐 Main System Prefix: **${mainPrefix}**\n` +
                `👾 Tokito System Prefix: **${tokitoPrefix}**\n` +
                `🗡️ Vern-vraxy System Prefix: **${cidPrefix}**\n` +
                `🎭 VIP System Prefix: **${vipPrefix}**\n\n` +
                "💡 To use commands, type the system prefix followed by the command name.";

            // Send the message
            api.sendMessage(message, event.threadID, event.messageID);

        } catch (error) {
            console.error("Error loading prefixes:", error);
            api.sendMessage("❌ Failed to load prefixes. Please try again later.", event.threadID, event.messageID);
        }
    }
};