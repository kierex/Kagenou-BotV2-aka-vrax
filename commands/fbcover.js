const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    name: "fbcover",
    description: "Generate a Facebook cover image with custom details.",
    usage: "fbcover <Name> <Subname> <Phone> <Address> <Email> <Color>",
    async run({ api, event, args }) {
        const { threadID, senderID } = event;

        // Validate arguments
        if (args.length < 6) {
            return api.sendMessage(
                "⚠ Usage: fbcover <Name> <Subname> <Phone> <Address> <Email> <Color>\n" +
                "Example: fbcover \"Mark Zuckerberg\" n/a 0123456789 USA zuck@gmail.com Cyan",
                threadID
            );
        }

        // Extract arguments properly to handle spaces
        const [name, subname, phone, address, email, ...colorParts] = args;
        const color = colorParts.join(" ");

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return api.sendMessage("❌ Invalid email format. Please provide a valid email address.", threadID);
        }

        const imagePath = path.join(__dirname, "cache", `fbcover_${senderID}.png`);
        const imageUrl = `https://api.zetsu.xyz/canvas/fbcover?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&uid=${senderID}&color=${encodeURIComponent(color)}`;

        try {
            api.sendMessage("⏳ Generating your Facebook cover, please wait...", threadID);

            const response = await axios({
                url: imageUrl,
                method: "GET",
                responseType: "stream",
            });

            const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });

            api.sendMessage({
                body: `✅ Facebook cover for ${name} has been generated!`,
                attachment: fs.createReadStream(imagePath),
            }, threadID, () => {
                fs.unlink(imagePath, () => {});
            });

        } catch (error) {
            console.error("Error generating fbcover:", error.message);

            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, () => {});
            }

            api.sendMessage("❌ Failed to generate the Facebook cover. Please try again later.", threadID);
        }
    }
};
