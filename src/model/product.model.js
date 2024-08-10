const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  productImages: {
    type: [String],
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  featuredImages: {
    type: [String],
  },
  warranty: {
    type: String,
  },
  replacementDays: {
    type: Number,
    default: 0,
  },
  specifications: {
    type: Map,
    required: true,
  },
  features: {
    type: Map,
    of: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
