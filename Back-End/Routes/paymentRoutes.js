import express from 'express';
import { verifyUserAuth } from '../Middleware/userAuth.js';
import { paymentVerification, processPayment, sendApiKey } from '../Controller/paymentController.js';
const router=express.Router();

router.route('/payment/process').post(verifyUserAuth,processPayment);
router.route('/getKey').get(verifyUserAuth,sendApiKey);
router.route('/paymentVerification').post(paymentVerification);

export default router;