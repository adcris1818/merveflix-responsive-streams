
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2, Copy, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

interface GuestPass {
  id: string;
  code: string;
  name: string;
  type: 'single_use' | 'time_limited' | 'unlimited';
  duration_days?: number;
  max_uses?: number;
  current_uses: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

const GuestPasses = () => {
  const [guestPasses, setGuestPasses] = useState<GuestPass[]>([
    {
      id: '1',
      code: 'WELCOME2024',
      name: 'Welcome Pass',
      type: 'time_limited',
      duration_days: 7,
      current_uses: 15,
      expires_at: '2024-12-31T23:59:59Z',
      is_active: true,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      code: 'TRIAL30',
      name: '30-Day Trial',
      type: 'time_limited',
      duration_days: 30,
      current_uses: 8,
      expires_at: '2024-12-31T23:59:59Z',
      is_active: true,
      created_at: '2024-01-10T14:30:00Z'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'single_use' as 'single_use' | 'time_limited' | 'unlimited',
    duration_days: '',
    max_uses: '',
    expires_at: ''
  });

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData(prev => ({ ...prev, code }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPass: GuestPass = {
      id: Date.now().toString(),
      code: formData.code,
      name: formData.name,
      type: formData.type,
      duration_days: formData.duration_days ? parseInt(formData.duration_days) : undefined,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : undefined,
      current_uses: 0,
      expires_at: formData.expires_at || undefined,
      is_active: true,
      created_at: new Date().toISOString()
    };

    setGuestPasses(prev => [...prev, newPass]);
    setIsCreateDialogOpen(false);
    setFormData({
      code: '',
      name: '',
      type: 'single_use',
      duration_days: '',
      max_uses: '',
      expires_at: ''
    });
    toast.success('Guest pass created successfully!');
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const togglePassStatus = (id: string) => {
    setGuestPasses(prev =>
      prev.map(pass =>
        pass.id === id ? { ...pass, is_active: !pass.is_active } : pass
      )
    );
    toast.success('Guest pass status updated!');
  };

  const deletePass = (id: string) => {
    setGuestPasses(prev => prev.filter(pass => pass.id !== id));
    toast.success('Guest pass deleted!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Passes</h1>
              <p className="text-gray-600">Manage free access codes for your platform</p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Guest Pass
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Guest Pass</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Pass Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Welcome Pass"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="code">Pass Code *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="WELCOME2024"
                        required
                      />
                      <Button type="button" variant="outline" onClick={generateCode}>
                        Generate
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="type">Pass Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single_use">Single Use</SelectItem>
                        <SelectItem value="time_limited">Time Limited</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.type === 'time_limited' && (
                    <div>
                      <Label htmlFor="duration">Duration (Days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration_days}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration_days: e.target.value }))}
                        placeholder="7"
                        min="1"
                      />
                    </div>
                  )}

                  {formData.type === 'single_use' && (
                    <div>
                      <Label htmlFor="max_uses">Maximum Uses</Label>
                      <Input
                        id="max_uses"
                        type="number"
                        value={formData.max_uses}
                        onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
                        placeholder="100"
                        min="1"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="expires_at">Expiry Date</Label>
                    <Input
                      id="expires_at"
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Pass</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Passes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guestPasses.length}</div>
                <p className="text-xs text-green-600">Active passes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Passes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {guestPasses.filter(p => p.is_active).length}
                </div>
                <p className="text-xs text-green-600">Currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {guestPasses.reduce((sum, pass) => sum + pass.current_uses, 0)}
                </div>
                <p className="text-xs text-blue-600">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {guestPasses.reduce((sum, pass) => sum + pass.current_uses, 0)}
                </div>
                <p className="text-xs text-blue-600">Pass uses</p>
              </CardContent>
            </Card>
          </div>

          {/* Passes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Passes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guestPasses.map((pass) => (
                    <TableRow key={pass.id}>
                      <TableCell className="font-medium">{pass.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {pass.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyCode(pass.code)}
                            className="h-6 w-6 p-1"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {pass.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pass.current_uses}
                        {pass.max_uses && ` / ${pass.max_uses}`}
                      </TableCell>
                      <TableCell>
                        {pass.expires_at ? (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(pass.expires_at).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pass.is_active ? "default" : "secondary"}>
                          {pass.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePassStatus(pass.id)}
                          >
                            {pass.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePass(pass.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GuestPasses;
