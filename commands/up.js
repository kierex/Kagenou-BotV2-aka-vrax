const fs = require('fs');
const path = require('path');

const uptimePath = path.join(__dirname, 'uptime.json');

// Load uptime from file or initialize
function loadUptimeData() {
  if (!fs.existsSync(uptimePath)) {
    fs.writeFileSync(uptimePath, JSON.stringify({ totalUptime: 0 }, null, 2));
  }
  try {
    const data = fs.readFileSync(uptimePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading uptime file:', err);
    return { totalUptime: 0 };
  }
}

function saveUptimeData(data) {
  try {
    fs.writeFileSync(uptimePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving uptime file:', err);
  }
}

let uptimeData = loadUptimeData();
let sessionStartTime = Date.now();

// Save uptime every 60 seconds
const saveInterval = setInterval(() => {
  const now = Date.now();
  const sessionUptime = (now - sessionStartTime) / 1000;
  uptimeData.totalUptime += sessionUptime;
  sessionStartTime = now; // Reset for next interval
  saveUptimeData(uptimeData);
}, 60000); // 60 seconds

// Save and cleanup on exit
function cleanupAndExit() {
  const currentSessionUptime = (Date.now() - sessionStartTime) / 1000;
  uptimeData.totalUptime += currentSessionUptime;
  saveUptimeData(uptimeData);
  clearInterval(saveInterval);
  process.exit();
}

process.on('SIGINT', cleanupAndExit);
process.on('SIGTERM', cleanupAndExit);
process.on('exit', cleanupAndExit);

module.exports = {
  name: 'uptime',
  description: 'Shows the lifetime uptime of the bot.',
  author: 'coffee',
  usage: '/uptime',

  async execute(api, event, args, commands, prefix, admins, appState, sendMessage) {
    const { threadID } = event;

    const currentSessionUptime = (Date.now() - sessionStartTime) / 1000;
    const totalUptime = uptimeData.totalUptime + currentSessionUptime;

    const uptimeSeconds = Math.floor(totalUptime);
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    const uptimeDays = Math.floor(uptimeHours / 24);

    const uptimeMessage = `🤖 **Vern x vraxy Bot Lifetime Uptime**\n` +
      `📅 Days: ${uptimeDays}\n` +
      `⏰ Hours: ${uptimeHours % 24}\n` +
      `🕒 Minutes: ${uptimeMinutes % 60}\n` +
      `⏱️ Seconds: ${uptimeSeconds % 60}`;

    sendMessage(api, { threadID, message: uptimeMessage });
  },
};
