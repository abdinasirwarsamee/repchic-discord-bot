import mongoose, { Document, Schema, model } from "mongoose";

interface ICategory {
  categoryName: string;
  accounts: { email: string; password: string; addedBy: string; addedWhen: Date; notes?: string | null }[];
}

interface IStockData extends Document {
  guildId: string;
  ownerId: string;
  guildName: string;
  stock: ICategory[]; 
  customers: any[]; 
}

const stockSchema = new Schema<IStockData>({
  guildId: { type: String, required: true },
  ownerId: { type: String, required: true },
  guildName: { type: String, required: true },
  stock: [
    {
      categoryName: { type: String, required: true },
      accounts: [
        {
          email: { type: String, required: true },
          password: { type: String, required: true },
          addedBy: { type: String, required: true },
          addedWhen: { type: Date, required: true, default: Date.now },
          notes: { type: String, required: false },
        },
      ],
    },
  ],
  customers: [
    {
      discordId: { type: String, required: true },
      discordUser: { type: String, required: true },
      itemsBought: [
        {
          accountEmail: { type: String, required: true },
          purchaseDate: { type: Date, required: true, default: Date.now },
        },
      ],
    },
  ],
}, { timestamps: true });

const StockDataModel = model<IStockData>("StockData", stockSchema);

export default StockDataModel;
