require("dotenv").config();
const fs = require('fs');
const { writeFile } = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, GatewayIntentBits , Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const TOKEN = process.env['TOKEN'];
const bot = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
    });
const commands = [];
const json = "./users.json";


bot.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    bot.commands.set(command.data.name, command);
} 
bot.on("voiceStateUpdate", (oldState, newState) => {
    const db = require("./users.json");
    const seconds = Math.ceil(new Date().getTime() / 1000);

    // if guild is undefinded
    if (db[oldState.guild.id] == undefined) 
        db[oldState.guild.id] = {};
    
    // if user undefined
    if (db[oldState.guild.id][oldState.member.id] == undefined) 
        db[oldState.guild.id][oldState.member.id] = {
            balance: 100,
            ownroles: [],
            last_time: 0
        };
    // if vat "last_time" is undefinded
    if (db[oldState.guild.id][oldState.member.id]["last_time"] == undefined) 
        db[oldState.guild.id][oldState.member.id]["last_time"] = 0;

    // if vat "last_time" is undefinded
    if (db[oldState.guild.id][oldState.member.id]["time"] == undefined) 
        db[oldState.guild.id][oldState.member.id]["time"] = 0;
    
    // join to channel
    if (oldState.channel == null && newState.channel != null) {
        db[oldState.guild.id][oldState.member.id]["last_time"] = seconds;
        writeFile(json, JSON.stringify(db, null, 3), "utf8", () => {});  
    }
    // leave from channel
    else if (oldState.channel != null && newState.channel == null) {
        if (db[oldState.guild.id][oldState.member.id]["last_time"] == 0)
            db[oldState.guild.id][oldState.member.id]["time"] += 0;
        else 
            db[oldState.guild.id][oldState.member.id]["time"] += seconds - db[oldState.guild.id][oldState.member.id]["last_time"];
        db[oldState.guild.id][oldState.member.id]["last_time"] = 0;
        writeFile(json, JSON.stringify(db, null, 3), "utf8", () => {});  
    }
});

bot.once('ready', () => {
    console.log("ready");
    const CLIENT_ID = bot.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(TOKEN);
    (async () => {  
        await rest.put(
            Routes.applicationCommands(CLIENT_ID), {
                body: commands
            },
        );
    })();
    
});

bot.on('interactionCreate', async interaction => {
    /*
        const db = require("./users.json");
        bot.guilds.cache.each(guild => {
            if (db[guild.id] == undefined) db[guild.id] = {};
            guild.members.cache.forEach(member => {
                if (db[guild.id][member.id] == undefined) db[guild.id][member.id] = { balance: 10 };
            });
        });
        fs.writeFile("./users.json", JSON.stringify(db, 3), "utf8", () => {});
    */

    if (!interaction.isCommand()) return;
    const command = bot.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});
bot.login(TOKEN);