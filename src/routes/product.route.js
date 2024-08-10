const express = require("express");
const productController = require("../controllers/product.controller");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);

router.post("/create", productController.createProduct);

router.patch("/upsert-product", productController.upsetProduct);

module.exports = router;
