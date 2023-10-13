const express = require("express");
const {getAllUsers, getSingleUser, deleteUser, updateUser,logout, forgotPassword} = require("../controllers/user.controller");

const router = express.Router();

router.route("/users").get(getAllUsers);
router.route("/users/:id").get(getSingleUser);
router.route("/users/:id").delete(deleteUser);
router.route("/users/:id").patch(updateUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword)
module.exports = router;