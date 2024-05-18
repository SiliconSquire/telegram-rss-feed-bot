require("dotenv").config();
const { Telegraf } = require("telegraf");
const Parser = require("rss-parser");

const bot = new Telegraf(process.env.BOT_TOKEN);
const parser = new Parser();
const channelId = process.env.CHANNEL_ID;
const rssFeedUrl = process.env.RSS_FEED_URL;
const intervalDuration = process.env.INTERVAL_DURATION;

const fs = require("fs");
const path = require("path");

const LAST_POST_DATE_FILE = path.join(__dirname, "lastPostDate.json");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Load the last posted date from the file
function loadLastPostedDate() {
  try {
    const data = fs.readFileSync(LAST_POST_DATE_FILE, "utf8");
    return new Date(JSON.parse(data));
  } catch (error) {
    // If the file doesn't exist or contains invalid data, use the Unix epoch
    return new Date(0);
  }
}

// Save the last posted date to the file
function saveLastPostedDate(date) {
  fs.writeFileSync(LAST_POST_DATE_FILE, JSON.stringify(date.toISOString()));
}

async function postNewRssItems() {
  const lastPostedDate = loadLastPostedDate();

  try {
    const feed = await parser.parseURL(rssFeedUrl);

    for (const item of feed.items) {
      const itemDate = new Date(item.pubDate || item.date);
      if (itemDate <= lastPostedDate) {
        continue; // Skip items that were published before the last posted date
      }
      saveLastPostedDate(itemDate);
      // To avoid hitting rate limits or flooding the channel 10 seconds delay is added
      await delay(10000);

      // Extract title (handling CDATA)
      const title = item.title.replace("<![CDATA[", "").replace("]]>", "");

      // Extract description (handling CDATA and limiting to a preview)
      let description = item.contentSnippet || item.description || "";
      description = description.replace("<![CDATA[", "").replace("]]>", "");
      const descriptionPreview =
        description.length > 200
          ? description.slice(0, 200) + "..."
          : description;

      // Construct the Telegram message (adjust formatting as needed)
      const message = `
<b>${title}</b>

${descriptionPreview}

<a href="${item.link}">Read more</a>
`;
      await bot.telegram.sendMessage(channelId, message, {
        parse_mode: "HTML",
      });
    }
  } catch (error) {
    console.error("Error fetching or posting RSS items:", error);
  }
}

bot.command("latest", async () => {
  try {
    const feed = await parser.parseURL(rssFeedUrl);
    const item = feed.items[0]; // Get the latest item

    // Extract title (handling CDATA)
    const title = item.title.replace("<![CDATA[", "").replace("]]>", "");

    // Extract description (handling CDATA and limiting to a preview)
    let description = item.contentSnippet || item.description || "";
    description = description.replace("<![CDATA[", "").replace("]]>", "");
    const descriptionPreview =
      description.length > 200
        ? description.slice(0, 200) + "..."
        : description;

    // Construct the Telegram message (adjust formatting as needed)
    const message = `
<b>${title}</b>

${descriptionPreview}

<a href="${item.link}">Read more</a>
`;
    await bot.telegram.sendMessage(channelId, message, {
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("Error fetching or posting RSS items:", error);
  }
});
console.log("About to initialize bot");
bot.launch();
console.log("Bot initialized");
setInterval(() => {
  postNewRssItems()
    .then(() => console.log("New RSS items posted"))
    .catch((error) => {
      console.error("Error posting RSS items:", error.message); // Log the error message
      console.error(error.stack); // Log the error stack trace
    });
}, intervalDuration);
