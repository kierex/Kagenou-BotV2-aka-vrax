module.exports = {
    name: "autoReact",
    handleEvent: true,

    async handleEvent({ api, event }) {
        const { messageID, body, threadID } = event;

        if (!body || typeof body !== "string") return;

        const reactions = {
            "hello": "👋",
            "hi": "👋",
            "lol": "😂",
            "haha": "🤣",
            "love": "❤️",
            "wow": "😲",
            "sad": "😢",
            "angry": "😡",
            "bot": "🤖",
            "good morning": "🌅",
            "good night": "🌙",
            "thanks": "🙏",
            "prefix": "👾"
        };

        const lowerBody = body.toLowerCase();

        for (const keyword in reactions) {
            if (lowerBody.includes(keyword)) {
                try {
                    await api.setMessageReaction(reactions[keyword], messageID, () => {}, true);
                } catch (error) {
                    console.error("Failed to set reaction:", error);
                }
                break; // Stops after the first match
            }
        }
    }
};
