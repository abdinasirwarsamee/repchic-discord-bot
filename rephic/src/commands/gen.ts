import { EmbedBuilder, Colors, GuildMember } from "discord.js";
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType, SimpleCommandMessage } from "discordx";
import StockDataModel from "../models/stockmodel.js";

@Discord()
class GenerateCommand {
    @SimpleCommand({ name: "gen" })
    async gen(
        @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User, description: "The user to receive the account" }) user: GuildMember,
        @SimpleCommandOption({ name: "category", type: SimpleCommandOptionType.String, description: "Category to pull the account from" }) category: string | undefined,
        command: SimpleCommandMessage
    ): Promise<void> {
        const guildId = command.message.guild?.id;

        if (!guildId) {
            return void command.message.reply({
                content: "Guild information is missing. Please run the command in a server.",
            });
        }

        if (!category) {
            return void command.message.reply({
                content: "Please specify the stock category. Usage: `.gen <@user> <category>`",
            });
        }

        const stockData = await StockDataModel.findOne({ guildId });

        if (!stockData) {
            return void command.message.reply({
                content: "No stock data found for this server.",
            });
        }

        const categoryData = stockData.stock.find((cat) => cat.categoryName.toLowerCase() === category.toLowerCase());

        if (!categoryData || categoryData.accounts.length === 0) {
            return void command.message.reply({
                content: `No accounts available in the category \`${category}\`. Please try again later.`,
            });
        }

        const account = categoryData.accounts.shift(); 

        if (!account) {
            return void command.message.reply({
                content: "No available account to generate. Please try again later.",
            });
        }

        if (!user || !user.id || !user.user.username) {
            return void command.message.reply({
                content: "Invalid user information. Please try again.",
            });
        }

        stockData.customers.push({
            discordId: user.id,
            discordUser: user.user.username,
            itemsBought: [
                {
                    accountEmail: account.email || "Unknown",
                    purchaseDate: new Date(),
                },
            ],
        });

        await stockData.save();

        const embed = new EmbedBuilder()
            .setTitle("Account Generated")
            .setDescription(`You have received an account from the category **${category}**.`)
            .addFields(
                { name: "__**Account Email**__", value: account.email || "Unknown", inline: true },
                { name: "__**Account Password**__", value: account.password || "Unknown", inline: true },
                { name: "__**Notes**__", value: account.notes || "No notes available", inline: true }
            )
            .setColor(Colors.Green)
            .setFooter({ text: "Account Provider" })
            .setTimestamp();

        await user.send({ embeds: [embed] });

        command.message.reply({
            content: `Successfully sent an account from the **${category}** category to ${user}.`,
        });
    }
}

export default GenerateCommand;
