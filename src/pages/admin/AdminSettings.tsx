
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Settings, Save, Database, Mail, Shield, Globe, Palette, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  is_public: boolean;
}

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async (): Promise<SystemSetting[]> => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      return data || [];
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, description, is_public }: { key: string; value: any; description?: string; is_public: boolean }) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          key,
          value,
          description,
          is_public,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success('Settings updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    },
  });

  const getSetting = (key: string) => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || '';
  };

  const handleSaveSetting = (key: string, value: any, description?: string, is_public: boolean = false) => {
    updateSettingMutation.mutate({ key, value, description, is_public });
  };

  const GeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Site Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="site_name">Site Name</Label>
            <Input
              id="site_name"
              defaultValue={getSetting('site_name') || 'MerFlix'}
              onBlur={(e) => handleSaveSetting('site_name', e.target.value, 'Site name displayed in header', true)}
            />
          </div>
          <div>
            <Label htmlFor="site_description">Site Description</Label>
            <Textarea
              id="site_description"
              defaultValue={getSetting('site_description') || 'Premium streaming platform'}
              onBlur={(e) => handleSaveSetting('site_description', e.target.value, 'Site description for SEO', true)}
            />
          </div>
          <div>
            <Label htmlFor="support_email">Support Email</Label>
            <Input
              id="support_email"
              type="email"
              defaultValue={getSetting('support_email') || 'support@merflix.com'}
              onBlur={(e) => handleSaveSetting('support_email', e.target.value, 'Support contact email')}
            />
          </div>
          <div>
            <Label htmlFor="max_devices">Max Devices Per User</Label>
            <Select
              defaultValue={getSetting('max_devices')?.toString() || '3'}
              onValueChange={(value) => handleSaveSetting('max_devices', parseInt(value), 'Maximum devices per user account')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Device</SelectItem>
                <SelectItem value="2">2 Devices</SelectItem>
                <SelectItem value="3">3 Devices</SelectItem>
                <SelectItem value="5">5 Devices</SelectItem>
                <SelectItem value="10">10 Devices</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Force HTTPS</Label>
              <p className="text-sm text-gray-600">Redirect all HTTP traffic to HTTPS</p>
            </div>
            <Switch
              defaultChecked={getSetting('force_https') || true}
              onCheckedChange={(checked) => handleSaveSetting('force_https', checked, 'Force HTTPS redirects')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable 2FA</Label>
              <p className="text-sm text-gray-600">Require two-factor authentication for admins</p>
            </div>
            <Switch
              defaultChecked={getSetting('require_2fa') || false}
              onCheckedChange={(checked) => handleSaveSetting('require_2fa', checked, 'Require 2FA for admin accounts')}
            />
          </div>
          <div>
            <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
            <Select
              defaultValue={getSetting('session_timeout')?.toString() || '60'}
              onValueChange={(value) => handleSaveSetting('session_timeout', parseInt(value), 'Session timeout in minutes')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="480">8 hours</SelectItem>
                <SelectItem value="1440">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
            <Select
              defaultValue={getSetting('max_login_attempts')?.toString() || '5'}
              onValueChange={(value) => handleSaveSetting('max_login_attempts', parseInt(value), 'Max failed login attempts before lockout')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 attempts</SelectItem>
                <SelectItem value="5">5 attempts</SelectItem>
                <SelectItem value="10">10 attempts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const EmailSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="smtp_host">SMTP Host</Label>
            <Input
              id="smtp_host"
              defaultValue={getSetting('smtp_host') || ''}
              onBlur={(e) => handleSaveSetting('smtp_host', e.target.value, 'SMTP server hostname')}
            />
          </div>
          <div>
            <Label htmlFor="smtp_port">SMTP Port</Label>
            <Input
              id="smtp_port"
              type="number"
              defaultValue={getSetting('smtp_port') || '587'}
              onBlur={(e) => handleSaveSetting('smtp_port', parseInt(e.target.value), 'SMTP server port')}
            />
          </div>
          <div>
            <Label htmlFor="smtp_user">SMTP Username</Label>
            <Input
              id="smtp_user"
              defaultValue={getSetting('smtp_user') || ''}
              onBlur={(e) => handleSaveSetting('smtp_user', e.target.value, 'SMTP authentication username')}
            />
          </div>
          <div>
            <Label htmlFor="from_email">From Email Address</Label>
            <Input
              id="from_email"
              type="email"
              defaultValue={getSetting('from_email') || 'noreply@merflix.com'}
              onBlur={(e) => handleSaveSetting('from_email', e.target.value, 'Default from email address')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Email Notifications</Label>
              <p className="text-sm text-gray-600">Send automated email notifications</p>
            </div>
            <Switch
              defaultChecked={getSetting('email_notifications_enabled') || true}
              onCheckedChange={(checked) => handleSaveSetting('email_notifications_enabled', checked, 'Enable automated email notifications')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MediaSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Media Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="max_file_size">Max Upload Size (MB)</Label>
            <Select
              defaultValue={getSetting('max_file_size')?.toString() || '100'}
              onValueChange={(value) => handleSaveSetting('max_file_size', parseInt(value), 'Maximum file upload size in MB')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50 MB</SelectItem>
                <SelectItem value="100">100 MB</SelectItem>
                <SelectItem value="500">500 MB</SelectItem>
                <SelectItem value="1000">1 GB</SelectItem>
                <SelectItem value="5000">5 GB</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="allowed_formats">Allowed Video Formats</Label>
            <Input
              id="allowed_formats"
              defaultValue={getSetting('allowed_formats') || 'mp4,avi,mkv,mov'}
              onBlur={(e) => handleSaveSetting('allowed_formats', e.target.value, 'Comma-separated list of allowed video formats')}
              placeholder="mp4,avi,mkv,mov"
            />
          </div>
          <div>
            <Label htmlFor="cdn_url">CDN Base URL</Label>
            <Input
              id="cdn_url"
              defaultValue={getSetting('cdn_url') || ''}
              onBlur={(e) => handleSaveSetting('cdn_url', e.target.value, 'CDN base URL for media delivery')}
              placeholder="https://cdn.merflix.com"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Generate Thumbnails</Label>
              <p className="text-sm text-gray-600">Automatically generate video thumbnails</p>
            </div>
            <Switch
              defaultChecked={getSetting('auto_thumbnails') || true}
              onCheckedChange={(checked) => handleSaveSetting('auto_thumbnails', checked, 'Auto-generate video thumbnails')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AdminSidebar />
        <main className="ml-64 pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
            <p className="text-gray-600">Configure platform settings and preferences</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <GeneralSettings />
            </TabsContent>

            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="email">
              <EmailSettings />
            </TabsContent>

            <TabsContent value="media">
              <MediaSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminSettings;
