const axios = require("axios");

module.exports = {
  name: "translator",
  category: "Utility",
  author: "Vern Esg",

  execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
    const { threadID } = event;

    if (args.length < 2) {
      return sendMessage(api, {
        threadID,
        message: "❌ Usage: /translator <language_code> <text>\nExample: /translator en Hola"
      });
    }

    const language = args.shift().toLowerCase();
    const text = args.join(" ");

    try {
      const response = await axios.post("https://libretranslate.de/translate", {
        q: text,
        source: "auto",
        target: language,
        format: "text"
      }, {
        headers: { "Content-Type": "application/json" }
      });

      const translated = response.data.translatedText;

      if (!translated) {
        return sendMessage(api, {
          threadID,
          message: "❌ Translation failed. Please try again later!"
        });
      }

      sendMessage(api, {
        threadID,
        message: `✅ Translated to [${language}]:\n${translated}`
      });

    } catch (error) {
      console.error("Translator API Error:", error.message);
      sendMessage(api, {
        threadID,
        message: "❌ Error translating text. The translation service might be unavailable."
      });
    }
  },
};
