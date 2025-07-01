
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProfileTab } from '../components/account/ProfileTab';
import { SubscriptionTab } from '../components/account/SubscriptionTab';
import { BillingTab } from '../components/account/BillingTab';
import { DevicesTab } from '../components/account/DevicesTab';
import { PrivacyTab } from '../components/account/PrivacyTab';
import { NotificationsTab } from '../components/account/NotificationsTab';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    language: 'English',
    country: 'United States'
  });

  const subscriptionPlans = [
    { name: 'Basic', price: '$8.99', features: ['HD streaming', '1 screen', 'Mobile & tablet'], current: false },
    { name: 'Standard', price: '$13.99', features: ['HD streaming', '2 screens', 'All devices'], current: true },
    { name: 'Premium', price: '$17.99', features: ['4K + HDR', '4 screens', 'All devices', 'Downloads'], current: false }
  ];

  const devices = [
    { name: 'MacBook Pro', type: 'Desktop', lastUsed: '2 hours ago', status: 'Active' },
    { name: 'iPhone 14 Pro', type: 'Mobile', lastUsed: '1 day ago', status: 'Active' },
    { name: 'Samsung TV', type: 'TV', lastUsed: '3 days ago', status: 'Inactive' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
              <p className="text-gray-600">Manage your account preferences and subscription</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <ProfileTab profile={profile} setProfile={setProfile} />
              </TabsContent>

              <TabsContent value="subscription">
                <SubscriptionTab subscriptionPlans={subscriptionPlans} />
              </TabsContent>

              <TabsContent value="billing">
                <BillingTab />
              </TabsContent>

              <TabsContent value="devices">
                <DevicesTab devices={devices} />
              </TabsContent>

              <TabsContent value="privacy">
                <PrivacyTab />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccountSettings;
