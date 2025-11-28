import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
        quantity: { type: Number, required: true, min: 1 }
      }
    ],
    total: { type: Number, required: true },
    currency: { type: String, default: "NGN" },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending"
    },
    customerEmail: { type: String, required: true, lowercase: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
