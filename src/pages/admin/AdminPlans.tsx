
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { CreditCard, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];

const AdminPlans = () => {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async (): Promise<SubscriptionPlan[]> => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: async (planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([planData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast.success('Plan created successfully!');
      setShowAddForm(false);
    },
    onError: (error) => {
      console.error('Error creating plan:', error);
      toast.error('Failed to create plan');
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SubscriptionPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast.success('Plan updated successfully!');
      setEditingPlan(null);
    },
    onError: (error) => {
      console.error('Error updating plan:', error);
      toast.error('Failed to update plan');
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast.success('Plan deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    },
  });

  const PlanForm = ({ plan = null, onSave, onCancel }: {
    plan?: SubscriptionPlan | null;
    onSave: (data: any) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: plan?.name || '',
      description: plan?.description || '',
      price: plan?.price?.toString() || '',
      interval: plan?.interval || 'month',
      currency: plan?.currency || 'USD',
      max_devices: plan?.max_devices?.toString() || '1',
      max_quality: plan?.max_quality || 'HD',
      features: Array.isArray(plan?.features) ? (plan.features as string[]).join('\n') : '',
      is_active: plan?.is_active ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const planData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        interval: formData.interval,
        currency: formData.currency,
        max_devices: parseInt(formData.max_devices),
        max_quality: formData.max_quality,
        features: formData.features.split('\n').filter(f => f.trim()),
        is_active: formData.is_active
      };

      onSave(planData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Plan Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Brief description of the plan"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="interval">Billing Interval</Label>
            <Select
              value={formData.interval}
              onValueChange={(value) => setFormData({...formData, interval: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="max_devices">Max Devices</Label>
            <Input
              id="max_devices"
              type="number"
              min="1"
              value={formData.max_devices}
              onChange={(e) => setFormData({...formData, max_devices: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="max_quality">Max Quality</Label>
            <Select
              value={formData.max_quality}
              onValueChange={(value) => setFormData({...formData, max_quality: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SD">SD (480p)</SelectItem>
                <SelectItem value="HD">HD (720p)</SelectItem>
                <SelectItem value="FHD">Full HD (1080p)</SelectItem>
                <SelectItem value="4K">4K (2160p)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="features">Features (one per line)</Label>
          <Textarea
            id="features"
            rows={4}
            value={formData.features}
            onChange={(e) => setFormData({...formData, features: e.target.value})}
            placeholder="HD Streaming&#10;Multiple Devices&#10;Offline Downloads"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
          />
          <Label htmlFor="is_active">Active Plan</Label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{plan ? 'Update' : 'Create'} Plan</Button>
        </div>
      </form>
    );
  };

  const handleSavePlan = (planData: any) => {
    if (editingPlan) {
      updatePlanMutation.mutate({ id: editingPlan.id, ...planData });
    } else {
      createPlanMutation.mutate(planData);
    }
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      deletePlanMutation.mutate(planId);
    }
  };

  const togglePlanStatus = (plan: SubscriptionPlan) => {
    updatePlanMutation.mutate({
      id: plan.id,
      is_active: !plan.is_active
    });
  };

  // Calculate stats
  const activeCount = plans.filter(p => p.is_active).length;
  const avgPrice = plans.length > 0 ? plans.reduce((sum, plan) => sum + Number(plan.price), 0) / plans.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
              <p className="text-gray-600">Manage pricing plans and features</p>
            </div>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Plan</DialogTitle>
                </DialogHeader>
                <PlanForm
                  onSave={handleSavePlan}
                  onCancel={() => setShowAddForm(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{plans.length}</div>
                <p className="text-xs text-gray-600">Available plans</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCount}</div>
                <p className="text-xs text-green-600">Currently available</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${avgPrice.toFixed(2)}</div>
                <p className="text-xs text-gray-600">Per month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Price Range</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${Math.min(...plans.map(p => Number(p.price)))} - ${Math.max(...plans.map(p => Number(p.price)))}
                </div>
                <p className="text-xs text-gray-600">Min - Max</p>
              </CardContent>
            </Card>
          </div>

          {/* Plans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading plans...</div>
              ) : plans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No subscription plans found</p>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Plan
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Interval</TableHead>
                      <TableHead>Max Devices</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{plan.name}</div>
                            <div className="text-sm text-gray-500">{plan.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold">
                            ${Number(plan.price).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">{plan.currency}</div>
                        </TableCell>
                        <TableCell className="capitalize">{plan.interval}</TableCell>
                        <TableCell>{plan.max_devices} device{plan.max_devices !== 1 ? 's' : ''}</TableCell>
                        <TableCell>{plan.max_quality}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {plan.is_active ? (
                              <span className="flex items-center text-green-600">
                                <Check className="h-4 w-4 mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <X className="h-4 w-4 mr-1" />
                                Inactive
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePlanStatus(plan)}
                              disabled={updatePlanMutation.isPending}
                            >
                              {plan.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingPlan(plan)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePlan(plan.id)}
                              disabled={deletePlanMutation.isPending}
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

          {/* Edit Plan Dialog */}
          <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Plan: {editingPlan?.name}</DialogTitle>
              </DialogHeader>
              {editingPlan && (
                <PlanForm
                  plan={editingPlan}
                  onSave={handleSavePlan}
                  onCancel={() => setEditingPlan(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPlans;
