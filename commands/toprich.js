const { format, UNIRedux } = require("cassidy-styler");
const fs = require("fs-extra");
const path = require("path");
const balanceFile = path.join(__dirname, "../database/balance.json");

const adminID = ["100010099516674"];

module.exports = {
  name: "user",
  author: "vrax",
  version: "3.0.0",
  description: "Give coins to a user (Admin only). Usage: #user <uid> <amount>",

  async run({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    if (!adminID.includes(senderID)) {
      return api.sendMessage(
        format({
          title: "==== [ user ] ====",
          titlePattern: "==== {word} ====",
          content: "❌ Only developer can use this command.",
        }),
        threadID,
        messageID
      );
    }

    if (args.length < 2 || isNaN(args[1])) {
      return api.sendMessage(
        format({
          title: "==== [ user ] ====",
          titlePattern: "==== {word} ====",
          content: "❌ Usage: #user <uid> <amount>\nExample: #user 1234567890 100",
        }),
        threadID,
        messageID
      );
    }

    const targetUID = args[0];
    const amount = parseInt(args[1]);

    if (amount <= 0) {
      return api.sendMessage(
        format({
          title: "==== [ user ] ====",
          titlePattern: "==== {word} ====",
          content: "❌ Amount must be greater than 0.",
        }),
        threadID,
        messageID
      );
    }

    let balanceData = {};
    try {
      if (!fs.existsSync(balanceFile)) {
        await fs.writeJson(balanceFile, {});
      }
      balanceData = await fs.readJson(balanceFile);
    } catch (err) {
      console.error("Failed to read balance file:", err);
      return api.sendMessage(
        format({
          title: "==== [ user ] ====",
          titlePattern: "==== {word} ====",
          content: "❌ Failed to read or initialize balance file.",
        }),
        threadID,
        messageID
      );
    }

    if (!balanceData[targetUID]) {
      balanceData[targetUID] = { balance: 0, bank: 0 };
    }

    balanceData[targetUID].balance += amount;

    try {
      await fs.writeJson(balanceFile, balanceData, { spaces: 2 });
    } catch (err) {
      console.error("Failed to write balance file:", err);
      return api.sendMessage(
        format({
          title: "==== [ user ] ====",
          titlePattern: "==== {word} ====",
          content: "❌ Failed to save new balance.",
        }),
        threadID,
        messageID
      );
    }

    return api.sendMessage(
      format({
        title: "==== [ user ] ====",
        titlePattern: "==== {word} ====",
        content: `✅ Gave ${amount} coins to UID ${targetUID}. 💰\nNew wallet balance: ${balanceData[targetUID].balance} coins.`,
      }),
      threadID,
      messageID
    );
  },
};
