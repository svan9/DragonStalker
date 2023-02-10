const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const { writeFile } = require("fs");
const json = __dirname.replace(require('path').basename(__dirname), "") + "users.json";


module.exports = {
    data: new SlashCommandBuilder()
    .setName("createrole")
    .setDescription("create your own role")
    .addStringOption(option => 
        option.setName("name")
        .setDescription("choose role name")
        .setRequired(true))
    .addStringOption(option => 
        option.setName("color")
        .setDescription("select role color")
        .setRequired(true)
    ),
    async execute(interaction) { 
        /** 
         * @type {String}
         */
        const rolename = interaction.options.get("name").value;
        /**
         * @type {int}
         */
        const price = rolename.length * 10 + 90;  

        // read users data
        let data = require("../users.json");
        
        // add guild if is not in data
        if (data[interaction.guild.id] === undefined) 
            data[interaction.guild.id] = {};
        
        // add user if is not in data
        if (data[interaction.guild.id][interaction.member.id] === undefined) 
            data[interaction.guild.id][interaction.member.id] = { balance: 10, ownroles: [] };
        
        
        // if balance < price
        if (data[interaction.guild.id][interaction.member.id]["balance"] < price) {
            writeFile(json, JSON.stringify(data, 3), "utf8", () => {});
            interaction.reply({
                content: "Недостаточно монет",
                ephemeral: true
            });
            return;
        }

        const torgb = num => {
            if (num == NaN) return [ 0, 0, 0 ];
            num >>>= 0;
            var b = num & 0xFF,
                g = (num & 0xFF00) >>> 8,
                r = (num & 0xFF0000) >>> 16;
            
            return [r, g, b];
        }

        const color = torgb(parseInt(interaction.options.get("color").value, 16));

        // create role
        interaction.guild.roles.create({ 
            name: rolename, 
            color: color,
            permissions: [ 
                PermissionsBitField.Flags.MentionEveryone 
            ]
        });

        data[interaction.guild.id][interaction.member.id]["balance"] -= price;

        const role = interaction.guild.roles.cache.find(role=>role.name==rolename);
        data[interaction.guild.id][interaction.member.id]["ownroles"].push(rolename);

        writeFile(json, JSON.stringify(data, 3), "utf8", () => {});

        interaction.member.roles.add(role);
        interaction.reply({
            embeds: [{
                title: "",
                color: 0x2F3136,//f1c40f,
                description: `**Роль ${interaction.member.user.toString()}**`,
                thumbnail: { url: interaction.member.user.avatarURL() },
                fields: [
                    {
                        name: "",
                        value: `> **Роль ${role.toString()} была добавлена**` ,
                        inline: true
                    },
                ]
            }]
        });
    }
};