const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rootme")
    .setDescription("For internal use")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("RootMe - Capture The Flag")
      .setFields(
        {
          name: "Description",
          value:
            "➡️ TheRootMe is a jeopardy style Capture The Flag 🚩 , a cyber quest. This event aims at installing curiosity among young hackers(students) and encourages them to learn further, try harder and get deeper into the field of cyber security.\n\n➡️ The challenges in CTF include web, forensic, crypto, binary, reverse and hardware. In this event the participants are required to obtain the flag which serves as a proof of their exploit.",
        },
        {
          name: "Entry Fee",
          value: "1.Solo - RS.250\n2.Team - RS.700(max 3 members)",
        }
        // {
        //   name: "🎁Prizes:",
        //   value: `1.Cash prize of RS.10000\n2.Internship for selected participants by TG cyber labs.`,
        // },
        // {
        //   name: "For Details Contact",
        //   value: `1. Karthikeyan - vampy#7616 (discord)\n2. Akash - peterporker#9950 (discord)\n3. Aafrin NIsha - aafrin#9012 (discord)\n\n🏁Last date of registration: 13.03.2023\n🎌Certificate will be provided to all participants.`,
        // }
      )
      .setURL("https://discord.gg/QKjrhegdx5?event=1080139037685321841");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Request a call back")
        .setCustomId("cb")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("☎️"),

      new ButtonBuilder()
        .setLabel("Feedback")
        .setCustomId("fb")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("📑"),

      new ButtonBuilder()
        .setLabel("More about RootMe")
        .setEmoji("🎁")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/QKjrhegdx5?event=1080139037685321841"),

      new ButtonBuilder()
        // .setCustomId("register")
        .setLabel("Register here")
        .setEmoji("🏁")
        .setStyle(ButtonStyle.Link)
        .setURL("https://tinyurl.com/RootMeCTF")
    );
    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
