
import React from 'react';
import { Monitor, Smartphone, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface Device {
  name: string;
  type: string;
  lastUsed: string;
  status: string;
}

interface DevicesTabProps {
  devices: Device[];
}

export const DevicesTab = ({ devices }: DevicesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((device, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {device.type === 'Desktop' && <Monitor className="w-6 h-6 text-gray-400" />}
                  {device.type === 'Mobile' && <Smartphone className="w-6 h-6 text-gray-400" />}
                  {device.type === 'TV' && <Monitor className="w-6 h-6 text-gray-400" />}
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-gray-600">{device.type} • Last used {device.lastUsed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    device.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {device.status}
                  </span>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
