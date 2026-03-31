const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const CHANNEL_MAP = {
  '1484177513260384439': { name: '役員', webhook: 'https://m-pronix.app.n8n.cloud/webhook/pronix-discord-receiver' },
  '1484494967232528514': { name: '戦略', webhook: 'https://m-pronix.app.n8n.cloud/webhook/pronix-discord-receiver' },
  '1488368693363609600': { name: '案件', webhook: 'https://m-pronix.app.n8n.cloud/webhook/pronix-discord-receiver' },
};

client.once('ready', () => {
  console.log(`PRONIX ENGINE起動: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const channelConfig = CHANNEL_MAP[message.channel.id];
  if (!channelConfig) return;

  try {
    await fetch(channelConfig.webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: channelConfig.name,
        channel_id: message.channel.id,
        message: message.content,
        user: message.author.username,
        message_id: message.id,
      }),
    });
    await message.react('⚡');
  } catch (err) {
    console.error(err);
    await message.react('❌');
  }
});

client.login(process.env.DISCORD_TOKEN);
