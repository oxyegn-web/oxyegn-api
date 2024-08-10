const Product = require("../model/product.model");
const {
  upsertOne,
  createOne,
  getAll,
  getOne,
} = require("../utills/handelCrud");

exports.upsetProduct = upsertOne(Product);
exports.createProduct = createOne(Product);
exports.getAllProducts = getAll(Product);
exports.getProduct = getOne(Product);
