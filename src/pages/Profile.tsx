
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { User, Settings, CreditCard, Bell, Shield, LogOut } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('account');

  const profileTabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Profile Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Profile</h1>
            <p className="text-gray-400 text-lg">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">John Doe</h3>
                    <p className="text-gray-400">Premium Member</p>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  {profileTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-red-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 mt-6 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 rounded-lg p-6">
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-400 mb-2">Full Name</label>
                          <input
                            type="text"
                            defaultValue="John Doe"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-2">Email</label>
                          <input
                            type="email"
                            defaultValue="john.doe@example.com"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 123-4567"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'subscription' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Subscription</h2>
                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">Premium Plan</h3>
                          <p className="text-gray-400">4K Ultra HD, 4 screens</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">$15.99</p>
                          <p className="text-gray-400">per month</p>
                        </div>
                      </div>
                      <p className="text-gray-400 mb-4">Next billing date: January 15, 2024</p>
                      <div className="flex gap-4">
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                          Change Plan
                        </button>
                        <button className="text-red-400 hover:text-red-300 px-4 py-2 transition-colors">
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add more tab content as needed */}
                {activeTab !== 'account' && activeTab !== 'subscription' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      {profileTabs.find(tab => tab.id === activeTab)?.label}
                    </h2>
                    <p className="text-gray-400">
                      This section is coming soon. Stay tuned for more features!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
