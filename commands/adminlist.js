module.exports = {
    name: 'adminlist',
    category: 'Info',
    description: 'Displays the list of bot admins.',
    usage: '/adminlist',
    
    execute: async (api, event, args, commands, prefix, admins, appState, sendMessage) => {
        const { threadID } = event;

        // Check if there are any admins
        if (!admins || admins.length === 0) {
            return sendMessage(api, {
                threadID,
                message: "⚠️ | No admins have been set yet."
            });
        }

        let adminListMessage = "👑 Admins List 👑\n";

        for (const adminID of admins) {
            try {
                // Fetch user information for each admin ID
                const userInfo = await api.getUserInfo(adminID);
                const userName = userInfo[adminID]?.name || "Unknown User";
                adminListMessage += `- ${userName} [ ${adminID} ]\n`;
            } catch (error) {
                console.error(`Error fetching user info for admin ${adminID}:`, error);

                // Add fallback for admins whose info could not be retrieved
                adminListMessage += `- Unknown User [ ${adminID} ]\n`;
            }
        }

        // Send the compiled list of admins
        sendMessage(api, {
            threadID,
            message: adminListMessage
        });
    },
};