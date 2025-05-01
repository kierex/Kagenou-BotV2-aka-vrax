module.exports = {
    name: "welcome",
    handleEvent: true,

    async handleEvent({ api, event }) {
        if (event.logMessageType === "log:subscribe") {
            const threadID = event.threadID;
            const addedUsers = event.logMessageData.addedParticipants;

            if (!addedUsers || addedUsers.length === 0) return;

            if (addedUsers.some(user => user.userFbId === api.getCurrentUserID())) {
                return api.sendMessage("Hello! I'm your bot. Type /help to see my commands!", threadID);
            }
            let mentions = [];
            let names = [];

            for (const user of addedUsers) {
                mentions.push({
                    tag: user.fullName,
                    id: user.userFbId
                });
                names.push(`@${user.fullName}`);
            }
            const welcomeMessage = `⚙️ Welcome ante ${names.join(", ")} wag ka mag leave ha tanginmo! ito ka talaga sa'kin 🖕!`;
            api.sendMessage({ body: welcomeMessage, mentions }, threadID);
        }
    }
};
