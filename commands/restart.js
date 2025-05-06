module.exports = {
    name: 'restart', 
    description: 'Restarts the bot.',
    execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
        const { threadID, senderID } = event;

        // Check if the sender is an admin
        if (!admins.includes(senderID)) {
            return sendMessage(api, {
                threadID,
                message: '❌ You do not have permission to use this command.',
            });
        }

        // Notify restart
        await sendMessage(api, {
            threadID,
            message: '♻ Restarting the bot...',
        });

        // Exit process after short delay
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    }
};
