
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { CreditCard, Smartphone, DollarSign, Settings, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentGateway {
  id: string;
  name: string;
  type: 'card' | 'mobile' | 'bank' | 'crypto';
  enabled: boolean;
  configured: boolean;
  icon: React.ReactNode;
  description: string;
  config: Record<string, any>;
}

const PaymentGateways = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      type: 'card',
      enabled: true,
      configured: true,
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Accept credit cards, debit cards, and digital wallets',
      config: {
        publishable_key: 'pk_test_...',
        secret_key: '••••••••',
        webhook_secret: '••••••••'
      }
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'card',
      enabled: false,
      configured: false,
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Accept PayPal payments and credit cards',
      config: {
        client_id: '',
        client_secret: ''
      }
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      type: 'mobile',
      enabled: true,
      configured: true,
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Accept Apple Pay on iOS devices',
      config: {
        merchant_id: 'merchant.com.yourapp'
      }
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      type: 'mobile',
      enabled: true,
      configured: true,
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Accept Google Pay payments',
      config: {
        merchant_id: 'your-merchant-id'
      }
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      type: 'bank',
      enabled: false,
      configured: false,
      icon: <DollarSign className="h-5 w-5" />,
      description: 'Manual bank transfer payments',
      config: {
        bank_name: '',
        account_number: '',
        routing_number: ''
      }
    }
  ]);

  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [configForm, setConfigForm] = useState<Record<string, string>>({});

  const toggleGateway = (id: string) => {
    setGateways(prev =>
      prev.map(gateway =>
        gateway.id === id
          ? { ...gateway, enabled: !gateway.enabled }
          : gateway
      )
    );
    toast.success('Payment gateway updated!');
  };

  const openConfig = (gateway: PaymentGateway) => {
    setSelectedGateway(gateway);
    setConfigForm(gateway.config);
  };

  const saveConfig = () => {
    if (!selectedGateway) return;

    setGateways(prev =>
      prev.map(gateway =>
        gateway.id === selectedGateway.id
          ? {
              ...gateway,
              config: configForm,
              configured: Object.values(configForm).some(value => value.trim() !== '')
            }
          : gateway
      )
    );
    setSelectedGateway(null);
    setConfigForm({});
    toast.success('Configuration saved!');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'bank':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const groupedGateways = {
    card: gateways.filter(g => g.type === 'card'),
    mobile: gateways.filter(g => g.type === 'mobile'),
    bank: gateways.filter(g => g.type === 'bank'),
    crypto: gateways.filter(g => g.type === 'crypto')
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Gateways</h1>
            <p className="text-gray-600">Configure payment methods for your platform</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Gateways</CardTitle>
                <Settings className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {gateways.filter(g => g.enabled).length}
                </div>
                <p className="text-xs text-green-600">Currently enabled</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Configured</CardTitle>
                <Check className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {gateways.filter(g => g.configured).length}
                </div>
                <p className="text-xs text-blue-600">Ready to use</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Card Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {groupedGateways.card.filter(g => g.enabled).length}
                </div>
                <p className="text-xs text-green-600">Card gateways active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mobile Payments</CardTitle>
                <Smartphone className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {groupedGateways.mobile.filter(g => g.enabled).length}
                </div>
                <p className="text-xs text-green-600">Mobile payments active</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Gateways</TabsTrigger>
              <TabsTrigger value="card">Credit Cards</TabsTrigger>
              <TabsTrigger value="mobile">Mobile Payments</TabsTrigger>
              <TabsTrigger value="bank">Bank Transfers</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gateways.map((gateway) => (
                  <Card key={gateway.id} className="relative">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <div className="flex items-center space-x-2">
                        {gateway.icon}
                        <CardTitle className="text-lg">{gateway.name}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        {gateway.configured ? (
                          <Badge variant="default">
                            <Check className="h-3 w-3 mr-1" />
                            Configured
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <X className="h-3 w-3 mr-1" />
                            Not Configured
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{gateway.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {getTypeIcon(gateway.type)}
                            <span className="ml-1 capitalize">{gateway.type}</span>
                          </Badge>
                        </div>
                        <Switch
                          checked={gateway.enabled}
                          onCheckedChange={() => toggleGateway(gateway.id)}
                          disabled={!gateway.configured}
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openConfig(gateway)}
                        className="w-full"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {['card', 'mobile', 'bank'].map((type) => (
              <TabsContent key={type} value={type} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedGateways[type as keyof typeof groupedGateways].map((gateway) => (
                    <Card key={gateway.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center space-x-2">
                          {gateway.icon}
                          <CardTitle className="text-lg">{gateway.name}</CardTitle>
                        </div>
                        <Switch
                          checked={gateway.enabled}
                          onCheckedChange={() => toggleGateway(gateway.id)}
                          disabled={!gateway.configured}
                        />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">{gateway.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openConfig(gateway)}
                          className="w-full"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Configuration Modal */}
          {selectedGateway && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {selectedGateway.icon}
                    <span>Configure {selectedGateway.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(selectedGateway.config).map(([key, value]) => (
                    <div key={key}>
                      <Label htmlFor={key} className="capitalize">
                        {key.replace('_', ' ')}
                      </Label>
                      <Input
                        id={key}
                        type={key.includes('secret') || key.includes('key') ? 'password' : 'text'}
                        value={configForm[key] || ''}
                        onChange={(e) =>
                          setConfigForm(prev => ({ ...prev, [key]: e.target.value }))
                        }
                        placeholder={`Enter ${key.replace('_', ' ')}`}
                      />
                    </div>
                  ))}
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedGateway(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={saveConfig}>
                      Save Configuration
                    </Button>
                  </div>
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

export default PaymentGateways;
