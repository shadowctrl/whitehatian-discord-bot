const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("applymessage")
    .setDescription("For internal use"),
  async execute(interaction, client) {
    if (interaction.user.id != client.config.social_mods.mod1) {
      await interaction.deferReply();
      await interaction.editReply({
        content: "Only for internal use.",
        ephermal: true,
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Post On Social Platforms")
        //.setAuthor({name:"srmvec_cys_whitehatians",iconURL:client.config.whitehatians.logo})
        .setDescription(
          "Contribute any cyber related content/news for whitehatians social media"
        )
        .addFields(
          {
            name: "Accepted Content",
            value:
              "Content provided must be related to Technology or Cyber Security.",
          },
          { name: "Type of content", value: "Posts, reels and videos" },
          {
            name: "social platfirms",
            value: "Instagram, Facebook and Youtube",
          },
          {
            name: "Note",
            value:
              "***You can share any knowledge here, We'll make a post for you***",
          }
        )
        .setURL(client.config.whitehatians.instagram)
        .setFooter({
          text: "Whitehatians Srmvec",
          iconURL: client.config.whitehatians.logo,
        })
        .setTimestamp()
        .setColor("Blue");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("apply-instagram")
          .setLabel("Post On Insta")
          .setEmoji("🎫")
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId("apply-youtube")
          .setLabel("Post On Youtube")
          .setEmoji("🎫")
          .setStyle(ButtonStyle.Danger)
      );

      await interaction.deferReply();
      await interaction.editReply({ embeds: [embed], components: [row] });
    }
  },
};
