// Initialize dotenv
require("dotenv").config();

// Discord.js versions ^13.0 require us to explicitly define client intents
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(client.user.username);
});

// Log In our bot
client.login(process.env.CLIENT_TOKEN);

//
let meowSpam;
const meowChance = 0.4;

client.on("messageCreate", async (msg) => {
  if (msg.author.username != client.user.username) {
    switch (msg.content.toLowerCase()) {
      case "meow":
      case "kitten":
        msg.channel.send("meow");
        // start meow spam
        meowSpam = setInterval(function () {
          // random meow per minute
          let rand = Math.random;
          if (rand < meowChance) {
            msg.channel.send("meow").catch(console.error);
          } else {
            console.log(rand);
          }
        }, 60000);
        break;

      case "please stop":
        msg.channel.send("fuck you!");

        setTimeout(function () {
          msg.channel.send("meow").catch(console.error);
          clearInterval(meowSpam);
        }, 3000);
        break;

      case "winston":
      case "my name is":
        msg.channel.send("AUUGGGGHHHHH");
        break;
    }
  }
});
