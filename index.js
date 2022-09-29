// Initialize dotenv
require("dotenv").config();

// Discord.js versions ^13.0 require us to explicitly define client intents
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
});
const DVoice = require("@discordjs/voice");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
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
          const rand = Math.random();
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
        msg.channel.send("AUUGGGGHHHHH");
        break;

      case "!name":
        const Guild = client.guilds.cache.get(msg.guildId);
        const Member = Guild.members.cache.get(msg.author.id);

        if (Member.voice.channel != null) {
          console.log(
            `${Member.user.tag} is connected to ${Member.voice.channel.name}!`
          );
          const player = DVoice.createAudioPlayer();

          const connection = DVoice.joinVoiceChannel({
            channelId: Member.voice.channel.id,
            guildId: Member.voice.channel.guild.id,
            adapterCreator: Member.voice.channel.guild.voiceAdapterCreator,
          });

          connection.subscribe(player);

          let resource = DVoice.createAudioResource(
            "/z/DiscordBots/justMeow/test2.wav"
          );

          player.play(resource);

          player.on(DVoice.AudioPlayerStatus.Playing, () => {
            console.log("The audio player has started playing!");
          });
          player.on(DVoice.AudioPlayerStatus.Idle, () => {
            console.log("Song finished");
          });

          connection.destroy();
        } else {
          console.log(`${Member.user.tag} is not connected.`);
          msg.channel.send(Member.user.username + "?").catch(console.error);
        }
        break;
    }
  }
});
