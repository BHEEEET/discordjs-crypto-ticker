require('dotenv').config();
const axios = require('axios');

const {
	Client,
	Events,
	GatewayIntentBits,
	ActivityType,
} = require('discord.js');

const { token } = process.env.DISCORD_TOKEN;

const BIRDEYE_BASE = 'https://public-api.birdeye.so';
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const COIN_PRICE_URL = `${BIRDEYE_BASE}/public/price?address=${TOKEN_ADDRESS}`;
const DELAY = process.env.DELAY;
const NAME = 'DeanToken Price';

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMembers,
	],
});

client.once(Events.ClientReady, async (bot) => {
	client.user.setUsername(`${capitalizeFirstLetter(NAME)}`);
	setInterval(async () => {
		// eslint-disable-next-line no-unused-vars
		const request = await axios
			.get(COIN_PRICE_URL)
			.then((data) => {
				const price = data.data.data.value;
				const dataprice = Math.round(price * 1000) / 1000;
				console.log(dataprice);
				// const resultd = price.toLocaleString('en-US', {
				// 	style: 'currency',
				// 	currency: 'USD',
				// });
				console.log(`${capitalizeFirstLetter(NAME)} price is : $${dataprice}`);
				client.user.setActivity(`$${dataprice}`, {
					type: ActivityType.Watching,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}, DELAY);
	console.log(`Ready! Logged in as ${bot.user.tag}`);
});

client.login(token);
