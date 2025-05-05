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
        bank: data.bank || 0,
        total: (data.balance || 0) + (data.bank || 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10

    if (sortedUsers.length === 0) {
      return api.sendMessage("⚠ No balance records available.", event.threadID);
    }

    let namePromises = sortedUsers.map((user, index) =>
      new Promise(resolve => {
        api.getUserInfo(user.id, (err, info) => {
          const name = (!err && info[user.id] && info[user.id].name) ? info[user.id].name : `UID: ${user.id}`;
          resolve(
            `${index + 1}. 🏆 ${name}\n   🪙 Wallet: ${user.balance} | 🏦 Bank: ${user.bank} | 💼 Total: ${user.total}`
          );
        });
      })
    );

    Promise.all(namePromises).then(lines => {
      const message = `💰 Top 10 Richest Players:\n\n${lines.join("\n\n")}`;
      api.sendMessage(message, event.threadID);
    });
  }
};
