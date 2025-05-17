const Subscription = require('../models/subscription.model');
const UserSubscription = require('../models/userSubscription.model');
const Payment = require('../models/payment.model');
const { generateTransactionId } = require('../utils/payment');

exports.getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await Subscription.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription plans' });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const { subscriptionId, paymentMethod } = req.body;
    const userId = req.user.id; // Assuming user is authenticated

    // Get subscription details
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    // Calculate end date based on subscription duration
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + subscription.duration);

    // Create payment record
    const payment = new Payment({
      userId,
      subscriptionId,
      amount: subscription.price,
      paymentMethod,
      transactionId: generateTransactionId(),
    });
    await payment.save();

    // Create user subscription
    const userSubscription = new UserSubscription({
      userId,
      subscriptionId,
      startDate,
      endDate,
    });
    await userSubscription.save();

    res.json({
      message: 'Subscription successful',
      subscription: userSubscription,
      payment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing subscription' });
  }
};

exports.getUserSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active'
    }).populate('subscriptionId');
    
    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }
    
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user subscription' });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.autoRenew = false;
    await subscription.save();

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling subscription' });
  }
}; 