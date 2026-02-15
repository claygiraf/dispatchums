'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  dispatcher_id: string;  // This is the ID used for login
  email: string;
  role: string;
  unit: string;
  first_name?: string;
  last_name?: string;
  created_at?: string | null;
}

interface Unit {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const itemsPerPage = 20;

  // Create user form
  const [newUser, setNewUser] = useState({
    dispatcher_id: '',  // ID used for login (e.g., 1001, 2001)
    email: '',
    password: '',
    role: '',
    unit: '',
    first_name: '',
    last_name: ''
  });

  // Create unit form
  const [newUnitName, setNewUnitName] = useState('');

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showProfileMenu && !target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user_data');
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        alert('Access denied. Admin only.');
        const userDashboard = user.role === 'dispatcher' ? '/dashboard/dispatcher' : '/dashboard/responder';
        window.location.href = userDashboard;
        return;
      }
    } else {
      // No user data, redirect to login
      window.location.href = '/login';
      return;
    }
    
    // User is verified admin, proceed
    fetchUsers();
    fetchUnits();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching users with token:', token ? 'exists' : 'missing');
      const response = await fetch('http://localhost:8001/api/v1/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Users fetched:', data.length, 'users');
        setUsers(data);
      } else {
        console.error('Failed to fetch users:', response.status);
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8001/api/v1/units', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const generatePassword = () => {
    // Generate 6-digit password
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    setNewUser({ ...newUser, password });
  };

  const generateID = async () => {
    if (!newUser.role) {
      alert('Please select a role first before generating ID');
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8001/api/v1/auth/generate-next-id/${newUser.role}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNewUser({ ...newUser, dispatcher_id: data.next_id });
      } else {
        const error = await response.json();
        alert(`Failed to generate ID: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating ID:', error);
      alert('Failed to generate ID. Please try again.');
    }
  };

  const handleRoleChange = (role: string) => {
    // Clear ID and password when role changes
    setNewUser({ ...newUser, role, dispatcher_id: '', password: '' });
  };

  const handleCreateUser = async () => {
    if (!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.role || !newUser.password || !newUser.dispatcher_id || !newUser.unit) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8001/api/v1/auth/create-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        alert('User created successfully!');
        setIsCreateModalOpen(false);
        setNewUser({
          dispatcher_id: '',
          email: '',
          password: '',
          role: '',
          unit: '',
          first_name: '',
          last_name: ''
        });
        fetchUsers();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error: any) {
      alert(`Error creating user: ${error?.message || error?.toString() || 'Unknown error'}`);
    }
  };

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select users to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      for (const userId of selectedUsers) {
        await fetch(`http://localhost:8001/api/v1/auth/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      alert('Users deleted successfully!');
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      alert('Error deleting users');
    }
  };

  const handleCreateUnit = async () => {
    if (!newUnitName.trim()) {
      alert('Please enter a unit name');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8001/api/v1/units', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newUnitName })
      });

      if (response.ok) {
        alert('Unit created successfully!');
        setNewUnitName('');
        setIsUnitModalOpen(false);
        fetchUnits();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error: any) {
      alert(`Error creating unit: ${error?.message || error?.toString() || 'Unknown error'}`);
    }
  };

  const handleDeleteUnits = async () => {
    if (selectedUnits.length === 0) {
      alert('Please select units to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedUnits.length} unit(s)?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      for (const unitId of selectedUnits) {
        const response = await fetch(`http://localhost:8001/api/v1/units/${unitId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          const error = await response.json();
          alert(`Error deleting unit: ${error.detail}`);
          break;
        }
      }
      alert('Units deleted successfully!');
      setSelectedUnits([]);
      fetchUnits();
    } catch (error: any) {
      alert(`Error deleting units: ${error?.message || error?.toString() || 'Unknown error'}`);
    }
  };

  const toggleUserSelection = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const toggleUnitSelection = (unitId: number) => {
    if (selectedUnits.includes(unitId)) {
      setSelectedUnits(selectedUnits.filter(id => id !== unitId));
    } else {
      setSelectedUnits([...selectedUnits, unitId]);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.dispatcher_id && user.dispatcher_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log('Total users:', users.length, 'Filtered:', filteredUsers.length, 'Search term:', searchTerm);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  
  console.log('Paginated users:', paginatedUsers.length, 'Page:', currentPage, 'of', totalPages);

  const formatPasswordStatus = (user: User) => {

    return 'Auto-generated';
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#27272A]">
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-8">
              <Link href="/" className="group">
                <h1 className="text-3xl font-serif text-white tracking-wide hover:text-[#1D9BF0] transition">
                  DISPATCHUMS
                </h1>
              </Link>
              
              {/* Modern Navigation Menu */}
              <div className="flex items-center gap-6">
                <Link
                  href="/dashboard/admin"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/admin/users"
                  className="text-[#1D9BF0] hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Users
                </Link>
                <Link
                  href="/dashboard/admin/design"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Design
                </Link>
                <Link
                  href="/dashboard/admin/feedback"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Feedback
                </Link>
                <Link
                  href="/dashboard/admin/testimonial"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Testimonial
                </Link>
                <Link
                  href="/dashboard/admin/download"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Download
                </Link>
                <Link
                  href="/dashboard/admin/trash"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Trash
                </Link>
              </div>
            </div>
            
            {/* Profile Icon */}
            <div className="relative profile-menu-container">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 text-white hover:text-[#1D9BF0] transition"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 min-w-[220px] overflow-hidden">
                  <Link
                    href="/profile/admin"
                    onClick={() => setShowProfileMenu(false)}
                    className="block w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white text-gray-700 font-medium transition border-b border-gray-100"
                  >
                    Profile Settings
                  </Link>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('access_token');
                      localStorage.removeItem('user_data');
                      window.location.href = '/login';
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white text-gray-700 font-medium transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div className="pt-24 px-4 py-8 w-full">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2 bg-[#1D9BF0] rounded-lg hover:bg-[#1a8cd8]"
          >
            Create User
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search with name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            style={{ color: 'white' }}
          />
        </div>

        {/* Delete Button */}
        {selectedUsers.length > 0 && (
          <div className="mb-4">
            <button
              onClick={handleDeleteUsers}
              className="px-6 py-2 bg-[#1D9BF0] rounded-lg hover:bg-[#1a8cd8]"
            >
              Delete Selected ({selectedUsers.length})
            </button>
          </div>
        )}

        {/* Users Table */}
        <div className="w-full overflow-x-auto mb-12">
          <table className="w-full bg-gray-900 rounded-lg overflow-hidden">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(paginatedUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                  />
                </th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">First Name</th>
                <th className="px-4 py-3 text-left">Last Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Password</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Unit</th>
                <th className="px-4 py-3 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-800 hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                  </td>
                  <td className="px-4 py-3">{user.dispatcher_id}</td>
                  <td className="px-4 py-3">{user.first_name || '-'}</td>
                  <td className="px-4 py-3">{user.last_name || '-'}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatPasswordStatus(user)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      user.role === 'admin' ? 'bg-purple-600' :
                      user.role === 'dispatcher' ? 'bg-blue-600' :
                      'bg-green-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user.unit || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    {user.created_at ? new Date(user.created_at).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mb-12 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Unit Management Section */}
        <div className="w-full">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Unit Management</h2>
            <button
              onClick={() => setIsUnitModalOpen(true)}
              className="px-6 py-2 bg-[#1D9BF0] rounded-lg hover:bg-[#1a8cd8]"
            >
              Add Unit
            </button>
          </div>

          {/* Delete Units Button */}
          {selectedUnits.length > 0 && (
            <div className="mb-4">
              <button
                onClick={handleDeleteUnits}
                className="px-6 py-2 bg-[#1D9BF0] rounded-lg hover:bg-[#1a8cd8]"
              >
                Delete Selected ({selectedUnits.length})
              </button>
            </div>
          )}

          <div className="w-full overflow-x-auto">
            <table className="w-full bg-gray-900 rounded-lg overflow-hidden">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUnits(units.map(u => u.id));
                        } else {
                          setSelectedUnits([]);
                        }
                      }}
                      checked={selectedUnits.length === units.length && units.length > 0}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Unit Name</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.id} className="border-t border-gray-800 hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUnits.includes(unit.id)}
                        onChange={() => toggleUnitSelection(unit.id)}
                      />
                    </td>
                    <td className="px-4 py-3">{unit.id}</td>
                    <td className="px-4 py-3">{unit.name}</td>
                    <td className="px-4 py-3">
                      {unit.is_active ? (
                        <span className="text-green-400">Active</span>
                      ) : (
                        <span className="text-red-400">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(unit.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create New User</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2">First Name</label>
                <input
                  type="text"
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Last Name</label>
                <input
                  type="text"
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="user@hums.edu.my"
                />
              </div>

              <div>
                <label className="block mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="">Select Role</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="responder">Responder</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block mb-2">Password (6 digits)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    placeholder="e.g., 123456"
                    maxLength={6}
                  />
                  <button
                    onClick={generatePassword}
                    className="px-6 py-2 bg-[#1D9BF0] rounded hover:bg-[#1a8cd8] whitespace-nowrap"
                    type="button"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2">ID</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newUser.dispatcher_id}
                    onChange={(e) => setNewUser({ ...newUser, dispatcher_id: e.target.value })}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                    placeholder="e.g., 1001, 2001, 3001"
                  />
                  <button
                    onClick={generateID}
                    className="px-6 py-2 bg-[#1D9BF0] rounded hover:bg-[#1a8cd8] whitespace-nowrap"
                  >
                    Generate ID
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2">Unit</label>
                <select
                  value={newUser.unit}
                  onChange={(e) => setNewUser({ ...newUser, unit: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="">Select Unit</option>
                  {units.filter(u => u.is_active).map(unit => (
                    <option key={unit.id} value={unit.name}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleCreateUser}
                className="flex-1 px-6 py-2 bg-[#1D9BF0] rounded-lg hover:bg-[#1a8cd8]"
              >
                Create User
              </button>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewUser({
                    dispatcher_id: '',
                    email: '',
                    password: '',
                    role: '',
                    unit: '',
                    first_name: '',
                    last_name: ''
                  });
                }}
                className="flex-1 px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Unit Modal */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add New Unit</h2>
            
            <div className="mb-6">
              <label className="block mb-2">Unit Name</label>
              <input
                type="text"
                value={newUnitName}
                onChange={(e) => setNewUnitName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                placeholder="e.g., MECC Kota Kinabalu"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCreateUnit}
                className="flex-1 px-6 py-2 bg-[#1D9BF0] rounded-lg hover:bg-[#1a8cd8]"
              >
                Add Unit
              </button>
              <button
                onClick={() => {
                  setIsUnitModalOpen(false);
                  setNewUnitName('');
                }}
                className="flex-1 px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
