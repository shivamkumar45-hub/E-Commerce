import express from "express";
import {
  deleteUser,
  getAllUsersList,
  getSingleUserDetails,
  getUserDetails,
  LoginUser,
  LogOutUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUserRole,
} from "../Controller/userController.js";
const Router = express.Router();
import { roleBasedAccess, verifyUserAuth } from "../Middleware/userAuth.js";

Router.route("/register").post(registerUser);
Router.route("/login").post(LoginUser);
Router.route("/logout").post(LogOutUser);
Router.route("/password/forgot").post(requestPasswordReset);
Router.route("/reset/:token").post(resetPassword);
Router.route("/profile").get(verifyUserAuth, getUserDetails);
Router.route("/password/update").put(verifyUserAuth, updatePassword);
Router.route("/profile/update").put(verifyUserAuth, updateProfile);
Router.route("/admin/users").get(
  verifyUserAuth,
  roleBasedAccess("admin"),
  getAllUsersList
);
Router.route("/admin/user/:id")
  .get(verifyUserAuth, roleBasedAccess("admin"), getSingleUserDetails)
  .put(verifyUserAuth, roleBasedAccess("admin"), updateUserRole)
  .delete(verifyUserAuth,roleBasedAccess("admin"),deleteUser)

export default Router;
