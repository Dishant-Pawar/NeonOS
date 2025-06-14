
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Edit, Trash2, Camera } from 'lucide-react';

export const AccountsSettings = () => {
  const [currentUser, setCurrentUser] = useState({
    name: 'Admin User',
    email: 'admin@zoren.os',
    profilePicture: '/placeholder-avatar.png',
    accountType: 'Administrator'
  });

  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@zoren.os', type: 'Administrator', active: true },
    { id: 2, name: 'Guest User', email: 'guest@zoren.os', type: 'Standard', active: false },
    { id: 3, name: 'Developer', email: 'dev@zoren.os', type: 'Power User', active: false }
  ]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileUpdate = () => {
    setCurrentUser({
      ...currentUser,
      name: editName,
      email: editEmail
    });
    setUsers(users.map(user => 
      user.id === 1 
        ? { ...user, name: editName, email: editEmail }
        : user
    ));
    setIsEditingProfile(false);
  };

  const handlePasswordChange = () => {
    if (passwordForm.new === passwordForm.confirm && passwordForm.current) {
      alert('Password changed successfully!');
      setPasswordForm({ current: '', new: '', confirm: '' });
      setShowPasswordChange(false);
    } else {
      alert('Passwords do not match or current password is incorrect!');
    }
  };

  const addNewUser = () => {
    const newUser = {
      id: users.length + 1,
      name: 'New User',
      email: 'newuser@zoren.os',
      type: 'Standard',
      active: false
    };
    setUsers([...users, newUser]);
  };

  const removeUser = (userId: number) => {
    if (userId !== 1) { // Can't remove admin
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const switchUser = (userId: number) => {
    setUsers(users.map(user => ({
      ...user,
      active: user.id === userId
    })));
  };

  useEffect(() => {
    const saved = localStorage.getItem('zorenUserAccounts');
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentUser(data.currentUser || currentUser);
      setUsers(data.users || users);
    }
  }, []);

  const saveData = () => {
    localStorage.setItem('zorenUserAccounts', JSON.stringify({ currentUser, users }));
  };

  useEffect(() => {
    saveData();
  }, [currentUser, users]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-green-400" />
        <h1 className="text-2xl font-bold text-green-400">Accounts & Users</h1>
      </div>

      {/* Current User Profile */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50">
                <Users className="w-10 h-10 text-green-400" />
              </div>
              <Button size="sm" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-green-600 hover:bg-green-700">
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 space-y-3">
              {isEditingProfile ? (
                <div className="space-y-3">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-gray-700 border-green-500/50 text-green-400"
                    placeholder="Full Name"
                  />
                  <Input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="bg-gray-700 border-green-500/50 text-green-400"
                    placeholder="Email Address"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleProfileUpdate} className="bg-green-600 hover:bg-green-700">
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditingProfile(false)} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-green-400 font-medium text-lg">{currentUser.name}</h3>
                      <p className="text-gray-400">{currentUser.email}</p>
                      <p className="text-green-300 text-sm">{currentUser.accountType}</p>
                    </div>
                    <Button onClick={() => setIsEditingProfile(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">Security</CardTitle>
        </CardHeader>
        <CardContent>
          {!showPasswordChange ? (
            <Button onClick={() => setShowPasswordChange(true)} className="bg-yellow-600 hover:bg-yellow-700">
              Change Password
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Current Password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                className="bg-gray-700 border-green-500/50 text-green-400"
              />
              <Input
                type="password"
                placeholder="New Password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                className="bg-gray-700 border-green-500/50 text-green-400"
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                className="bg-gray-700 border-green-500/50 text-green-400"
              />
              <div className="flex gap-2">
                <Button onClick={handlePasswordChange} className="bg-green-600 hover:bg-green-700">
                  Update Password
                </Button>
                <Button onClick={() => setShowPasswordChange(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Management */}
      <Card className="bg-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center justify-between">
            User Accounts
            <Button onClick={addNewUser} size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-1" />
              Add User
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className={`flex items-center justify-between p-3 rounded-lg ${
                user.active ? 'bg-green-500/20 border border-green-500/50' : 'bg-gray-700'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-green-400 font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email} • {user.type}</p>
                  </div>
                  {user.active && <span className="text-green-400 text-sm font-medium">Active</span>}
                </div>
                <div className="flex gap-2">
                  {!user.active && (
                    <Button size="sm" onClick={() => switchUser(user.id)} className="bg-blue-600 hover:bg-blue-700">
                      Switch
                    </Button>
                  )}
                  {user.id !== 1 && (
                    <Button size="sm" onClick={() => removeUser(user.id)} variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
