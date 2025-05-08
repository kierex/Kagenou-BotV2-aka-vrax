const axios = require("axios");

module.exports = {
  name: "spamsms",
  category: "Fun",
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID } = event;

    // Check if the user provided enough arguments
    if (args.length < 4) {
      return sendMessage(api, {
        threadID,
        message: "❌ Usage: /spamsms <phone> <count> <interval_in_seconds>\nExample: /spamsms 0123456789 5 10",
      });
    }

    // Extract parameters
    const phone = args[1];
    const count = parseInt(args[2], 10);
    const interval = parseInt(args[3], 10);

    // Validate inputs
    if (!/^\d+$/.test(phone)) {
      return sendMessage(api, {
        threadID,
        message: "❌ Invalid phone number. Digits only.",
      });
    }

    if (isNaN(count) || isNaN(interval) || count <= 0 || interval <= 0) {
      return sendMessage(api, {
        threadID,
        message: "❌ Count and interval must be positive numbers.",
      });
    }

    try {
      // Correct the API URL format
      const apiUrl = `https://kaiz-apis.gleeze.com/api/spamsms?phone=${phone}&count=${count}&interval=${interval}`;

      const response = await axios.get(apiUrl);

      if (response.data.success) {
        sendMessage(api, {
          threadID,
          message: `✅ Successfully sent ${count} spam SMS to ${phone} every ${interval} seconds.`,
        });
      } else {
        sendMessage(api, {
          threadID,
          message: `❌ API error: ${response.data.message || "Unknown error"}`,
        });
      }
    } catch (error) {
      console.error("Error in spamsms command:", error.message);
      sendMessage(api, {
        threadID,
        message: `❌ Failed to send spam SMS. Error: ${error.message}`,
      });
    }
  },
};
