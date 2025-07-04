
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Gift, Plus, Copy, Trash2, Eye, EyeOff, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';

interface GuestPass {
  id: string;
  code: string;
  max_uses: number;
  current_uses: number;
  expires_at: string;
  is_active: boolean;
  description: string;
  created_at: string;
}

const GuestPasses = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPass, setNewPass] = useState({
    description: '',
    max_uses: 10,
    expires_at: '',
    duration_days: 7
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: guestPasses = [], isLoading } = useQuery({
    queryKey: ['guest-passes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('discount_type', 'guest_pass')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(pass => ({
        id: pass.id,
        code: pass.code,
        max_uses: pass.max_uses || 0,
        current_uses: pass.current_uses || 0,
        expires_at: pass.expires_at,
        is_active: pass.is_active,
        description: pass.description || '',
        created_at: pass.created_at
      }));
    }
  });

  const createGuestPass = useMutation({
    mutationFn: async (passData: typeof newPass) => {
      const code = `GUEST-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + passData.duration_days);

      const { data, error } = await supabase
        .from('coupons')
        .insert([{
          code,
          discount_type: 'guest_pass',
          discount_value: 0,
          max_uses: passData.max_uses,
          expires_at: expiresAt.toISOString(),
          description: passData.description,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-passes'] });
      setIsCreateDialogOpen(false);
      setNewPass({ description: '', max_uses: 10, expires_at: '', duration_days: 7 });
      toast({ title: 'Guest pass created successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error creating guest pass', description: error.message, variant: 'destructive' });
    }
  });

  const toggleGuestPass = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !isActive })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-passes'] });
      toast({ title: 'Guest pass updated successfully!' });
    }
  });

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Code copied to clipboard!' });
  };

  const totalPasses = guestPasses.length;
  const activePasses = guestPasses.filter(pass => pass.is_active).length;
  const totalUses = guestPasses.reduce((sum, pass) => sum + pass.current_uses, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Passes</h1>
              <p className="text-gray-600">Manage guest access codes and temporary passes</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Guest Pass
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Guest Pass</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newPass.description}
                      onChange={(e) => setNewPass({...newPass, description: e.target.value})}
                      placeholder="e.g., VIP Preview Access"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_uses">Maximum Uses</Label>
                    <Input
                      id="max_uses"
                      type="number"
                      value={newPass.max_uses}
                      onChange={(e) => setNewPass({...newPass, max_uses: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (Days)</Label>
                    <Select
                      value={newPass.duration_days.toString()}
                      onValueChange={(value) => setNewPass({...newPass, duration_days: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="14">14 Days</SelectItem>
                        <SelectItem value="30">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => createGuestPass.mutate(newPass)}
                    disabled={createGuestPass.isPending}
                    className="w-full"
                  >
                    {createGuestPass.isPending ? 'Creating...' : 'Create Guest Pass'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Passes</CardTitle>
                <Gift className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPasses}</div>
                <p className="text-xs text-gray-600">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Passes</CardTitle>
                <Eye className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activePasses}</div>
                <p className="text-xs text-green-600">Currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{totalUses}</div>
                <p className="text-xs text-blue-600">Redemptions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {guestPasses.filter(pass => {
                    const expiryDate = new Date(pass.expires_at);
                    const threeDaysFromNow = new Date();
                    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
                    return expiryDate <= threeDaysFromNow && pass.is_active;
                  }).length}
                </div>
                <p className="text-xs text-orange-600">Next 3 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Guest Passes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Pass Management</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading guest passes...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guestPasses.map((pass) => (
                      <TableRow key={pass.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {pass.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(pass.code)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{pass.description}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {pass.current_uses} / {pass.max_uses} uses
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(pass.current_uses / pass.max_uses) * 100}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(pass.expires_at).toLocaleDateString()}
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
                              onClick={() => toggleGuestPass.mutate({ id: pass.id, isActive: pass.is_active })}
                            >
                              {pass.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

export default GuestPasses;
