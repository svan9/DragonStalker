const { SlashCommandBuilder } = require('@discordjs/builders');
const json = __dirname.replace(require('path').basename(__dirname), "") + "users.json";


module.exports = {
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription("for test")
        .addMentionableOption(option => 
            option.setName('member')
            .setDescription('member')
            .setRequired(true))
        .addIntegerOption(option => 
            option.setName('count')
            .setDescription('count')
            .setRequired(true)),
    async execute(interaction) {
            var data = require("../users.json");
                if (parseInt(interaction.options.get("count").value) > data[interaction.guild.id][interaction.member.id]["balance"])  {
            interaction.reply({
                content: "u need more :rose: ",
                ephemeral: true
            });
            
            return;
        }
        let memberId = interaction.options.get("member").value.replace(/[<>@]/g, "");
        if (interaction.guild.members.cache.find(member => member.id == memberId) == undefined) {
            interaction.reply({
                content: "member not found",
                ephemeral: true
            });
            return;
        } 
        data[interaction.guild.id][memberId]["balance"] += parseInt(interaction.options.get("count").value);        
        data[interaction.guild.id][interaction.member.id]["balance"] -= parseInt(interaction.options.get("count").value);        
        require("fs").writeFile(json, JSON.stringify(data, 3), "utf8", () => {});
        interaction.reply({ 
            embeds: [{
                title: "check!",
                color: 0xaeff54,
                description: `<@${interaction.member.id}> give <@${memberId}> some :rose:  (${interaction.options.get("count").value})`,
                
            }],
        });
    }
};