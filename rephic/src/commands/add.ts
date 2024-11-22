import { Discord, SimpleCommand, SimpleCommandMessage, SimpleCommandOption, SimpleCommandOptionType } from "discordx";
import StockDataModel from "../models/stockmodel.js";
import { EmbedBuilder, Colors } from "discord.js";

@Discord()
class AddCommand {
    @SimpleCommand({ name: "add" })
    async add(
        @SimpleCommandOption({ name: "account", type: SimpleCommandOptionType.String, description: "Account in the format email:pass" }) account: string | undefined,
        @SimpleCommandOption({ name: "category", type: SimpleCommandOptionType.String, description: "Category to add the account to" }) category: string | undefined,
        command: SimpleCommandMessage
    ): Promise<void> {
        if (!account || !category) {
            return void command.message.reply({
                content: "Usage: `.add <email:pass> <category>`",
            });
        }

        const [email, password] = account.split(":");

        if (!email || !password) {
            return void command.message.reply({
                content: "Invalid account format. Ensure the format is `email:pass`.",
            });
        }

        const guildId = command.message.guild?.id;

        if (!guildId) {
            return void command.message.reply({
                content: "Guild information is missing. Please run the command in a server.",
            });
        }

        let stockData = await StockDataModel.findOne({ guildId });

        if (!stockData) {
            stockData = new StockDataModel({
                guildId,
                ownerId: command.message.guild?.ownerId || "",
                guildName: command.message.guild?.name || "Unknown",
                stock: [],
                customers: [],
            });
        }

        let categoryData = stockData.stock.find((cat) => cat.categoryName.toLowerCase() === category.toLowerCase());

        if (!categoryData) {
            categoryData = { categoryName: category, accounts: [] };
            stockData.stock.push(categoryData);
        }

        categoryData.accounts.push({
            email,
            password,
            addedBy: command.message.author.username,
            addedWhen: new Date(),
            notes: "",
        });

        await stockData.save();

        const embed = new EmbedBuilder()
            .setTitle("Account Added")
            .setDescription(`Account **${email}** added to the **${category}** category.`)
            .setColor(Colors.Green)
            .setFooter({ text: "Account Provider" })
            .setTimestamp();

        await command.message.reply({ embeds: [embed] });
    }
}

export default AddCommand;
