const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  name: "deepseek",
  category: "AI",
  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID, senderID, attachments } = event;

    const userID = senderID || Math.floor(Math.random() * 10000);
    const question = args.join(" ") || "Hello";
    const apiUrl = `https://kaiz-apis.gleeze.com/api/deepseek-v3?ask=${encodeURIComponent(question)}&uid=${userID}`;

    try {
      if (attachments && attachments.length > 0) {
        const image = attachments[0];

        if (image.type === "photo") {
          const tempFilePath = path.join(__dirname, "temp_image.jpg");
          const imageRequest = await axios.get(image.url, { responseType: "stream" });
          const imageStream = fs.createWriteStream(tempFilePath);

          // Wait for stream to finish writing
          await new Promise((resolve, reject) => {
            imageRequest.data.pipe(imageStream);
            imageStream.on("finish", resolve);
            imageStream.on("error", reject);
          });

          const formData = new FormData();
          formData.append("file", fs.createReadStream(tempFilePath));

          const response = await axios.post(apiUrl, formData, {
            headers: formData.getHeaders(),
          });

          sendMessage(api, {
            threadID,
            message: response.data.response || "I couldn't analyze the image.",
          });

          fs.unlinkSync(tempFilePath); // Clean up temp file
        } else {
          sendMessage(api, { threadID, message: "❌ Please send an image!" });
        }
      } else {
        const response = await axios.get(apiUrl);
        sendMessage(api, {
          threadID,
          message: response.data.response || "I couldn't understand your question.",
        });
      }
    } catch (error) {
      console.error("Error using Deepseek AI:", error);
      sendMessage(api, { threadID, message: "❌ Deepseek AI is unavailable." });
    }
  },
};
