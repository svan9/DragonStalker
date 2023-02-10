const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("veref")
    .setDescription("для верификации")
    .addMentionableOption(option => option
        .setName("user")
        .setDescription("select user")
        .setRequired(true))
    .addStringOption(option => option
        .setName("gender")
        .setDescription("select gender")
        .setChoices(
            { name: "мальчик", value:"man" },
            { name: "девочка", value: "woman" })
        .setRequired(true))
    ,    
    async execute(interaction) {
        if (interaction.channel.id != 1064503470679396382) {
            interaction.reply({
                content: "не та комната",
                ephemeral: true
            });
            return;
        }
        if (interaction.member.roles.cache.find(role=>role.id == 1042175756236754994) == undefined) {
            interaction.reply({
                content: "Недостаточно прав",
                ephemeral: true
            });
            return;
        }
        const man =   interaction.guild.roles.cache.get("1051111515928932442");
        const woman = interaction.guild.roles.cache.get("1042201181944021052");
        const guest = interaction.guild.roles.cache.get("1073304812139061298");
        const user =  interaction.guild.roles.cache.get("1042014980666564639"); 
        var mem = interaction.guild.members.cache.get(interaction.options.get("user").value);

        if (interaction.options.get("gender").value == "man") {
            mem.roles.add(man);
        }
        else if (interaction.options.get("gender").value == "woman") {
            mem.roles.add(woman);
        }
        else 
            interaction.reply({
                content: "select gender man/woman",
                ephemeral: true
            });
        

        mem.roles.remove(guest);
        mem.roles.add(user);
            
        interaction.reply({
            content: ``,
            embeds: [{
                title: "",
                description: `пользователь ${mem.toString()} верифецирован`,
                color: 0x2f3136,
                footer: { text: "🕟"+new Date().toString() }
            }]
            // ephemeral: true
        });
    }
};