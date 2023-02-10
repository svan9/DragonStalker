const { SlashCommandBuilder } = require('@discordjs/builders');
const { writeFile } = require("fs");
const json = __dirname.replace(require('path').basename(__dirname), "") + "users.json";


module.exports = {
    data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("check your balance"),
    async execute(interaction) {    
        // read users data
        let data = require("../users.json");
        
        // add guild if is not in data
        if (data[interaction.guild.id] === undefined) 
            data[interaction.guild.id] = {};
        
        // add user if is not in data
        if (data[interaction.guild.id][interaction.member.id] === undefined) 
            data[interaction.guild.id][interaction.member.id] = { balance: 10, ownroles: [] };
        
        writeFile(json, JSON.stringify(data, 3), "utf8", () => {});
        
        interaction.reply({
            embeds: [{
                title: "",
                color: 0x2F3136,//f1c40f,
                description: `**Balance ${interaction.member.user.toString()}**`,
                thumbnail: { url: interaction.member.user.avatarURL() },
                fields: [
                    {
                        name: "",
                        value: `> **МОНЕТЫ**
                        \`\`\` ${data[interaction.guild.id][interaction.member.id]["balance"]} \`\`\`` ,
                        inline: true
                    },
                ]
            }]
        });

        

    }
};