import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await axios.get('/api/subscriptions');
      setPlans(response.data);
    } catch (err) {
      setError('Error fetching subscription plans');
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/subscriptions/subscribe', {
        subscriptionId: selectedPlan._id,
        paymentMethod
      });
      
      // Handle successful subscription
      console.log('Subscription successful:', response.data);
      // Redirect to success page or show success message
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Select the perfect plan for your viewing needs
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
              selectedPlan?._id === plan._id ? 'ring-2 ring-indigo-600' : ''
            }`}
          >
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-4 text-gray-500">{plan.description}</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-base font-medium text-gray-500">
                  /month
                </span>
              </p>
              <button
                onClick={() => setSelectedPlan(plan)}
                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                  selectedPlan?._id === plan._id
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {selectedPlan?._id === plan._id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
            <div className="px-6 pt-6 pb-8">
              <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                What's included
              </h4>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-12 max-w-lg mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Payment Method
              </h3>
              <div className="mt-4">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              {error && (
                <div className="mt-4 text-red-600 text-sm">{error}</div>
              )}

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage; 