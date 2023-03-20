const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const db = require("../mongodb/schemas/user_ticket_details.js");
const db2 = require("../mongodb/schemas/global_ticket_no.js");
const db3 = require("../mongodb/schemas/closed-tickets.js");
const db4 = require("../mongodb/schemas/deleted-tickets.js");
const db5 = require("../mongodb/schemas/non-publish-tickets.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    //if (interaction.isChatInputCommand()) return
    //--------------------------------------------------------------------------------------------------------
    if (interaction.customId == "fb") {
      const fb_modal = new ModalBuilder()
        .setTitle("Feedback Form")
        .setCustomId("fb_modal");

      const description = new TextInputBuilder()
        .setCustomId("des")
        .setLabel("Description")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder(
          "THIS IS ONLY FOR OSINT PURPOSE ORIGINAL FEEDBACK WOULD BE GIVEN TO YOU AT THE END OF EVENT"
        );

      const fb_row = new ActionRowBuilder().addComponents(description);

      fb_modal.addComponents(fb_row);
      await interaction.showModal(fb_modal);
    }
    // ---------------------------------------------------------------------------------------------------------
    else if (interaction.customId == "fb_modal") {
      await interaction.reply({
        content: "Your response was noted successfully",
        ephemeral: true,
      });
      const fb_description = await interaction.fields.getTextInputValue("des");

      const fb_embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTimestamp()
        .setTitle("RootMe Feedback")
        .setFields(
          { name: "Description", value: `${fb_description}` },
          { name: "Feedback By", value: `${interaction.member}` }
        )
        .setFooter({
          iconURL: client.config.whitehatians.logo,
          text: "Whitehatians Srmvec",
        });

      await interaction.guild.channels.cache
        .get(client.config.rootme.fb_cid)
        .send({ embeds: [fb_embed] });

      await interaction.user.send(
        `*Thanks for participating in RootMe - CTF organized by* ***Whitehatians - Department Of Cyber Security, Srmvec***\n || rapelcgvba|| `
      );
    }

    // -----------------------------------------------------------------------------------------------------
    else if (interaction.customId == "cb") {
      // console.log("123");
      const cb_modal = new ModalBuilder()
        .setTitle("Request A Call/Text Back")
        .setCustomId("cb_modal");

      const insta_id = new TextInputBuilder()
        .setCustomId("insta_id")
        .setLabel("Instagram Username")
        .setPlaceholder(
          "THIS IS ONLY FOR OSINT PURPOSE ORIGINAL FORM WOULD BE GIVEN TO YOU AT THE END OF EVENT"
        )
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const number = new TextInputBuilder()
        .setCustomId("num")
        .setLabel("Conatct Number")
        .setPlaceholder(
          "THIS IS ONLY FOR OSINT PURPOSE ORIGINAL FORM WOULD BE GIVEN TO YOU AT THE END OF EVENT"
        )
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const cb_row1 = new ActionRowBuilder().addComponents(insta_id);
      const cb_row2 = new ActionRowBuilder().addComponents(number);

      cb_modal.addComponents(cb_row1, cb_row2);
      await interaction.showModal(cb_modal);
    }
    // ---------------------------------------------------------------------------------------------------
    else if (interaction.customId == "cb_modal") {
      await interaction.reply({
        content: "Your response was noted successfully",
        ephemeral: true,
      });
      await interaction.user.send(
        `*Thanks for participating in RootMe - CTF organized by* ***Whitehatians - Department Of Cyber Security, Srmvec*** `
      );
      const cb_row1 = await interaction.fields.getTextInputValue("insta_id");
      const cb_row2 = await interaction.fields.getTextInputValue("num");

      const cb_embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTimestamp()
        .setTitle("RootMe Contact")
        .setFields(
          { name: "Instagram Username", value: `${cb_row1}` },
          { name: "Contact Number", value: `${cb_row2}` },
          { name: "Submitted by", value: `${interaction.member}` }
        )
        .setFooter({
          iconURL: client.config.whitehatians.logo,
          text: "Whitehatians Srmvec",
        });

      await interaction.guild.channels.cache
        .get(client.config.rootme.cb_cid)
        .send({ embeds: [cb_embed] });
    }

    // ---------------------------------------------------------------------------------------------------

    if (interaction.customId == "apply-instagram") {
      var user = interaction.user;
      var user_id = interaction.user.id;

      //Repeated Ticket Violation Checker
      db.findOne({ user_id: user_id }, async (err, records) => {
        if (err) {
          console.log(`${err}`.bgRed.black);
        }
        if (records) {
          console.log("in global tic");
          const embed = new EmbedBuilder()
            .setTitle("Resource Control - Duplicate Ticket")
            .addFields({
              name: "Reason",
              value: `*You already have a open ticket. kindly close ticket before opening a new ticket.*\n\n**If issue persists contact <@&${client.config.support.meta}>** `,
            })
            .setTimestamp()
            .setColor("Red")
            .setFooter({
              text: "Whitehatian Resource Control",
              iconURL: client.config.whitehatians.logo,
            });

          return await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        } else {
          const modal = new ModalBuilder()
            .setCustomId("post-form")
            .setTitle("Fill your details");

          const stu_name = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Name")
            .setPlaceholder("Ex:john")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const dept_year = new TextInputBuilder()
            .setCustomId("dept")
            .setLabel("Department and year")
            .setPlaceholder("Ex:2nd yearr, cys ")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const socials_username = new TextInputBuilder()
            .setCustomId("username")
            .setLabel("Instagram user name")
            .setPlaceholder("Ex:srmvec_cys_whitehatians")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const con_num = new TextInputBuilder()
            .setCustomId("num")
            .setLabel("Contact number")
            .setPlaceholder("Ex: 822XXXXX90")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const content_url = new TextInputBuilder()
            .setCustomId("curl")
            .setLabel("Attach your contribution as drive url")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const firstrow = new ActionRowBuilder().addComponents(stu_name);
          const secondrow = new ActionRowBuilder().addComponents(dept_year);
          const thirdrow = new ActionRowBuilder().addComponents(
            socials_username
          );
          const fourthrow = new ActionRowBuilder().addComponents(con_num);
          const fivthrow = new ActionRowBuilder().addComponents(content_url);

          modal.addComponents(
            firstrow,
            secondrow,
            thirdrow,
            fourthrow,
            fivthrow
          );
          await interaction.showModal(modal);
        }
      });
    } else if (interaction.customId == "post-form") {
      const user_id = interaction.user.id;
      //Global Ticket Number Updation
      db2.findOne({ guild_id: interaction.guild.id }, async (err, records) => {
        if (!records) {
          const new_db2 = new db2({
            guild_id: interaction.guild.id,
            global_ticket_no: 1,
          });
          await new_db2.save();
        } else if (records) {
          records.global_ticket_no += 1;
          await records.save();
        }
        //setTimeout(() => {},2000);

        //channel creation
        var tic_chn = await interaction.guild.channels
          .create({
            name: `Ticket-${records.global_ticket_no}-${interaction.user.username}`,
            parent: client.config.categories.meta,
            permissionOverwrites: [
              {
                id: user_id,
                allow: [
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.AttachFiles,
                  PermissionFlagsBits.EmbedLinks,
                  PermissionFlagsBits.ReadMessageHistory,
                  PermissionFlagsBits.AddReactions,
                  PermissionFlagsBits.CreatePublicThreads,
                ],
              },
              {
                id: client.config.support.meta,
                allow: [
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.AttachFiles,
                  PermissionFlagsBits.EmbedLinks,
                  PermissionFlagsBits.ReadMessageHistory,
                  PermissionFlagsBits.AddReactions,
                  PermissionFlagsBits.UseExternalEmojis,
                  PermissionFlagsBits.UseExternalStickers,
                  PermissionFlagsBits.CreatePublicThreads,
                  PermissionFlagsBits.ManageThreads,
                ],
              },
              {
                id: client.config.techTeam.incharge,
                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.AddReactions,
                  PermissionFlagsBits.UseExternalEmojis,
                  PermissionFlagsBits.UseExternalStickers,
                  PermissionFlagsBits.ReadMessageHistory,
                ],
              },
              {
                id: interaction.guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel],
              },
            ],
            type: ChannelType.GuildText,
          })
          .then(async (c) => {
            await interaction.reply({
              content: `<@${user_id}> Your ticket has been created - <#${c.id}>`,
              ephemeral: true,
            });
            var ticket_channel = c;

            const res_name = await interaction.fields.getTextInputValue("name");
            const res_dept = await interaction.fields.getTextInputValue("dept");
            const res_username = await interaction.fields.getTextInputValue(
              "username"
            );
            const res_curl = await interaction.fields.getTextInputValue("curl");
            const res_num = await interaction.fields.getTextInputValue("num");

            const embed = new EmbedBuilder()
              .setColor("Green")
              .setTitle(`Social's Ticket Created- #${records.global_ticket_no}`)
              .addFields(
                { name: "Name", value: res_name },
                { name: "Department nd year", value: res_dept },
                { name: "Instagram Username", value: res_username },
                { name: "Contact Number", value: res_num },
                { name: "Content Url", value: res_curl },
                { name: "Created By", value: `<@${user_id}>` }
              )
              .setFooter({
                text: "Team Social Media - Whitehatians",
                iconURL: client.config.whitehatians.logo,
              })
              .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("close-ticket")
                .setEmoji("🎫")
                .setLabel("Close Ticket")
                .setStyle(ButtonStyle.Danger)
            );
            let message = await c.send({
              content: `<@${user_id}> <@&${client.config.support.meta}>`,
              embeds: [embed],
              components: [row],
            });
            db2.findOne(
              { guild_id: interaction.guild.id },
              async (err, records) => {
                var new_ticket = new db({
                  user_id: user_id,
                  user_ticket_no: records.global_ticket_no,
                  ticket_status: "open",
                  channel_id: c.id.toString(),
                  message_id: message.id,
                  name: res_name,
                  dept: res_dept,
                  contact_num: res_num,
                  social_username: res_username,
                  content_url: res_curl,
                });
                await new_ticket.save();
              }
            );
          }); //.then close
      }); // db close

      //imp
    }
    //Close ticket
    else if (interaction.customId == "close-ticket") {
      const user_id = interaction.user.id;
      if (!interaction.member.roles.cache.has(client.config.support.meta))
        return interaction.reply({
          content: `You dont have proper privilege to close the ticket`,
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm-close")
          .setLabel("Close ticket")
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId("cancel-close")
          .setLabel("Cancel closure")
          .setStyle(ButtonStyle.Secondary)
      );

      const verif = await interaction.reply({
        content: "Are you sure you want to close the ticket?",
        components: [row],
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 10000,
      });

      collector.on("collect", async (i) => {
        if (i.customId == "confirm-close") {
          var chn_id = i.channel.id.toString();
          chn_id = chn_id;

          //db.findOne({channel_id:chn_id},async (err,records) => console.log(records));
          db.findOne({ channel_id: chn_id }, async (err, records) => {
            var close_ticket_details = new db3({
              user_id: records.user_id,
              user_ticket_no: records.user_ticket_no,
              ticket_status: "closed",
              channel_id: records.channel_id,
              message_id: records.message_id,
              name: records.name,
              dept: records.dept,
              contact_num: records.contact_num,
              social_username: records.social_username,
              content_url: records.content_url,
            });
            await close_ticket_details.save();

            //console.log("after db save")
            //edit ticket close message
            await interaction.channel.messages
              .fetch(`${records.message_id}`)
              .then((res) => {
                res.edit({ components: [] });
              });

            //disable close and cancel buttons
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(true);
            await interaction.editReply({ components: [row] });

            const close_embed = new EmbedBuilder()
              .setColor("Red")
              .setTitle(`Ticket Closure Details`)
              .addFields(
                {
                  name: "Ticket no",
                  value: `${records.user_ticket_no}`,
                  inline: true,
                },
                { name: "Ticket status", value: "closed", inline: true },
                {
                  name: "Opened by",
                  value: `<@${records.user_id}>`,
                  inline: true,
                },
                { name: "Closed by", value: `<@${user_id}>`, inline: true }
              )
              .setTimestamp()
              .setFooter({
                text: "Whitehatians",
                iconURL: client.config.whitehatians.logo,
              });

            await i.reply({ embeds: [close_embed] });

            await interaction.channel.permissionOverwrites.edit(
              records.user_id,
              { ViewChannel: null }
            );
            //prettier-ignore
            await interaction.channel.edit({
              name: `closed-ticket-#${records.user_ticket_no}`,
              parent: client.config.categories.meta_closed,
            });
            await interaction.guild.channels.cache
              .get(client.config.logs.closed_ticket_log)
              .send({ embeds: [close_embed] });

            const del_row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("delete-ticket")
                .setLabel("Content Published")
                .setEmoji("✅")
                .setStyle(ButtonStyle.Success),

              new ButtonBuilder()
                .setCustomId("cancel-delete")
                .setLabel("can't publish/issues")
                .setEmoji("🎌")
                .setStyle(ButtonStyle.Danger)
            );

            const embed = new EmbedBuilder()
              .setColor("Yellow")
              .setTitle(
                `**Delete the ticket after successful content publishment.\nIf the ticket has opened mistakenly or content could'nt be posted click can't post button**`
              )
              .setAuthor({
                name: "Great job social supporter. Thank you",
                iconURL: client.config.whitehatians.logo,
              })
              .setFooter({
                text: "Whitehatians",
                iconURL: client.config.whitehatians.logo,
              })
              .setTimestamp();

            await i.channel.send({
              content: `<@&${client.config.support.meta}>`,
              embeds: [embed],
              components: [del_row],
            });
            await db.findOneAndDelete({ user_id: user_id });
          });
          collector.stop();
        }

        if (i.customId == "cancel-close") {
          interaction.editReply({
            content: `**Ticket closure cancelled!** <@${i.user.id}>`,
            components: [],
          });
          collector.stop();
        }
      });

      collector.on("end", (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: `**Closing of ticket canceled!** (<@!${user_id}>)**- Timedout**`,
            components: [],
          });
        }
      });
    }
    //Not published content ticket close
    else if (interaction.customId == "cancel-delete") {
      const cancel_ticket_modal = new ModalBuilder()
        .setCustomId("cancel-delete-modal")
        .setTitle("Reason");

      const reason = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Reason for not publishing content")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph);

      const reason_row = new ActionRowBuilder().addComponents(reason);
      cancel_ticket_modal.addComponents(reason_row);
      await interaction.showModal(cancel_ticket_modal);
    }

    //not published content ticket close modal response
    else if (interaction.customId == "cancel-delete-modal") {
      let res_reason = await interaction.fields.getTextInputValue("reason");
      let del_ticket_logs = await interaction.guild.channels.cache.get(
        client.config.logs.deleted_ticket_log
      );

      db3.findOne(
        { channel_id: interaction.channel.id.toString() },
        async (err, records) => {
          const cancel_delete_embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(
              `Content not published - Ticket ${records.user_ticket_no} `
            )
            .addFields(
              { name: "Name", value: records.name, inline: true },
              { name: "Department", value: records.dept, inline: true },
              {
                name: "Contact Number",
                value: records.contact_num,
                inline: true,
              },
              {
                name: "Social username",
                value: records.social_username,
                inline: true,
              },
              { name: "Content url", value: records.content_url, inline: true }
            )
            .setTimestamp();

          const del_ticket_det = new db5({
            user_id: records.user_id,
            user_ticket_no: records.user_ticket_no,
            ticket_status: "non-published-deleted",
            channel_id: records.channel_id,
            message_id: records.message_id,
            name: records.name,
            dept: records.dept,
            contact_num: records.contact_num,
            social_username: records.social_username,
            content_url: records.content_url,
            reason: res_reason,
          });
          await del_ticket_det.save();

          const res_embed = new EmbedBuilder()
            .setTitle("Response has been noted successfully ✅")
            .setDescription("**purging channel in 5 seconds**")
            //.setAuthor({name:"Great job social supporter. Thank you",iconURL:client.config.whitehatians.logo})
            .setFooter({
              text: "Whitehatians",
              iconURL: client.config.whitehatians.logo,
            })
            .setTimestamp();
          await interaction.reply({ embeds: [res_embed] });

          setTimeout(async () => {
            await db3.findOneAndDelete({
              channel_id: interaction.channel.id.toString(),
            });
            await interaction.channel.delete();
            await del_ticket_logs.send({ embeds: [cancel_delete_embed] });
          }, 5000);
        }
      );
    }

    //content published ticket deletion and notifier
    else if (interaction.customId == "delete-ticket") {
      if (!interaction.member.roles.cache.has(client.config.support.meta))
        return interaction.reply({
          content: `You dont have proper privilege to delete the ticket`,
        });

      const modal = new ModalBuilder()
        .setCustomId("delete-ticket-modal")
        .setTitle("Publish Details");

      const url = new TextInputBuilder()
        .setCustomId("url")
        .setLabel("Fillout published content link")
        .setPlaceholder("https://www.instagram.com/p/Ck7bRu2J8o7/")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

      const url2 = new TextInputBuilder()
        .setCustomId("url2")
        .setLabel("secondary published content link(if any)")
        .setPlaceholder("https://www.youtube.com/watch?v=7OgkRpD")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const firstActionRow = new ActionRowBuilder().addComponents(url);
      const secondActionRow = new ActionRowBuilder().addComponents(url2);

      modal.addComponents(firstActionRow, secondActionRow);

      await interaction.showModal(modal);
    } else if (interaction.customId == "delete-ticket-modal") {
      const primary_url = await interaction.fields.getTextInputValue("url");
      const secondary_url = await interaction.fields.getTextInputValue("url2");

      db3.findOne(
        { channel_id: interaction.channel.id.toString() },
        async (err, records) => {
          const del_ticket_det = new db4({
            user_id: records.user_id,
            user_ticket_no: records.user_ticket_no,
            ticket_status: "deleted",
            channel_id: records.channel_id,
            message_id: records.message_id,
            name: records.name,
            dept: records.dept,
            contact_num: records.contact_num,
            social_username: records.social_username,
            content_url: records.content_url,
            published_content1: primary_url,
            published_content2: secondary_url,
          });

          await del_ticket_det.save();
        }
      );

      const last_embed = new EmbedBuilder()
        .setTitle("Response has been noted successfully ✅")
        .setDescription("**purging channel in 5 seconds**")
        .setAuthor({
          name: "Great job social supporter. Thank you",
          iconURL: client.config.whitehatians.logo,
        })
        .setFooter({
          text: "Whitehatians",
          iconURL: client.config.whitehatians.logo,
        })
        .setTimestamp();

      await interaction.reply({ embeds: [last_embed] });
      let pub_content_logs = await interaction.guild.channels.cache.get(
        client.config.logs.published_noti_log
      );
      let del_ticket_logs = await interaction.guild.channels.cache.get(
        client.config.logs.deleted_ticket_log
      );

      db4.findOne(
        { channel_id: interaction.channel.id.toString() },
        async (err, records) => {
          const del_log_embed = new EmbedBuilder()
            .setTitle(`Deleted Ticket - ${records.user_ticket_no} `)
            .setColor("DarkBlue")
            .setDescription(
              `[**Click here to view posted feed**](${records.published_content1})`
            )
            .addFields(
              { name: "Name", value: records.name, inline: true },
              { name: "Department", value: records.dept, inline: true },
              {
                name: "Contact Number",
                value: records.contact_num,
                inline: true,
              },
              {
                name: "Social username",
                value: records.social_username,
                inline: true,
              },
              { name: "Content url", value: records.content_url, inline: true },
              { name: "Deleted By", value: `${interaction.member}` }
            )
            .setTimestamp();

          setTimeout(async () => {
            await db3.findOneAndDelete({
              channel_id: interaction.channel.id.toString(),
            });
            await interaction.channel.delete();
            await del_ticket_logs.send({ embeds: [del_log_embed] });
            await pub_content_logs.send(
              `***<@${records.user_id}> your contribution is now live on Whitehatians social media\n${primary_url}\n${secondary_url} ***`
            );
          }, 5000);
        }
      );
    }

    // -------------------------------------------- Started From Here -------------------------------------

    if (interaction.customId == "apply-youtube") {
      var user = interaction.user;
      var user_id = interaction.user.id;

      //Repeated Ticket Violation Checker
      db.findOne({ user_id: user_id }, async (err, records) => {
        if (err) {
          console.log(`${err}`.bgRed.black);
        }
        if (records) {
          // console.log("in global tic");
          const embed = new EmbedBuilder()
            .setTitle("Resource Control - Duplicate Ticket")
            .addFields({
              name: "Reason",
              value: `*You already have a open ticket. kindly close ticket before opening a new ticket.*\n\n**If issue persists contact <@&${client.config.support.youtube}>** `,
            })
            .setTimestamp()
            .setColor("Red")
            .setFooter({
              text: "Whitehatian Resource Control",
              iconURL: client.config.whitehatians.logo,
            });

          return await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        } else {
          const modal = new ModalBuilder()
            .setCustomId("post-form-youtube")
            .setTitle("Fill your details - Youtube");

          const stu_name = new TextInputBuilder()
            .setCustomId("name-yt")
            .setLabel("Name")
            .setPlaceholder("Ex:john")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const dept_year = new TextInputBuilder()
            .setCustomId("dept-yt")
            .setLabel("Department and year")
            .setPlaceholder("Ex:2nd yearr, cys ")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const socials_username = new TextInputBuilder()
            .setCustomId("username-yt")
            .setLabel("Instagram user name")
            .setPlaceholder("Ex:srmvec_cys_whitehatians")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const con_num = new TextInputBuilder()
            .setCustomId("num-yt")
            .setLabel("Contact number")
            .setPlaceholder("Ex: 822XXXXX90")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const content_url = new TextInputBuilder()
            .setCustomId("curl-yt")
            .setLabel("Attach your contribution as drive url")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const firstrow = new ActionRowBuilder().addComponents(stu_name);
          const secondrow = new ActionRowBuilder().addComponents(dept_year);
          const thirdrow = new ActionRowBuilder().addComponents(
            socials_username
          );
          const fourthrow = new ActionRowBuilder().addComponents(con_num);
          const fivthrow = new ActionRowBuilder().addComponents(content_url);

          modal.addComponents(
            firstrow,
            secondrow,
            thirdrow,
            fourthrow,
            fivthrow
          );
          await interaction.showModal(modal);
        }
      });
    }

    //-------------------------------------------Form Collector-----------------------------------------
    else if (interaction.customId == "post-form-youtube") {
      const user_id = interaction.user.id;
      //Global Ticket Number Updation
      db2.findOne({ guild_id: interaction.guild.id }, async (err, records) => {
        if (!records) {
          const new_db2 = new db2({
            guild_id: interaction.guild.id,
            global_ticket_no: 1,
          });
          await new_db2.save();
        } else if (records) {
          records.global_ticket_no += 1;
          await records.save();
        }
        //setTimeout(() => {},2000);

        //channel creation
        var tic_chn = await interaction.guild.channels
          .create({
            name: `Ticket-${records.global_ticket_no}-${interaction.user.username}`,
            parent: client.config.categories.youtube,
            permissionOverwrites: [
              {
                id: user_id,
                allow: [
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.AttachFiles,
                  PermissionFlagsBits.EmbedLinks,
                  PermissionFlagsBits.ReadMessageHistory,
                  PermissionFlagsBits.AddReactions,
                  PermissionFlagsBits.CreatePublicThreads,
                ],
              },
              {
                id: client.config.support.youtube,
                allow: [
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.AttachFiles,
                  PermissionFlagsBits.EmbedLinks,
                  PermissionFlagsBits.ReadMessageHistory,
                  PermissionFlagsBits.AddReactions,
                  PermissionFlagsBits.CreatePublicThreads,
                  PermissionFlagsBits.ManageThreads,
                ],
              },
              {
                id: interaction.guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel],
              },
            ],
            type: ChannelType.GuildText,
          })
          .then(async (c) => {
            await interaction.reply({
              content: `<@${user_id}> Your ticket has been created - <#${c.id}>`,
              ephemeral: true,
            });
            var ticket_channel = c;

            const res_name = await interaction.fields.getTextInputValue(
              "name-yt"
            );
            const res_dept = await interaction.fields.getTextInputValue(
              "dept-yt"
            );
            const res_username = await interaction.fields.getTextInputValue(
              "username-yt"
            );
            const res_curl = await interaction.fields.getTextInputValue(
              "curl-yt"
            );
            const res_num = await interaction.fields.getTextInputValue(
              "num-yt"
            );

            const embed = new EmbedBuilder()
              .setColor("Green")
              .setTitle(`Social's Ticket Created- #${records.global_ticket_no}`)
              .addFields(
                { name: "Name", value: res_name },
                { name: "Department nd year", value: res_dept },
                { name: "Instagram Username", value: res_username },
                { name: "Contact Number", value: res_num },
                { name: "Content Url", value: res_curl },
                { name: "Created By", value: `<@${user_id}>` }
              )
              .setFooter({
                text: "Team Social Media - Whitehatians",
                iconURL: client.config.whitehatians.logo,
              })
              .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("close-ticket-youtube")
                .setEmoji("🎫")
                .setLabel("Close Ticket")
                .setStyle(ButtonStyle.Danger)
            );
            let message = await c.send({
              content: `<@${user_id}> <@&${client.config.support.youtube}>`,
              embeds: [embed],
              components: [row],
            });

            db2.findOne(
              { guild_id: interaction.guild.id },
              async (err, records) => {
                var new_ticket = new db({
                  user_id: user_id,
                  user_ticket_no: records.global_ticket_no,
                  ticket_status: "open",
                  channel_id: c.id.toString(),
                  message_id: message.id,
                  name: res_name,
                  dept: res_dept,
                  contact_num: res_num,
                  social_username: res_username,
                  content_url: res_curl,
                });
                await new_ticket.save();
              }
            );
          }); //.then close
      }); // db close

      //imp
    }

    // -------------------------------------------- Close Ticket -------------------------------------------------
    else if (interaction.customId == "close-ticket-youtube") {
      const user_id = interaction.user.id;
      if (!interaction.member.roles.cache.has(client.config.support.youtube))
        return interaction.reply({
          content: `You dont have proper privilege to close the ticket`,
        });
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm-close-youtube")
          .setLabel("Close ticket")
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId("cancel-close-youtube")
          .setLabel("Cancel closure")
          .setStyle(ButtonStyle.Secondary)
      );

      const verif = await interaction.reply({
        content: "Are you sure you want to close the ticket?",
        components: [row],
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 10000,
      });

      collector.on("collect", async (i) => {
        if (i.customId == "confirm-close-youtube") {
          var chn_id = i.channel.id.toString();
          chn_id = chn_id;

          //db.findOne({channel_id:chn_id},async (err,records) => console.log(records));
          db.findOne({ channel_id: chn_id }, async (err, records) => {
            var close_ticket_details = new db3({
              user_id: records.user_id,
              user_ticket_no: records.user_ticket_no,
              ticket_status: "closed",
              channel_id: records.channel_id,
              message_id: records.message_id,
              name: records.name,
              dept: records.dept,
              contact_num: records.contact_num,
              social_username: records.social_username,
              content_url: records.content_url,
            });
            await close_ticket_details.save();

            //console.log("after db save")
            //edit ticket close message
            await interaction.channel.messages
              .fetch(`${records.message_id}`)
              .then((res) => {
                res.edit({ components: [] });
              });

            //disable close and cancel buttons
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(true);
            await interaction.editReply({ components: [row] });

            const close_embed = new EmbedBuilder()
              .setColor("Red")
              .setTitle(`Ticket Closure Details`)
              .addFields(
                {
                  name: "Ticket no",
                  value: `${records.user_ticket_no}`,
                  inline: true,
                },
                { name: "Ticket status", value: "closed", inline: true },
                {
                  name: "Opened by",
                  value: `<@${records.user_id}>`,
                  inline: true,
                },
                { name: "Closed by", value: `<@${user_id}>`, inline: true }
              )
              .setTimestamp()
              .setFooter({
                text: "Whitehatians",
                iconURL: client.config.whitehatians.logo,
              });

            await i.reply({ embeds: [close_embed] });

            await interaction.channel.permissionOverwrites.edit(
              records.user_id,
              { ViewChannel: null }
            );
            //prettier-ignore
            await interaction.channel.edit({
              name: `closed-ticket-#${records.user_ticket_no}`,
              parent: `${client.config.categories.youtube_closed}`,
            });
            await interaction.guild.channels.cache
              .get(client.config.logs.closed_ticket_log)
              .send({ embeds: [close_embed] });

            const del_row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("delete-ticket-youtube")
                .setLabel("Content Published")
                .setEmoji("✅")
                .setStyle(ButtonStyle.Success),

              new ButtonBuilder()
                .setCustomId("cancel-delete-youtube")
                .setLabel("can't publish/issues")
                .setEmoji("🎌")
                .setStyle(ButtonStyle.Danger)
            );

            const embed = new EmbedBuilder()
              .setColor("Yellow")
              .setTitle(
                `**Delete the ticket after successful content publishment.\nIf the ticket has opened mistakenly or content could'nt be posted click can't post button**`
              )
              .setAuthor({
                name: "Great job social supporter. Thank you",
                iconURL: client.config.whitehatians.logo,
              })
              .setFooter({
                text: "Whitehatians",
                iconURL: client.config.whitehatians.logo,
              })
              .setTimestamp();

            await i.channel.send({
              content: `<@&${client.config.support.youtube}>`,
              embeds: [embed],
              components: [del_row],
            });
            await db.findOneAndDelete({ user_id: user_id });
          });
          collector.stop();
        }

        if (i.customId == "cancel-close-youtube") {
          interaction.editReply({
            content: `**Ticket closure cancelled!** <@${i.user.id}>`,
            components: [],
          });
          collector.stop();
        }
      });

      collector.on("end", (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: `**Closing of ticket canceled!** (<@!${user_id}>)**- Timedout**`,
            components: [],
          });
        }
      });
    }

    //------------------------ Not published content ticket close -------------------------------------
    else if (interaction.customId == "cancel-delete-youtube") {
      const cancel_ticket_modal = new ModalBuilder()
        .setCustomId("cancel-delete-modal-youtube")
        .setTitle("Reason");

      const reason = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Reason for not publishing content")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph);

      const reason_row = new ActionRowBuilder().addComponents(reason);
      cancel_ticket_modal.addComponents(reason_row);
      await interaction.showModal(cancel_ticket_modal);
    }

    //--------------------- not published content ticket close modal response-------------------------
    else if (interaction.customId == "cancel-delete-modal-youtube") {
      let res_reason = await interaction.fields.getTextInputValue("reason");
      let del_ticket_logs = await interaction.guild.channels.cache.get(
        client.config.logs.deleted_ticket_log
      );

      db3.findOne(
        { channel_id: interaction.channel.id.toString() },
        async (err, records) => {
          const cancel_delete_embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(
              `Content not published - Ticket ${records.user_ticket_no} `
            )
            .addFields(
              { name: "Name", value: records.name, inline: true },
              { name: "Department", value: records.dept, inline: true },
              {
                name: "Contact Number",
                value: records.contact_num,
                inline: true,
              },
              {
                name: "Social username",
                value: records.social_username,
                inline: true,
              },
              { name: "Content url", value: records.content_url, inline: true }
            )
            .setTimestamp();

          const del_ticket_det = new db5({
            user_id: records.user_id,
            user_ticket_no: records.user_ticket_no,
            ticket_status: "non-published-deleted",
            channel_id: records.channel_id,
            message_id: records.message_id,
            name: records.name,
            dept: records.dept,
            contact_num: records.contact_num,
            social_username: records.social_username,
            content_url: records.content_url,
            reason: res_reason,
          });
          await del_ticket_det.save();

          const res_embed = new EmbedBuilder()
            .setTitle("Response has been noted successfully ✅")
            .setDescription("**purging channel in 5 seconds**")
            //.setAuthor({name:"Great job social supporter. Thank you",iconURL:client.config.whitehatians.logo})
            .setFooter({
              text: "Whitehatians",
              iconURL: client.config.whitehatians.logo,
            })
            .setTimestamp();
          await interaction.reply({ embeds: [res_embed] });

          setTimeout(async () => {
            await db3.findOneAndDelete({
              channel_id: interaction.channel.id.toString(),
            });
            await interaction.channel.delete();
            await del_ticket_logs.send({ embeds: [cancel_delete_embed] });
          }, 5000);
        }
      );
    }
    //----------------------------content published ticket deletion and notifier---------------------------
    else if (interaction.customId == "delete-ticket-youtube") {
      if (!interaction.member.roles.cache.has(client.config.support.youtube))
        return interaction.reply({
          content: `You dont have proper privilege to close the ticket`,
        });
      const modal = new ModalBuilder()
        .setCustomId("delete-ticket-modal-youtube")
        .setTitle("Publish Details");

      const url = new TextInputBuilder()
        .setCustomId("url")
        .setLabel("Fillout published content link")
        .setPlaceholder("https://www.instagram.com/p/Ck7bRu2J8o7/")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

      const url2 = new TextInputBuilder()
        .setCustomId("url2")
        .setLabel("secondary published content link(if any)")
        .setPlaceholder("https://www.youtube.com/watch?v=7OgkRpD")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const firstActionRow = new ActionRowBuilder().addComponents(url);
      const secondActionRow = new ActionRowBuilder().addComponents(url2);

      modal.addComponents(firstActionRow, secondActionRow);

      await interaction.showModal(modal);
    } else if (interaction.customId == "delete-ticket-modal-youtube") {
      const primary_url = await interaction.fields.getTextInputValue("url");
      const secondary_url = await interaction.fields.getTextInputValue("url2");

      db3.findOne(
        { channel_id: interaction.channel.id.toString() },
        async (err, records) => {
          const del_ticket_det = new db4({
            user_id: records.user_id,
            user_ticket_no: records.user_ticket_no,
            ticket_status: "deleted",
            channel_id: records.channel_id,
            message_id: records.message_id,
            name: records.name,
            dept: records.dept,
            contact_num: records.contact_num,
            social_username: records.social_username,
            content_url: records.content_url,
            published_content1: primary_url,
            published_content2: secondary_url,
          });

          await del_ticket_det.save();
        }
      );

      const last_embed = new EmbedBuilder()
        .setTitle("Response has been noted successfully ✅")
        .setDescription("**purging channel in 5 seconds**")
        .setAuthor({
          name: "Great job social supporter. Thank you",
          iconURL: client.config.whitehatians.logo,
        })
        .setFooter({
          text: "Whitehatians",
          iconURL: client.config.whitehatians.logo,
        })
        .setTimestamp();

      await interaction.reply({ embeds: [last_embed] });
      let pub_content_logs = await interaction.guild.channels.cache.get(
        client.config.logs.published_noti_log
      );
      let del_ticket_logs = await interaction.guild.channels.cache.get(
        client.config.logs.deleted_ticket_log
      );

      db4.findOne(
        { channel_id: interaction.channel.id.toString() },
        async (err, records) => {
          const del_log_embed = new EmbedBuilder()
            .setTitle(`Deleted Ticket - ${records.user_ticket_no} `)
            .setColor("DarkBlue")
            .setDescription(
              `[**Click here to view posted feed**](${records.published_content1})`
            )
            .addFields(
              { name: "Name", value: records.name, inline: true },
              { name: "Department", value: records.dept, inline: true },
              {
                name: "Contact Number",
                value: records.contact_num,
                inline: true,
              },
              {
                name: "Social username",
                value: records.social_username,
                inline: true,
              },
              { name: "Content url", value: records.content_url, inline: true }
            )
            .setTimestamp();

          setTimeout(async () => {
            await db3.findOneAndDelete({
              channel_id: interaction.channel.id.toString(),
            });
            await interaction.channel.delete();
            await del_ticket_logs.send({ embeds: [del_log_embed] });
            await pub_content_logs.send(
              `***<@${records.user_id}> your contribution is now live on Whitehatians social media\n${primary_url}\n${secondary_url} ***`
            );
          }, 5000);
        }
      );
    }
  },
};
