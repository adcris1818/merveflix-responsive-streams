
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Settings, Save, RefreshCw, Upload, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const AdminSettings = () => {
  const [platformSettings, setPlatformSettings] = useState({
    platform_name: 'Merflix',
    platform_description: 'Premium streaming platform',
    support_email: 'support@merflix.com',
    default_language: 'en',
    default_currency: 'USD',
    timezone: 'UTC',
    max_file_upload_size: 100, // MB
    session_timeout: 30, // minutes
    password_min_length: 8
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    stripe_public_key: 'pk_test_...',
    stripe_webhook_secret: 'whsec_...',
    sendgrid_api_key: 'SG...',
    aws_s3_bucket: 'merflix-content',
    aws_region: 'us-east-1',
    tmdb_api_key: 'api_key_here',
    google_analytics_id: 'GA-...'
  });

  const [contentSettings, setContentSettings] = useState({
    auto_approve_content: false,
    content_moderation: true,
    max_video_bitrate: 8000, // kbps
    supported_video_formats: ['mp4', 'webm', 'mov'],
    thumbnail_sizes: ['480x270', '1280x720', '1920x1080'],
    subtitle_formats: ['srt', 'vtt', 'ass']
  });

  const handleSaveSettings = (settingsType) => {
    console.log(`Saving ${settingsType} settings...`);
    // Implement settings save logic
  };

  const handleExportSettings = () => {
    console.log('Exporting settings...');
    // Implement settings export
  };

  const handleImportSettings = () => {
    console.log('Importing settings...');
    // Implement settings import
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
              <p className="text-gray-600">Configure platform settings and integrations</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleImportSettings}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" onClick={handleExportSettings}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="platform" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="platform">Platform</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="platform">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Platform Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="platform_name">Platform Name</Label>
                      <Input
                        id="platform_name"
                        value={platformSettings.platform_name}
                        onChange={(e) => setPlatformSettings({
                          ...platformSettings, 
                          platform_name: e.target.value
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="support_email">Support Email</Label>
                      <Input
                        id="support_email"
                        type="email"
                        value={platformSettings.support_email}
                        onChange={(e) => setPlatformSettings({
                          ...platformSettings, 
                          support_email: e.target.value
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="default_language">Default Language</Label>
                      <Select 
                        value={platformSettings.default_language}
                        onValueChange={(value) => setPlatformSettings({
                          ...platformSettings, 
                          default_language: value
                        })}
                      >
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

                    <div>
                      <Label htmlFor="default_currency">Default Currency</Label>
                      <Select 
                        value={platformSettings.default_currency}
                        onValueChange={(value) => setPlatformSettings({
                          ...platformSettings, 
                          default_currency: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                      <Input
                        id="session_timeout"
                        type="number"
                        value={platformSettings.session_timeout}
                        onChange={(e) => setPlatformSettings({
                          ...platformSettings, 
                          session_timeout: parseInt(e.target.value)
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="password_min_length">Password Min Length</Label>
                      <Input
                        id="password_min_length"
                        type="number"
                        value={platformSettings.password_min_length}
                        onChange={(e) => setPlatformSettings({
                          ...platformSettings, 
                          password_min_length: parseInt(e.target.value)
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="platform_description">Platform Description</Label>
                    <textarea
                      id="platform_description"
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      value={platformSettings.platform_description}
                      onChange={(e) => setPlatformSettings({
                        ...platformSettings, 
                        platform_description: e.target.value
                      })}
                    />
                  </div>

                  <Button onClick={() => handleSaveSettings('platform')}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Platform Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Third-Party Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Stripe Settings */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-lg mb-4">Stripe Payment Processing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stripe_public">Public Key</Label>
                        <Input
                          id="stripe_public"
                          value={integrationSettings.stripe_public_key}
                          onChange={(e) => setIntegrationSettings({
                            ...integrationSettings, 
                            stripe_public_key: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="stripe_webhook">Webhook Secret</Label>
                        <Input
                          id="stripe_webhook"
                          type="password"
                          value={integrationSettings.stripe_webhook_secret}
                          onChange={(e) => setIntegrationSettings({
                            ...integrationSettings, 
                            stripe_webhook_secret: e.target.value
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* AWS Settings */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-lg mb-4">AWS S3 Storage</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="s3_bucket">S3 Bucket Name</Label>
                        <Input
                          id="s3_bucket"
                          value={integrationSettings.aws_s3_bucket}
                          onChange={(e) => setIntegrationSettings({
                            ...integrationSettings, 
                            aws_s3_bucket: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="aws_region">AWS Region</Label>
                        <Select 
                          value={integrationSettings.aws_region}
                          onValueChange={(value) => setIntegrationSettings({
                            ...integrationSettings, 
                            aws_region: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                            <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                            <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                            <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Email Settings */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-lg mb-4">SendGrid Email Service</h4>
                    <div>
                      <Label htmlFor="sendgrid_key">API Key</Label>
                      <Input
                        id="sendgrid_key"
                        type="password"
                        value={integrationSettings.sendgrid_api_key}
                        onChange={(e) => setIntegrationSettings({
                          ...integrationSettings, 
                          sendgrid_api_key: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSettings('integrations')}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Integration Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Auto-approve Content</h4>
                        <p className="text-sm text-gray-600">Automatically approve uploaded content</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={contentSettings.auto_approve_content}
                        onChange={(e) => setContentSettings({
                          ...contentSettings, 
                          auto_approve_content: e.target.checked
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Content Moderation</h4>
                        <p className="text-sm text-gray-600">Enable automatic content moderation</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={contentSettings.content_moderation}
                        onChange={(e) => setContentSettings({
                          ...contentSettings, 
                          content_moderation: e.target.checked
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="max_bitrate">Maximum Video Bitrate (kbps)</Label>
                    <Input
                      id="max_bitrate"
                      type="number"
                      value={contentSettings.max_video_bitrate}
                      onChange={(e) => setContentSettings({
                        ...contentSettings, 
                        max_video_bitrate: parseInt(e.target.value)
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="video_formats">Supported Video Formats</Label>
                    <Input
                      id="video_formats"
                      value={contentSettings.supported_video_formats.join(', ')}
                      onChange={(e) => setContentSettings({
                        ...contentSettings, 
                        supported_video_formats: e.target.value.split(', ')
                      })}
                      placeholder="mp4, webm, mov"
                    />
                  </div>

                  <Button onClick={() => handleSaveSettings('content')}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Content Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4 bg-yellow-50">
                    <h4 className="font-medium text-yellow-800 mb-2">⚠️ Warning</h4>
                    <p className="text-sm text-yellow-700">
                      These settings can significantly impact platform performance. 
                      Only modify if you understand the implications.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear All Caches
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download System Logs
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Reset to Default Settings
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Database Operations</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">Optimize Database</Button>
                      <Button variant="outline" size="sm">Rebuild Search Index</Button>
                      <Button variant="outline" size="sm">Clean Up Orphaned Files</Button>
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

export default AdminSettings;
