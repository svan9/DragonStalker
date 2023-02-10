const { SlashCommandBuilder } = require('@discordjs/builders');
const { writeFile } = require("fs");
const json = __dirname.replace(require('path').basename(__dirname), "") + "users.json";


module.exports = {
    data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("check your profile"),
    async execute(interaction) {    
        // read users data
        let data = require("../users.json");
        const seconds = Math.ceil(new Date().getTime() / 1000);

        // add guild if is not in data
        if (data[interaction.guild.id] === undefined) 
            data[interaction.guild.id] = {};
        
        // add user if is not in data
        if (data[interaction.guild.id][interaction.member.id] === undefined) 
            data[interaction.guild.id][interaction.member.id] = { balance: 10, ownroles: [] };
        
        // add exp to user
        if (data[interaction.guild.id][interaction.member.id]["exp"] === undefined) 
            data[interaction.guild.id][interaction.member.id]["exp"] = 0;

        // add time
        if (data[interaction.guild.id][interaction.member.id]["time"] === undefined) 
            data[interaction.guild.id][interaction.member.id]["time"] = 0;
        
        if (data[interaction.guild.id][interaction.member.id]["last_time"] == 0)
            data[interaction.guild.id][interaction.member.id]["time"] += 0;
        else 
            data[interaction.guild.id][interaction.member.id]["time"] += seconds - data[interaction.guild.id][interaction.member.id]["last_time"];
        
        data[interaction.guild.id][interaction.member.id]["last_time"] = seconds;

        const exp = Math.ceil(data[interaction.guild.id][interaction.member.id]["time"] / 36) / 100;

        if (exp == null || exp == NaN) 
            data[interaction.guild.id][interaction.member.id]["exp"] = 0;
        else 
            data[interaction.guild.id][interaction.member.id]["exp"] = exp;

        writeFile(json, JSON.stringify(data, 3), "utf8", () => {});

        interaction.reply({
            embeds: [{
                title: "",
                color: 0x2F3136,//f1c40f,
                description: `**Profile ${interaction.member.user.toString()}**`,
                thumbnail: { url: interaction.member.user.avatarURL() },
                fields: [
                    {
                        name: "",
                        value: `> **МОНЕТЫ**
                        \`\`\` ${data[interaction.guild.id][interaction.member.id]["balance"]} \`\`\`` ,
                        inline: true
                    },
                    {
                        name: "",
                        value: `> **ОПЫТ**
                        \`\`\` ${exp} \`\`\`` ,
                        inline: true
                    },
                ]
            }]
        });

        

    }
};