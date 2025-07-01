
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

export const BillingTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-gray-400" />
              <div>
                <p className="font-medium">•••• •••• •••• 4567</p>
                <p className="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Next billing date</h4>
          <p className="text-gray-600">January 15, 2024</p>
          <p className="text-sm text-gray-500">You'll be charged $13.99 for your Standard plan</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Update Payment Method</Button>
          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
            Cancel Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
