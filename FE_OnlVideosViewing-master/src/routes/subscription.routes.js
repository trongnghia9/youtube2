const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { authMiddleware } = require('../middleware/auth');

// Get all subscription plans
router.get('/', subscriptionController.getSubscriptionPlans);

// Subscribe to a plan
router.post('/subscribe', authMiddleware, subscriptionController.subscribe);

// Get user's current subscription
router.get('/user', authMiddleware, subscriptionController.getUserSubscription);

// Cancel subscription
router.post('/cancel', authMiddleware, subscriptionController.cancelSubscription);

module.exports = router; 