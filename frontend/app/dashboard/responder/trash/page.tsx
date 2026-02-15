'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TrashItem {
  id: number;
  user_id: number;
  case_id: number;
  case_data: string;
  deleted_at: string;
  auto_delete_at: string;
}

export default function TrashPage() {
  const router = useRouter();
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTrash();
    autoCleanExpired();
  }, []);

  const getAuthToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Session expired. Please login again.');
      router.push('/login');
      return null;
    }
    return token;
  };

  const fetchTrash = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch('http://127.0.0.1:8001/api/v1/feedback/trash/my-trash', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTrashItems(data);
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching trash:', error);
    }
  };

  const autoCleanExpired = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await fetch('http://127.0.0.1:8001/api/v1/feedback/trash/auto-clean', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Refresh after auto-clean
      fetchTrash();
    } catch (error) {
      console.error('Error auto-cleaning trash:', error);
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePermanentDelete = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      for (const id of selectedItems) {
        await fetch(`http://127.0.0.1:8001/api/v1/feedback/trash/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      setShowDeleteConfirm(false);
      setSelectedItems([]);
      fetchTrash();
    } catch (error) {
      console.error('Error deleting items:', error);
      alert('Failed to delete items');
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilDelete = (autoDeleteDate: string) => {
    const now = new Date();
    const deleteDate = new Date(autoDeleteDate);
    const diff = deleteDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getFilteredTrashItems = () => {
    if (!searchQuery.trim()) return trashItems;
    
    const query = searchQuery.toLowerCase();
    return trashItems.filter(item => {
      const caseData = JSON.parse(item.case_data);
      return (
        item.case_id.toString().includes(query) ||
        caseData.case_number?.toLowerCase().includes(query) ||
        caseData.location?.toLowerCase().includes(query) ||
        new Date(item.deleted_at).toLocaleString().toLowerCase().includes(query)
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation Bar - EXACT COPY FROM DASHBOARD */}
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
                  href="/dashboard/responder"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/responder/feedback"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Feedback
                </Link>
                <Link
                  href="/dashboard/responder/download"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Download
                </Link>
                <Link
                  href="/dashboard/responder/trash"
                  className="text-[#1D9BF0] hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Trash
                </Link>
              </div>
            </div>
            
            {/* Profile Icon */}
            <div className="relative">
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
                    href="/profile/responder"
                    onClick={() => setShowProfileMenu(false)}
                    className="block w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white text-gray-700 font-medium transition flex items-center gap-3 border-b border-gray-100"
                  >
                    <span className="text-xl">👤</span>
                    <span>Profile Settings</span>
                  </Link>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('access_token');
                      localStorage.removeItem('user_data');
                      router.push('/login');
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white text-gray-700 font-medium transition flex items-center gap-3"
                  >
                    <span className="text-xl">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 min-h-screen">
        <div className="w-full px-6 py-8">
          <div className="bg-[#1A1A1A] rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Trash</h1>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trash... (case ID, number, location)"
                  className="px-4 py-2 bg-[#2A2A2A] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-xs placeholder-gray-500 w-96"
                />
                {selectedItems.length > 0 && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition font-medium"
                  >
                    Delete Permanently ({selectedItems.length})
                  </button>
                )}
              </div>
            </div>
        
            <div className="bg-[#2A2A2A] rounded-lg overflow-hidden">
              {getFilteredTrashItems().length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-xl">{searchQuery ? 'No matching items found' : 'Trash is empty'}</p>
                  <p className="mt-2 text-xs">{searchQuery ? 'Try a different search term' : 'Deleted cases will appear here'}</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-1 text-xs font-bold text-white bg-[#1A1A1A] p-2 rounded">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(getFilteredTrashItems().map(item => item.id));
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                        checked={selectedItems.length === getFilteredTrashItems().length && getFilteredTrashItems().length > 0}
                        className="w-4 h-4 cursor-pointer accent-red-500"
                      />
                    </div>
                    <div>Case ID</div>
                    <div>Case Number</div>
                    <div>Deleted At</div>
                    <div>Auto-Delete In</div>
                  </div>
                  
                  {/* Table Rows */}
                  {getFilteredTrashItems().map((item) => {
                    const daysLeft = getDaysUntilDelete(item.auto_delete_at);
                    const caseData = JSON.parse(item.case_data);
                    return (
                      <div key={item.id} className="grid grid-cols-5 gap-1 text-xs text-white p-2 rounded bg-[#2A2A2A] hover:bg-[#3A3A3A] transition">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="w-4 h-4 cursor-pointer accent-red-500"
                          />
                        </div>
                        <div className="truncate">#{item.case_id}</div>
                        <div className="truncate">{caseData.case_number || 'N/A'}</div>
                        <div className="truncate">{new Date(item.deleted_at).toLocaleString()}</div>
                        <div className="truncate">
                          <span className={`${daysLeft < 30 ? 'text-red-500 font-semibold' : 'text-gray-300'}`}>
                            {daysLeft} days
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 text-gray-400 text-xs">
              <p>* Items in trash will be automatically deleted after 3 months (90 days)</p>
              <p className="mt-1">* Total: {getFilteredTrashItems().length} item{getFilteredTrashItems().length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md">
            <div className="text-center">
              <div className="text-6xl text-red-500 mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-black mb-2">Permanently Delete?</h3>
              <p className="text-gray-700 mb-6">
                This will permanently delete {selectedItems.length} item(s). This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePermanentDelete}
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
