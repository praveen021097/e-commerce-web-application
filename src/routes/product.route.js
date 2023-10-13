const express = require("express");

const {getAllProducts,createProduct,updateProduct,getSingleProduct,deleteProduct} = require("../controllers/productController");
const {authenticate,authorizeRole} = require("../middlewares/authenticate");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/new").post(authenticate,authorizeRole("admin"),createProduct);
router.route("/product/:id").patch(authenticate,authorizeRole("admin"),updateProduct);
router.route("/products/:id").delete(deleteProduct);
router.route("/products/:id").get(getSingleProduct)

module.exports = router;