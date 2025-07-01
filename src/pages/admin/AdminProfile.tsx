
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { User, Mail, Shield, Key, Bell, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    full_name: 'Admin User',
    email: 'admin@merflix.com',
    role: 'super_admin',
    phone: '+1 (555) 123-4567',
    avatar_url: '',
    timezone: 'UTC-5',
    language: 'en'
  });

  const [security, setSecurity] = useState({
    two_factor_enabled: true,
    last_password_change: '2024-01-15',
    login_notifications: true,
    api_access: true
  });

  const [notifications, setNotifications] = useState({
    email_alerts: true,
    sms_alerts: false,
    push_notifications: true,
    weekly_reports: true,
    security_alerts: true
  });

  const handleProfileSave = () => {
    console.log('Saving profile:', profile);
    // Implement profile save logic
  };

  const handleSecuritySave = () => {
    console.log('Saving security settings:', security);
    // Implement security settings save
  };

  const handleNotificationsSave = () => {
    console.log('Saving notification settings:', notifications);
    // Implement notifications save
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
            <p className="text-gray-600">Manage your admin account settings and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Change Avatar</Button>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={profile.role} onValueChange={(value) => setProfile({...profile, role: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="UTC+0">UTC</SelectItem>
                          <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select value={profile.language} onValueChange={(value) => setProfile({...profile, language: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleProfileSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${security.two_factor_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {security.two_factor_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <Button variant="outline" size="sm">
                          {security.two_factor_enabled ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-gray-600">Last changed: {security.last_password_change}</p>
                      </div>
                      <Button variant="outline" size="sm">Change Password</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">API Access</h4>
                        <p className="text-sm text-gray-600">Allow API access with your credentials</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={security.api_access}
                          onChange={(e) => setSecurity({...security, api_access: e.target.checked})}
                        />
                        <span className="text-sm">{security.api_access ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Login Notifications</h4>
                        <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={security.login_notifications}
                          onChange={(e) => setSecurity({...security, login_notifications: e.target.checked})}
                        />
                        <span className="text-sm">{security.login_notifications ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSecuritySave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Alerts</h4>
                        <p className="text-sm text-gray-600">Receive important updates via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.email_alerts}
                        onChange={(e) => setNotifications({...notifications, email_alerts: e.target.checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS Alerts</h4>
                        <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.sms_alerts}
                        onChange={(e) => setNotifications({...notifications, sms_alerts: e.target.checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Browser push notifications</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.push_notifications}
                        onChange={(e) => setNotifications({...notifications, push_notifications: e.target.checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Weekly Reports</h4>
                        <p className="text-sm text-gray-600">Weekly analytics and performance reports</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.weekly_reports}
                        onChange={(e) => setNotifications({...notifications, weekly_reports: e.target.checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Security Alerts</h4>
                        <p className="text-sm text-gray-600">Security-related notifications</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.security_alerts}
                        onChange={(e) => setNotifications({...notifications, security_alerts: e.target.checked})}
                      />
                    </div>
                  </div>

                  <Button onClick={handleNotificationsSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-medium">Login from new device</p>
                      <p className="text-sm text-gray-600">MacBook Pro - Chrome • 2 hours ago</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="font-medium">User permissions updated</p>
                      <p className="text-sm text-gray-600">Updated role for john.doe@example.com • 5 hours ago</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <p className="font-medium">System settings changed</p>
                      <p className="text-sm text-gray-600">Updated payment gateway settings • 1 day ago</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <p className="font-medium">New content added</p>
                      <p className="text-sm text-gray-600">Added 5 new movies to catalog • 2 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminProfile;
