const express = require("express");
const { getAllUsers, getSingleUser, deleteUser, updateUser, logout, forgotPassword, getUserDetails, updatePassword, updateProfile, updateUserRole } = require("../controllers/user.controller");
const {authenticate, authorizeRole} = require("../middlewares/authenticate")
const router = express.Router();

router.route("/admin/users").get(authenticate,authorizeRole("admin"),getAllUsers);
router.route("/admin/users/:id").get(authenticate,authorizeRole("admin"),getSingleUser);
router.route("/admin/users/:id").delete(authenticate,authorizeRole("admin"),deleteUser);
router.route("/users/:id").patch(updateUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/me").get(authenticate,getUserDetails);
router.route("/password/update").put(authenticate,updatePassword)
router.route("/me/update").put(authenticate,updateProfile)
router.route("/admin/update/role/:id").post(updateUserRole)
module.exports = router;