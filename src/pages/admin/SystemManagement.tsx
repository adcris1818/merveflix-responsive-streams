
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Settings, Server, Database, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const SystemManagement = () => {
  const [systemSettings, setSystemSettings] = useState({
    site_name: 'Merflix',
    maintenance_mode: false,
    max_concurrent_streams: 4,
    content_cache_duration: 3600,
    api_rate_limit: 1000,
    backup_frequency: 'daily',
    log_retention_days: 30
  });

  const systemStatus = {
    server_health: 'healthy',
    database_status: 'connected',
    storage_usage: 67,
    api_response_time: 145,
    active_users: 2847,
    uptime: '99.9%'
  };

  const handleSettingsSave = () => {
    console.log('Saving system settings:', systemSettings);
    // Implement settings save
  };

  const handleMaintenanceToggle = () => {
    setSystemSettings(prev => ({
      ...prev,
      maintenance_mode: !prev.maintenance_mode
    }));
  };

  const handleBackupNow = () => {
    console.log('Starting manual backup...');
    // Implement manual backup
  };

  const handleClearCache = () => {
    console.log('Clearing system cache...');
    // Implement cache clearing
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Management</h1>
            <p className="text-gray-600">Monitor system health and manage configurations</p>
          </div>

          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Server
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{systemStatus.storage_usage}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${systemStatus.storage_usage}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">API Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{systemStatus.api_response_time}ms</div>
                <div className="text-xs text-gray-500">Average</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{systemStatus.active_users.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Online now</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600">{systemStatus.uptime}</div>
                <div className="text-xs text-gray-500">Last 30 days</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={systemSettings.site_name}
                      onChange={(e) => setSystemSettings({...systemSettings, site_name: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Maintenance Mode</h4>
                      <p className="text-sm text-gray-600">
                        Temporarily disable the site for maintenance
                      </p>
                    </div>
                    <Button
                      variant={systemSettings.maintenance_mode ? "destructive" : "outline"}
                      onClick={handleMaintenanceToggle}
                    >
                      {systemSettings.maintenance_mode ? 'Disable' : 'Enable'}
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="max_streams">Max Concurrent Streams per User</Label>
                    <Input
                      id="max_streams"
                      type="number"
                      value={systemSettings.max_concurrent_streams}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings, 
                        max_concurrent_streams: parseInt(e.target.value)
                      })}
                    />
                  </div>

                  <Button onClick={handleSettingsSave}>Save General Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="cache_duration">Content Cache Duration (seconds)</Label>
                    <Input
                      id="cache_duration"
                      type="number"
                      value={systemSettings.content_cache_duration}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings, 
                        content_cache_duration: parseInt(e.target.value)
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rate_limit">API Rate Limit (requests per hour)</Label>
                    <Input
                      id="rate_limit"
                      type="number"
                      value={systemSettings.api_rate_limit}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings, 
                        api_rate_limit: parseInt(e.target.value)
                      })}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleClearCache}>Clear Cache</Button>
                    <Button variant="outline">Optimize Database</Button>
                  </div>

                  <Button onClick={handleSettingsSave}>Save Performance Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">SSL Certificate</h4>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Valid until Dec 2024</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Firewall Status</h4>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Active</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">DDoS Protection</h4>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Enabled</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Security Scanning</h4>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-yellow-600">Last scan: 2 days ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button>Run Security Scan</Button>
                    <Button variant="outline">Update SSL Certificate</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance & Backups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="backup_frequency">Backup Frequency</Label>
                    <Select 
                      value={systemSettings.backup_frequency} 
                      onValueChange={(value) => setSystemSettings({
                        ...systemSettings, 
                        backup_frequency: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="log_retention">Log Retention (days)</Label>
                    <Input
                      id="log_retention"
                      type="number"
                      value={systemSettings.log_retention_days}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings, 
                        log_retention_days: parseInt(e.target.value)
                      })}
                    />
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Last Backup</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Database backup completed successfully on Jan 20, 2024 at 3:00 AM
                    </p>
                    <Button onClick={handleBackupNow}>Backup Now</Button>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline">View Backup History</Button>
                    <Button variant="outline">Download Logs</Button>
                  </div>

                  <Button onClick={handleSettingsSave}>Save Maintenance Settings</Button>
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

export default SystemManagement;
