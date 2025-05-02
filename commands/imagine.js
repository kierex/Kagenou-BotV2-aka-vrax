const axios = require('axios');

module.exports = {
  name: 'imagine',
  category: 'AI',

  execute: async ({ api, event, args, sendMessage }) => {
    const { threadID } = event;
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return sendMessage(api, {
        threadID,
        message: '❌ Please enter a prompt to generate an image.\nUsage: /imagine <prompt>',
      });
    }

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/imagine?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (!response.data || !response.data.imageUrl) {
        return sendMessage(api, {
          threadID,
          message: '⚠️ Failed to generate an image. Please try a different prompt.',
        });
      }

      sendMessage(api, {
        threadID,
        message: `🖼️ Imagine AI Image:\n${response.data.imageUrl}`,
      });
    } catch (error) {
      console.error('❌ Error in imagine command:', error.message);
      sendMessage(api, {
        threadID,
        message: '⚠️ Oops! Something went wrong while generating the image. Please try again later.',
      });
    }
  },
};
