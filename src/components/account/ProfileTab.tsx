
import React from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface ProfileTabProps {
  profile: {
    name: string;
    email: string;
    phone: string;
    language: string;
    country: string;
  };
  setProfile: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    language: string;
    country: string;
  }>>;
}

export const ProfileTab = ({ profile, setProfile }: ProfileTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <select 
              id="language"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={profile.language}
              onChange={(e) => setProfile({...profile, language: e.target.value})}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <select 
            id="country"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={profile.country}
            onChange={(e) => setProfile({...profile, country: e.target.value})}
          >
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>Australia</option>
          </select>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
