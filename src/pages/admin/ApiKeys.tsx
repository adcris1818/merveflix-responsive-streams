
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { useToast } from '../../hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';

const ApiKeys = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState({
    name: '',
    permissions: [],
    rate_limit: 1000,
    expires_at: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const createApiKey = useMutation({
    mutationFn: async (keyData: typeof newKey) => {
      // Generate a secure API key
      const apiKey = `mk_${Math.random().toString(36).substr(2, 32)}`;
      const keyHash = btoa(apiKey); // In production, use proper hashing
      const keyPrefix = apiKey.substring(0, 12);

      const expiresAt = keyData.expires_at ? new Date(keyData.expires_at).toISOString() : null;

      const { data, error } = await supabase
        .from('api_keys')
        .insert([{
          name: keyData.name,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          permissions: keyData.permissions,
          rate_limit: keyData.rate_limit,
          expires_at: expiresAt,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      return { ...data, full_key: apiKey };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setIsCreateDialogOpen(false);
      setNewKey({ name: '', permissions: [], rate_limit: 1000, expires_at: '' });
      
      // Show the full API key to the user (one time only)
      toast({ 
        title: 'API Key Created!',
        description: `Save this key: ${data.full_key}. You won't see it again.`
      });
    },
    onError: (error) => {
      toast({ title: 'Error creating API key', description: error.message, variant: 'destructive' });
    }
  });

  const toggleApiKey = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !isActive })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({ title: 'API key updated successfully!' });
    }
  });

  const deleteApiKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({ title: 'API key deleted successfully!' });
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  const availablePermissions = [
    { id: 'content.read', label: 'Read Content' },
    { id: 'content.write', label: 'Write Content' },
    { id: 'users.read', label: 'Read Users' },
    { id: 'analytics.read', label: 'Read Analytics' },
    { id: 'admin.read', label: 'Admin Read' }
  ];

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setNewKey(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const totalKeys = apiKeys.length;
  const activeKeys = apiKeys.filter(key => key.is_active).length;
  const totalUsage = apiKeys.reduce((sum, key) => sum + (key.usage_count || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">API Keys</h1>
              <p className="text-gray-600">Manage API access keys and permissions</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Key Name</Label>
                    <Input
                      id="name"
                      value={newKey.name}
                      onChange={(e) => setNewKey({...newKey, name: e.target.value})}
                      placeholder="e.g., Mobile App API"
                    />
                  </div>
                  
                  <div>
                    <Label>Permissions</Label>
                    <div className="mt-2 space-y-2">
                      {availablePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={newKey.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked === true)
                            }
                          />
                          <Label htmlFor={permission.id} className="text-sm">
                            {permission.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="rate_limit">Rate Limit (requests/hour)</Label>
                    <Select
                      value={newKey.rate_limit.toString()}
                      onValueChange={(value) => setNewKey({...newKey, rate_limit: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 requests/hour</SelectItem>
                        <SelectItem value="500">500 requests/hour</SelectItem>
                        <SelectItem value="1000">1,000 requests/hour</SelectItem>
                        <SelectItem value="5000">5,000 requests/hour</SelectItem>
                        <SelectItem value="10000">10,000 requests/hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
                    <Input
                      id="expires_at"
                      type="date"
                      value={newKey.expires_at}
                      onChange={(e) => setNewKey({...newKey, expires_at: e.target.value})}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => createApiKey.mutate(newKey)}
                    disabled={createApiKey.isPending || !newKey.name}
                    className="w-full"
                  >
                    {createApiKey.isPending ? 'Creating...' : 'Create API Key'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
                <Key className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalKeys}</div>
                <p className="text-xs text-gray-600">All API keys</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
                <Eye className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeKeys}</div>
                <p className="text-xs text-green-600">Currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                <Activity className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{totalUsage.toLocaleString()}</div>
                <p className="text-xs text-blue-600">API calls made</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {apiKeys.filter(key => {
                    if (!key.expires_at) return false;
                    const expiryDate = new Date(key.expires_at);
                    const sevenDaysFromNow = new Date();
                    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
                    return expiryDate <= sevenDaysFromNow;
                  }).length}
                </div>
                <p className="text-xs text-orange-600">Next 7 days</p>
              </CardContent>
            </Card>
          </div>

          {/* API Keys Table */}
          <Card>
            <CardHeader>
              <CardTitle>API Keys Management</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading API keys...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell>
                          <div className="font-medium">{apiKey.name}</div>
                          <div className="text-sm text-gray-500">
                            Created {new Date(apiKey.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {apiKey.key_prefix}...
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key_prefix)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(apiKey.permissions as string[] || []).map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {(apiKey.usage_count || 0).toLocaleString()} calls
                            <div className="text-xs text-gray-500">
                              Limit: {(apiKey.rate_limit || 0).toLocaleString()}/hr
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                            {apiKey.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {apiKey.expires_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              Expires {new Date(apiKey.expires_at).toLocaleDateString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {apiKey.last_used_at 
                              ? new Date(apiKey.last_used_at).toLocaleDateString()
                              : 'Never'
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleApiKey.mutate({ id: apiKey.id, isActive: apiKey.is_active })}
                            >
                              {apiKey.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteApiKey.mutate(apiKey.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApiKeys;
