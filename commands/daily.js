const fs = require("fs");
const path = require("path");

const balancePath = path.join(__dirname, "..", "database", "balance.json");
const cooldownPath = path.join(__dirname, "..", "database", "dailyCooldown.json");

module.exports = {
    name: "daily",
    description: "Claim your daily free coins!",
    usage: "/daily",

    run: async ({ api, event }) => {
        // Ensure JSON files exist
        if (!fs.existsSync(balancePath)) fs.writeFileSync(balancePath, "{}");
        if (!fs.existsSync(cooldownPath)) fs.writeFileSync(cooldownPath, "{}");

        const balanceData = JSON.parse(fs.readFileSync(balancePath));
        const cooldownData = JSON.parse(fs.readFileSync(cooldownPath));

        const userID = event.senderID;
        const now = Date.now();
        const dailyAmount = Math.floor(Math.random() * (500 - 200 + 1)) + 200; // 200–500 coins
        const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours

        // Initialize user balance if not present
        if (!balanceData[userID]) {
            balanceData[userID] = { balance: 1000, bank: 0 };
        }

        // Check cooldown
        if (cooldownData[userID] && now - cooldownData[userID] < cooldownTime) {
            const remainingTime = cooldownTime - (now - cooldownData[userID]);
            const hours = Math.floor(remainingTime / (60 * 60 * 1000));
            const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

            return api.sendMessage(
                `⏳ You've already claimed your daily reward!\nCome back in ${hours}h ${minutes}m.`,
                event.threadID
            );
        }

        // Grant daily reward
        balanceData[userID].balance += dailyAmount;
        cooldownData[userID] = now;

        // Save updated data
        fs.writeFileSync(balancePath, JSON.stringify(balanceData, null, 2));
        fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData, null, 2));

        return api.sendMessage(
            `🎁 Daily Reward Claimed!\n\n💰 You received: ${dailyAmount} coins\n💸 New Balance: ${balanceData[userID].balance} coins`,
            event.threadID
        );
    }
};
