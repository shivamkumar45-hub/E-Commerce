import express from "express";
import { roleBasedAccess, verifyUserAuth } from "../Middleware/userAuth.js";
import { AllMyOrders, createOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from "../Controller/orderController.js";
const router = express.Router();


router.route("/new/order").post(verifyUserAuth,createOrder);
router.route("/order/:id")
.get(verifyUserAuth,getSingleOrder)

router.route("/admin/order/:id")
.put(verifyUserAuth,roleBasedAccess("admin"), updateOrderStatus)
.delete(verifyUserAuth,roleBasedAccess("admin"), deleteOrder);

router.route("/admin/orders")
.get(verifyUserAuth,roleBasedAccess("admin"), getAllOrders);

router.route("/orders/user")
.get(verifyUserAuth,AllMyOrders);

export default router;