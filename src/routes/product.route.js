const express = require("express");

const {getAllProducts,createProduct,updateProduct,getSingleProduct,deleteProduct, createProductReview, getAllReviews, deleteReview, getAllAdminProducts} = require("../controllers/productController");
const {authenticate,authorizeRole} = require("../middlewares/authenticate");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(authenticate,authorizeRole("admin"),createProduct);
router.route("/admin/product/:id").patch(authenticate,authorizeRole("admin"),updateProduct);
router.route("/admin/products/:id").delete(authenticate,authorizeRole("admin"),deleteProduct);
router.route("/admin/products").get(authenticate,authorizeRole("admin"),getAllAdminProducts)
router.route("/products/:id").get(getSingleProduct)
router.route("/review").put(authenticate,createProductReview);
router.route("/reviews").get(getAllReviews).delete(authenticate,deleteReview);
module.exports = router;