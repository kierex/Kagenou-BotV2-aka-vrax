const { format, UNIRedux } = require("cassidy-styler");
const fs = require("fs-extra");
const path = require("path");
const balanceFile = path.join(__dirname, "../database/balance.json");

const adminID = ["100070577903608", "100010099516674"]; // Ensure all are strings

module.exports = {
  name: "user",
  author: "Aljur Pogoy",
  version: "3.0.0",
  description: "Give coins to a user (Admin only). Usage: ${prefix}user <uid> <amount>",

  async run({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    // Convert senderID to string for consistency
    const sender = String(senderID);

    if (!adminID.includes(sender)) {
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

    const targetUID = String(args[0]);
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
        fs.ensureFileSync(balanceFile);
        fs.writeFileSync(balanceFile, JSON.stringify({}, null, 2));
      }
      balanceData = JSON.parse(fs.readFileSync(balanceFile, "utf8"));
    } catch (err) {
      return api.sendMessage(
        format({
          title: "==== [ user ] ====",
          titlePattern: "==== {word} ====",
          content: "❌ Error reading balance file.",
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
      fs.writeFileSync(balanceFile, JSON.stringify(balanceData, null, 2));
    } catch (err) {
      return api.sendMessage(
        format({
          title: "==== [ user ] ====",
          titlePattern: "==== {word} ====",
          content: "❌ Failed to save updated balance.",
        }),
        threadID,
        messageID
      );
    }

    return api.sendMessage(
      format({
        title: "==== [ user ] ====",
        titlePattern: "==== {word} ====",
        content: `✅ Gave ${amount} coins to UID ${targetUID}.\nNew wallet balance: ${balanceData[targetUID].balance} coins.`,
      }),
      threadID,
      messageID
    );
  },
};
