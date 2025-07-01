
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface SubscriptionPlan {
  name: string;
  price: string;
  features: string[];
  current: boolean;
}

interface SubscriptionTabProps {
  subscriptionPlans: SubscriptionPlan[];
}

export const SubscriptionTab = ({ subscriptionPlans }: SubscriptionTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div key={plan.name} className={`border rounded-lg p-6 ${plan.current ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-2xl font-bold text-red-600">{plan.price}</p>
                <p className="text-gray-600">per month</p>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600">• {feature}</li>
                ))}
              </ul>
              <Button 
                className={`w-full ${plan.current ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Select Plan'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
