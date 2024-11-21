import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";

import 'dotenv/config'
import mongoose from "mongoose";

export const bot = new Client({

  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ],

  silent: true,

  simpleCommand: {
    prefix: ".",
  },
});

bot.once("ready", async () => {
  await bot.guilds.fetch();

  void bot.initApplicationCommands();

  if (!process.env.MONGODB_URI) {
    console.log("No MongoDB URL provided.");
    return;
  }
  
	try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    return;
  }

  console.log("Bot started");
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", (message: Message) => {
  void bot.executeCommand(message);
});

async function run() {
 
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  await bot.login(process.env.BOT_TOKEN);
}

void run();
