const fs = require("fs");

const balanceFile = "./database/balance.json";

module.exports = {
    name: "toprich",
    description: "Shows the top richest players.",
    usage: "/toprich",

    async run({ api, event }) {
        if (!fs.existsSync(balanceFile)) {
            return api.sendMessage("⚠ No balance data found!", event.threadID);
        }

        let balanceData;
        try {
            balanceData = JSON.parse(fs.readFileSync(balanceFile, "utf8"));
        } catch (error) {
            return api.sendMessage("⚠ Error reading balance data!", event.threadID);
        }

        // Normalize and sort users by total wealth
        let sortedUsers = Object.entries(balanceData)
            .map(([id, data]) => ({
                id,
                balance: data.balance || 0,
                bank: data.bank || 0
            }))
            .sort((a, b) => (b.balance + b.bank) - (a.balance + a.bank))
            .slice(0, 10); // Top 10

        if (sortedUsers.length === 0) {
            return api.sendMessage("⚠ No balance records available.", event.threadID);
        }

        let message = "💰 Top Richest Players:\n\n";

        let namePromises = sortedUsers.map(user =>
            new Promise(resolve => {
                api.getUserInfo(user.id, (err, info) => {
                    if (err || !info || !info[user.id]) {
                        return resolve(`🏆 UID: ${user.id}\n   🪙 Wallet: ${user.balance}\n   🏦 Bank: ${user.bank}`);
                    }

                    let name = info[user.id].name;
                    resolve(`🏆 ${name} (UID: ${user.id})\n   🪙 Wallet: ${user.balance}\n   🏦 Bank: ${user.bank}`);
                });
            })
        );

        Promise.all(namePromises).then(names => {
            message += names.join("\n\n");
            api.sendMessage(message, event.threadID);
        });
    }
};
