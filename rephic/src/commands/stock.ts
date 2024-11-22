import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Colors,
    EmbedBuilder,
} from "discord.js";
import { ButtonComponent, Discord, SimpleCommand, SimpleCommandMessage } from "discordx";
import StockModel from "../models/stockmodel.js";

@Discord()
class StockCommand {

    @ButtonComponent({ id: "refresh_stock" })
    async refreshStock(interaction: ButtonInteraction): Promise<void> {
        const guildId = interaction.guild?.id;

        if (!guildId) {
            return void interaction.reply({
                content: "Guild information is missing. Please run the command in a server.",
                ephemeral: true,
            });
        }


        const stockData = await StockModel.findOne({ guildId });
        if (!stockData) {
            return void interaction.reply({
                content: "No stock data found for this server. Please try again later.",
                ephemeral: true,
            });
        }


        const embedFields = stockData.stock.map((category) => ({
            name: `__**${category.categoryName.toUpperCase()}**__`,
            value: `\`${category.accounts.length}\` **accounts available**`,
        }));


        const embed = new EmbedBuilder()
            .setTitle("Current Stock")
            .setDescription(
                ":warning: **These values can change at any time. Check frequently to stay updated!**"
            )
            .setColor(Colors.Red)
            .addFields(embedFields.length > 0 ? embedFields : [{ name: "No Stock Available", value: "Currently no accounts available." }])
            .setFooter({ text: "Account Provider" })
            .setTimestamp();


        await interaction.update({ embeds: [embed] });
    }


    @SimpleCommand({ aliases: ["s", "st", "sk"], name: "stock" })
    async stock(command: SimpleCommandMessage): Promise<void> {
        const guildId = command.message.guild?.id;
        const ownerId = command.message.guild?.ownerId;


        if (!guildId || !ownerId) {
            return void command.message.reply({
                content: "Guild information is missing. Please run the command in a server.",
            });
        }

        let guildStock = await StockModel.findOne({ guildId: guildId });

        if (!guildStock) {
            guildStock = new StockModel({
                guildId,
                ownerId,
                guildName: command.message.guild?.name,
                stock: [

                ],
                customers: [],
            });

            await guildStock.save();
        }


        const embedFields = guildStock.stock.map((category) => ({
            name: `__**${category.categoryName.toUpperCase()}**__`,
            value: `\`${category.accounts.length}\` **accounts available**`,
        }));


        const RefreshStock = new ButtonBuilder()
            .setCustomId("refresh_stock")
            .setEmoji("🔄")
            .setLabel("Refresh Stock")
            .setStyle(ButtonStyle.Primary);


        void command.message.reply({
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(RefreshStock)],
            embeds: [
                new EmbedBuilder()
                    .setTitle("Current Stock")
                    .setDescription(
                        ":warning: **These values can change at any time. Check frequently to stay updated!**"
                    )
                    .setColor(Colors.Red)
                    .addFields(embedFields.length > 0 ? embedFields : [{ name: "No Stock Available", value: "Currently no accounts available." }])
                    .setFooter({ text: "Account Provider" })
                    .setTimestamp(),
            ],
        });
    }
}
