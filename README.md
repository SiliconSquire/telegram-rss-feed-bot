# telegram-rss-feed-bot
A Node.js script allows you to create a Telegram bot that posts new items from an RSS feed to a specified Telegram channel. 

# RSS Feed to Telegram Bot

This Node.js script allows you to create a Telegram bot that posts new items from an RSS feed to a specified Telegram channel. The bot will check for new items at a specified interval and send them to the channel.

## Prerequisites

Before running this script, make sure you have the following:

1. Node.js installed on your system.
2. A Telegram bot token obtained from the BotFather.
3. The ID of the Telegram channel where you want to post the RSS items.
4. The URL of the RSS feed you want to monitor.

## Installation

1. Clone or download the repository containing the script.
2. Navigate to the project directory in your terminal.
3. Run the following command to install the required dependencies:

```
npm install telegraf rss-parser
```

## Configuration

1. Create a new file named `.env` in the project directory.
2. Add the following environment variables to the `.env` file, replacing the placeholders with your actual values:

```
BOT_TOKEN=your_telegram_bot_token
CHANNEL_ID=your_telegram_channel_id
RSS_FEED_URL=https://example.com/rss_feed
INTERVAL_DURATION=10000 # Interval duration in milliseconds (e.g., 10000 = 10 seconds)
```

Make sure to replace `your_telegram_bot_token`, `your_telegram_channel_id`, and `https://example.com/rss_feed` with your actual Telegram bot token, channel ID, and RSS feed URL, respectively. The `INTERVAL_DURATION` variable determines how often the bot should check for new RSS items (in milliseconds).

## Usage

1. Open a terminal and navigate to the project directory.
2. Run the following command to start the bot:

```
node index.js
```

The bot will initialize and start checking for new RSS items at the specified interval. When a new item is found, it will be posted to the specified Telegram channel.

## Notes

- The script uses the `dotenv` package to load environment variables from the `.env` file. Make sure to create the `.env` file and set the required variables before running the script.
- The last posted date is stored in a file named `lastPostDate.json` in the project directory. If the file doesn't exist or contains invalid data, the script will use the Unix epoch (January 1, 1970) as the initial last posted date NOTE: To prevent spamming previously posted RSS items, manually set the initial value in lastPostDate.json to the publication date (ISO format) of the latest existing item in the RSS feed before running the bot.
- The script handles CDATA tags in the RSS feed items and removes HTML tags from the title and description.
- Error handling has been added to log any errors that occur during the RSS parsing or posting process.
- The `/latest` command is implemented to send the most recent RSS item to the Telegram channel.

## Deployment

To deploy this bot to a server or hosting platform, follow these steps:

1. Install Node.js on the server or hosting environment.
2. Copy the project files to the server or hosting environment.
3. Set the required environment variables (`BOT_TOKEN`, `CHANNEL_ID`, `RSS_FEED_URL`, `INTERVAL_DURATION`) on the server or hosting environment.
4. Install the required dependencies by running `npm install` in the project directory.
5. Start the bot by running `node index.js`.

Alternatively, you can use a process manager like `pm2` or a containerization solution like Docker to manage and deploy the bot.
