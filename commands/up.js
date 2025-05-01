const os = require('os');

module.exports = {
  name: 'uptime',
  description: 'Shows the uptime of the bot.',
  author: 'coffee',
  usage: '/uptime',

  async execute(api, event, args, commands, prefix, admins, appState, sendMessage) {
    const { threadID } = event;

    // Calculate uptime in seconds, minutes, hours, and days
    const uptimeSeconds = process.uptime();
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    const uptimeDays = Math.floor(uptimeHours / 24);

    // Format the uptime message
    const uptimeMessage = `🤖 **Vern x vraxy Bot Uptime**\n` +
      `📅 Days: ${uptimeDays}\n` +
      `⏰ Hours: ${uptimeHours % 24}\n` +
      `🕒 Minutes: ${uptimeMinutes % 60}\n` +
      `⏱️ Seconds: ${Math.floor(uptimeSeconds % 60)}`;

    // Send the uptime message
    sendMessage(api, { threadID, message: uptimeMessage });
  },
};