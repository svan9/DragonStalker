const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("for test"),
    async execute(interaction) {

        interaction.reply({
            content: "work"
        });
    }
};