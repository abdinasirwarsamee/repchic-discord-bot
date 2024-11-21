import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from "discord.js";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

@Discord()
class StockCommand {

    @SimpleCommand({ aliases: ["s", "st", "sk"], name: "stock" })
    async stock(command: SimpleCommandMessage) {


        const RefreshStock = new ButtonBuilder()
            .setCustomId('refresh_stock')
            .setEmoji('1253951977738600458')
            .setLabel(`Refresh Stock`)
            .setStyle(ButtonStyle.Danger);


        command.message.reply({
            components: [
                 new ActionRowBuilder<ButtonBuilder>().addComponents(RefreshStock)
            ],
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Current Stock `)
                    .setDescription(`:warning: **These values can change at any time and is good to run often to keep up with the current stock in the server!**`)
                    .setColor(Colors.Red)
                    .addFields(
                        { name: `\u00A0`, value: `\u00A0` },
                        { name: `[ + ] | __**FORTNITE**__`, value: `\`0\` **Current Accounts**` },
                        { name: `\u00A0`, value: `\u00A0` },
                        { name: `[ + ] | __**GTA**__`, value: `\`0\` **Current Accounts**` },
                        { name: `\u00A0`, value: `\u00A0` },
                        { name: `[ + ] | __**RUST**__`, value: `\`0\` **Current Accounts**` },
                    )
                    .setFooter({ text: `Account Provider  ` })
                    .setTimestamp()
            ]
        });
    }
}