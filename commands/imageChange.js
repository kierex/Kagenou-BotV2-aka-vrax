module.exports = {
  name: "imageChange",
  handleEvent: true,

  async handleEvent({ api, event }) {
    const { logMessageType, threadID } = event;

    // Check for thread icon (group image) change
    if (logMessageType === "log:thread-icon") {
      try {
        await api.sendMessage("🖼️ The group profile picture has been updated!", threadID);
      } catch (error) {
        console.error("Failed to send image change notification:", error.message);
      }
    }
  }
};
