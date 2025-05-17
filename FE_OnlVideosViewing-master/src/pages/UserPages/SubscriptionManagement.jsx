import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubscriptionManagement = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserSubscription();
  }, []);

  const fetchUserSubscription = async () => {
    try {
      const response = await axios.get('/api/subscriptions/user');
      setSubscription(response.data);
    } catch (err) {
      setError('Error fetching subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await axios.post('/api/subscriptions/cancel');
      fetchUserSubscription(); // Refresh subscription data
    } catch (err) {
      setError('Error cancelling subscription');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">No Active Subscription</h2>
          <p className="mt-4 text-lg text-gray-600">
            You don't have any active subscription plan.
          </p>
          <button
            onClick={() => navigate('/subscription')}
            className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Subscription Details
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Plan</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {subscription.subscriptionId.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                    subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(subscription.startDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">End Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(subscription.endDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Auto Renew</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {subscription.autoRenew ? 'Yes' : 'No'}
              </dd>
            </div>
          </dl>
        </div>
        {subscription.status === 'active' && (
          <div className="px-4 py-5 sm:px-6">
            <button
              onClick={handleCancelSubscription}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
      )}
    </div>
  );
};

export default SubscriptionManagement; 