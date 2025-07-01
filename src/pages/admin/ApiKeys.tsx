
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Key, Plus, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useQuery } from '@tanstack/react-query';

const ApiKeys = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState(new Set());

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      // This would be replaced with actual API call
      return [
        {
          id: '1',
          name: 'Production API',
          key_prefix: 'mk_prod_',
          permissions: ['read', 'write'],
          created_at: '2024-01-15T10:00:00Z',
          last_used_at: '2024-01-20T15:30:00Z',
          is_active: true
        },
        {
          id: '2',
          name: 'Analytics Service',
          key_prefix: 'mk_analytics_',
          permissions: ['read'],
          created_at: '2024-01-10T09:00:00Z',
          last_used_at: '2024-01-19T12:00:00Z',
          is_active: true
        },
        {
          id: '3',
          name: 'Content Sync',
          key_prefix: 'mk_sync_',
          permissions: ['read', 'write', 'delete'],
          created_at: '2024-01-05T08:00:00Z',
          last_used_at: null,
          is_active: false
        }
      ];
    }
  });

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    
    console.log('Creating API key:', newKeyName);
    // Implement API key creation
    setNewKeyName('');
    setShowCreateForm(false);
  };

  const handleDeleteKey = (keyId) => {
    console.log('Deleting API key:', keyId);
    // Implement API key deletion
  };

  const toggleKeyVisibility = (keyId) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">API Keys</h1>
              <p className="text-gray-600">Manage API keys for external integrations</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
                <Key className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{apiKeys?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
                <Key className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {apiKeys?.filter(key => key.is_active).length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recently Used</CardTitle>
                <Key className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {apiKeys?.filter(key => key.last_used_at && 
                    new Date(key.last_used_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create Key Form */}
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create New API Key</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production API, Analytics Service"
                    />
                  </div>
                  <div>
                    <Label>Permissions</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Read
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Write
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Delete
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateKey}>Create Key</Button>
                    <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Keys Table */}
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
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
                      <TableHead>Last Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys?.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell>
                          <div className="font-medium">{key.name}</div>
                          <div className="text-sm text-gray-500">
                            Created {new Date(key.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                              {visibleKeys.has(key.id) 
                                ? `${key.key_prefix}***************************`
                                : `${key.key_prefix}${'*'.repeat(20)}`
                              }
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleKeyVisibility(key.id)}
                            >
                              {visibleKeys.has(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(`${key.key_prefix}example_full_key`)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {key.permissions.map((permission) => (
                              <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {permission}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {key.last_used_at 
                            ? new Date(key.last_used_at).toLocaleDateString()
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            key.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {key.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteKey(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
