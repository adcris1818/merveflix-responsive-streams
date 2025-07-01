
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { CreditCard, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useQuery } from '@tanstack/react-query';

const AdminPlans = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      // This would be replaced with actual API call to Supabase
      return [
        {
          id: '1',
          name: 'Basic',
          description: 'Access to basic content library',
          price: 9.99,
          currency: 'USD',
          interval: 'month',
          features: ['HD Streaming', '1 Device', 'Limited Content'],
          is_active: true,
          subscribers: 2341
        },
        {
          id: '2',
          name: 'Standard',
          description: 'Access to full content library',
          price: 13.99,
          currency: 'USD',
          interval: 'month',
          features: ['HD Streaming', '2 Devices', 'Full Content Library', 'Offline Downloads'],
          is_active: true,
          subscribers: 5432
        },
        {
          id: '3',
          name: 'Premium',
          description: 'Premium features and content',
          price: 17.99,
          currency: 'USD',
          interval: 'month',
          features: ['4K Streaming', '4 Devices', 'Full Content Library', 'Offline Downloads', 'Early Access'],
          is_active: true,
          subscribers: 1234
        }
      ];
    }
  });

  const handleSavePlan = (planData) => {
    console.log('Saving plan:', planData);
    // Implement plan save logic
    setShowAddForm(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = (planId) => {
    console.log('Deleting plan:', planId);
    // Implement plan deletion
  };

  const PlanForm = ({ plan = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: plan?.name || '',
      description: plan?.description || '',
      price: plan?.price || '',
      features: plan?.features?.join('\n') || '',
      is_active: plan?.is_active ?? true
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim())
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            required
          />
        </div>
        <div>
          <Label htmlFor="features">Features (one per line)</Label>
          <textarea
            id="features"
            className="w-full p-2 border rounded-md"
            rows={4}
            value={formData.features}
            onChange={(e) => setFormData({...formData, features: e.target.value})}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
          />
          <Label htmlFor="is_active">Active Plan</Label>
        </div>
        <div className="flex gap-2">
          <Button type="submit">Save Plan</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
              <p className="text-gray-600">Manage pricing plans and features</p>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Plan
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{plans?.filter(p => p.is_active).length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {plans?.reduce((sum, plan) => sum + plan.subscribers, 0) || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${plans?.reduce((sum, plan) => sum + plan.price, 0) / (plans?.length || 1) || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${plans?.reduce((sum, plan) => sum + (plan.price * plan.subscribers), 0) || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Plan Form */}
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <PlanForm
                  onSave={handleSavePlan}
                  onCancel={() => setShowAddForm(false)}
                />
              </CardContent>
            </Card>
          )}

          {/* Plans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Plans</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading plans...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Subscribers</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plans?.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{plan.name}</div>
                            <div className="text-sm text-gray-500">{plan.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>${plan.price}/{plan.interval}</TableCell>
                        <TableCell>{plan.subscribers}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            {plan.features.slice(0, 2).map((feature, idx) => (
                              <div key={idx}>• {feature}</div>
                            ))}
                            {plan.features.length > 2 && (
                              <div>+{plan.features.length - 2} more</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
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

          {/* Edit Plan Modal */}
          {editingPlan && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Edit Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <PlanForm
                    plan={editingPlan}
                    onSave={handleSavePlan}
                    onCancel={() => setEditingPlan(null)}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPlans;
