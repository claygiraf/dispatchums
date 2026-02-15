'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Case {
  id: number;
  case_number: string;
  call_date: string;
  location: string;
  resource_id: string;
  ambulance: string;
  status: string;
  case_duration: number;
}

interface FeedbackMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  sender_dispatcher_id?: string;
  message: string;
  photo_url?: string;
  is_read: boolean;
  created_at: string;
}

interface FeedbackConversation {
  id: number;
  user_id: number;
  case_number: string;
  created_at: string;
  updated_at: string;
  messages: FeedbackMessage[];
  unread_count: number;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [dateFilter, setDateFilter] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  // Chat state
  const [conversations, setConversations] = useState<FeedbackConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<FeedbackConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [selectedCaseForFeedback, setSelectedCaseForFeedback] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedMessageForDelete, setSelectedMessageForDelete] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to get avatar color based on role and ID
  const getAvatarColor = (role: string, dispatcherId?: string) => {
    if (role === 'admin' || (dispatcherId && dispatcherId.startsWith('30'))) {
      return 'bg-[#1D9BF0]'; // Blue for admin
    } else if (role === 'responder' || (dispatcherId && dispatcherId.startsWith('20'))) {
      return 'bg-green-500'; // Green for responder
    } else {
      return 'bg-purple-500'; // Purple for dispatcher
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 1).toUpperCase();
  };

  useEffect(() => {
    fetchCases();
    fetchConversations();
    // Get current user ID
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      scrollToBottom();
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAuthToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Session expired. Please login again.');
      router.push('/login');
      return null;
    }
    return token;
  };

  const fetchCases = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      setLoading(true);
      const response = await fetch('http://127.0.0.1:8001/api/v1/cases/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCases(data);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch('http://127.0.0.1:8001/api/v1/feedback/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const markMessagesAsRead = async (conversationId: number) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await fetch(`http://127.0.0.1:8001/api/v1/feedback/chat/conversation/${conversationId}/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !photoFile) return;
    if (!selectedCaseForFeedback && !selectedConversation) return;

    try {
      const token = getAuthToken();
      if (!token) return;

      let photoUrl = null;
      if (photoFile) {
        const reader = new FileReader();
        photoUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(photoFile);
        });
      }

      const response = await fetch('http://127.0.0.1:8001/api/v1/feedback/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          case_number: selectedConversation?.case_number || selectedCaseForFeedback,
          message: newMessage.trim(),
          photo_url: photoUrl
        })
      });

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      if (response.ok) {
        setNewMessage('');
        setPhotoFile(null);
        setPhotoPreview(null);
        await fetchConversations();
        
        if (selectedConversation) {
          const updatedConv = await fetchConversationById(selectedConversation.id);
          if (updatedConv) {
            setSelectedConversation(updatedConv);
          }
        }
      } else {
        const error = await response.json();
        alert(`Failed to send message: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const fetchConversationById = async (conversationId: number): Promise<FeedbackConversation | null> => {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await fetch(`http://127.0.0.1:8001/api/v1/feedback/chat/conversation/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
    return null;
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setPhotoFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteConversation = async (conversationId: number) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`http://127.0.0.1:8001/api/v1/feedback/chat/conversation/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      if (response.ok) {
        await fetchConversations();
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(null);
          setShowChat(false);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Are you sure you want to delete this message? This action is permanent for both parties.')) return;

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`http://127.0.0.1:8001/api/v1/feedback/chat/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      if (response.ok) {
        // Refresh the conversation
        if (selectedConversation) {
          const updatedConv = await fetchConversationById(selectedConversation.id);
          if (updatedConv) {
            setSelectedConversation(updatedConv);
          }
        }
        await fetchConversations();
        setSelectedMessageForDelete(null);
      } else {
        const error = await response.json();
        alert(`Failed to delete message: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const openChat = (caseNumber: string) => {
    setSelectedCaseForFeedback(caseNumber);
    
    const existingConv = conversations.find(c => c.case_number === caseNumber);
    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      setSelectedConversation(null);
    }
    
    setShowChat(true);
  };

  const getDateRangeText = () => {
    const today = new Date();
    const formatDate = (date: Date) => {
      const d = date.getDate();
      const m = date.getMonth() + 1;
      const y = date.getFullYear();
      return `${d}.${m}.${y}`;
    };

    if (dateFilter === 'daily') {
      return formatDate(today);
    } else if (dateFilter === 'weekly') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(today.setDate(diff));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return `${formatDate(monday)} - ${formatDate(sunday)}`;
    } else {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    }
  };

  const getFilteredCases = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return cases.filter(caseItem => {
      const caseDate = new Date(caseItem.call_date);
      caseDate.setHours(0, 0, 0, 0);

      if (dateFilter === 'daily') {
        return caseDate.getTime() === today.getTime();
      } else if (dateFilter === 'weekly') {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(today);
        monday.setDate(diff);
        monday.setHours(0, 0, 0, 0);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        return caseDate >= monday && caseDate <= sunday;
      } else {
        return caseDate.getMonth() === today.getMonth() && 
               caseDate.getFullYear() === today.getFullYear();
      }
    });
  };

  const filteredCases = getFilteredCases();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
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
                  href="/dashboard/responder"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/responder/feedback"
                  className="text-[#1D9BF0] hover:text-[#1D9BF0] transition font-medium text-lg"
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
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
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
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/profile/responder');
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white text-gray-700 font-medium transition flex items-center gap-3 border-b border-gray-100"
                  >
                    <span>Profile Settings</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white text-gray-700 font-medium transition flex items-center gap-3"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-8 px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Feedback</h2>
            <p className="text-gray-400 text-lg">Create a chat to submit feedback and suggestions to admin(s).</p>
          </div>

          {/* Chat & Feedback History Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#1A1A1A] rounded-lg border border-[#27272A] p-6">
              <h3 className="text-xl font-bold text-white mb-4">Chat</h3>

              {showChat && selectedCaseForFeedback ? (
                <div className="flex flex-col h-[600px]">
                  <div className="pb-4 border-b border-[#27272A] mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-semibold text-lg">Case: {selectedCaseForFeedback}</h4>
                        {selectedConversation && selectedConversation.messages.length > 0 && (
                          <p className="text-gray-400 text-sm">
                            Chat created by {selectedConversation.messages[0].sender_name} 
                            {selectedConversation.messages[0].sender_dispatcher_id && ` (ID: ${selectedConversation.messages[0].sender_dispatcher_id})`}
                          </p>
                        )}
                        {!selectedConversation && (
                          <p className="text-gray-400 text-sm">New conversation</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setShowChat(false);
                          setSelectedConversation(null);
                          setSelectedCaseForFeedback('');
                        }}
                        className="text-gray-400 hover:text-white transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                    {selectedConversation?.messages.reduce((acc: any[], msg, index, array) => {
                      const msgDate = new Date(msg.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                      const prevMsgDate = index > 0 ? new Date(array[index - 1].created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : null;
                      
                      // Add date header if day changed
                      if (msgDate !== prevMsgDate) {
                        acc.push(
                          <div key={`date-${index}`} className="text-center my-4">
                            <span className="text-gray-400 text-xs bg-[#1A1A1A] px-3 py-1 rounded-full">
                              {msgDate}
                            </span>
                          </div>
                        );
                      }
                      
                      const isSender = msg.sender_dispatcher_id === currentUserId?.toString();
                      const avatarColor = getAvatarColor(msg.sender_role, msg.sender_dispatcher_id);
                      const initials = getInitials(msg.sender_name);
                      
                      acc.push(
                        <div
                          key={msg.id}
                          className={`flex ${isSender ? 'justify-end' : 'justify-start'} group`}
                        >
                          <div className="flex items-end gap-2">
                            {!isSender && (
                              <div 
                                className={`${avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}
                                title={`${msg.sender_name} (ID: ${msg.sender_dispatcher_id})`}
                              >
                                {initials}
                              </div>
                            )}
                            <div className="relative">
                              <div
                                className={`max-w-[400px] rounded-lg p-3 ${
                                  isSender
                                    ? 'bg-green-500 text-white rounded-br-none'
                                    : 'bg-[#2A2A2A] text-white rounded-bl-none'
                                }`}
                              >
                                {msg.message && <div className="mb-2">{msg.message}</div>}
                                {msg.photo_url && (
                                  <img
                                    src={msg.photo_url}
                                    alt="Attachment"
                                    className="rounded max-w-full h-auto"
                                  />
                                )}
                                <div className="text-xs opacity-75 mt-1">
                                  {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete message"
                              >
                                ✕
                              </button>
                            </div>
                            {isSender && (
                              <div 
                                className={`${avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}
                                title={`${msg.sender_name} (ID: ${msg.sender_dispatcher_id})`}
                              >
                                {initials}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                      
                      return acc;
                    }, [])}
                    <div ref={messagesEndRef} />
                  </div>

                  {photoPreview && (
                    <div className="mb-3 relative inline-block">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="max-h-32 rounded border border-[#27272A]"
                      />
                      <button
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition"
                      title="Upload photo"
                    >
                      📷
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 bg-[#2A2A2A] text-white rounded-lg border border-[#27272A] focus:border-[#1D9BF0] focus:outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && !photoFile}
                      className="px-6 py-2 bg-[#1D9BF0] text-white rounded-lg hover:bg-[#1a8cd8] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-[600px] flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-xl mb-2">No conversation selected</p>
                    <p className="text-sm">Click &quot;Chat&quot; on a case to start messaging</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#1A1A1A] rounded-lg border border-[#27272A] p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Feedback History ({conversations.length})
              </h3>

              <div className="h-[520px] overflow-y-auto space-y-3">
                {conversations.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <p className="text-lg">No conversations yet</p>
                    <p className="text-sm mt-2">Start a chat with a case to see it here</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="bg-[#2A2A2A] rounded-lg p-4 hover:bg-[#3A3A3A] transition cursor-pointer relative"
                      onClick={() => {
                        setSelectedConversation(conv);
                        setSelectedCaseForFeedback(conv.case_number);
                        setShowChat(true);
                      }}
                    >
                      {conv.unread_count > 0 && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2A2A2A]" title={`${conv.unread_count} unread message${conv.unread_count !== 1 ? 's' : ''}`}></div>
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-semibold">Case: {conv.case_number}</h4>
                          <p className="text-gray-400 text-sm">
                            {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      
                      {conv.messages.length > 0 && (
                        <div className="text-gray-400 text-sm truncate">
                          {conv.messages[conv.messages.length - 1].message || '📷 Photo'}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-500 text-xs">
                          {new Date(conv.updated_at).toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conv.id);
                          }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* List of Calls Section - Exactly like Dashboard */}
          <div className="mt-8 p-4 overflow-y-auto bg-[#1A1A1A]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-white text-lg font-bold border-b border-gray-600 pb-2 inline-block">
                  List of Calls
                </h3>
                
                {/* Date Filter Buttons */}
                <div className="mt-3 mb-2">
                  <p className="text-xs text-gray-400 mb-2">Search calls by:</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setDateFilter('daily')}
                      className={`px-4 py-2 text-xs font-medium rounded transition ${
                        dateFilter === 'daily' 
                          ? 'bg-[#1D9BF0] text-white' 
                          : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
                      }`}
                    >
                      Daily
                    </button>
                    <button 
                      onClick={() => setDateFilter('weekly')}
                      className={`px-4 py-2 text-xs font-medium rounded transition ${
                        dateFilter === 'weekly' 
                          ? 'bg-[#1D9BF0] text-white' 
                          : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
                      }`}
                    >
                      Weekly
                    </button>
                    <button 
                      onClick={() => setDateFilter('monthly')}
                      className={`px-4 py-2 text-xs font-medium rounded transition ${
                        dateFilter === 'monthly' 
                          ? 'bg-[#1D9BF0] text-white' 
                          : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 font-bold">
                    {getDateRangeText()}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400">
                    Total: {filteredCases.length} {filteredCases.length === 1 ? 'call' : 'calls'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const now = new Date();
                  const year = now.getFullYear();
                  const month = String(now.getMonth() + 1).padStart(2, '0');
                  const day = String(now.getDate()).padStart(2, '0');
                  const hour = String(now.getHours()).padStart(2, '0');
                  const min = String(now.getMinutes()).padStart(2, '0');
                  const autoCase = `${year}${month}${day}${hour}${min}`;
                  window.location.href = `/entry?case=${autoCase}`;
                }}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition flex items-center gap-2"
              >
                <span className="text-xl">+</span> Create New Case
              </button>
            </div>
            
            {loading ? (
              <div className="text-gray-400 text-center mt-8">Loading cases...</div>
            ) : (
              <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-8 gap-1 text-xs font-bold text-white bg-[#2A2A2A] p-2 rounded">
                  <div>Call Card #</div>
                  <div>Location</div>
                  <div>Resource</div>
                  <div>Ambulance</div>
                  <div>Status</div>
                  <div>Duration</div>
                  <div>Feedback</div>
                  <div>Download</div>
                </div>
                
                {/* Table Rows */}
                {filteredCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="grid grid-cols-8 gap-1 text-xs text-white p-2 rounded transition bg-[#2A2A2A] hover:bg-[#3A3A3A]"
                  >
                    <div className="truncate">{caseItem.case_number}</div>
                    <div className="truncate" title={caseItem.location}>{caseItem.location}</div>
                    <div className="truncate">{caseItem.resource_id || '00001'}</div>
                    <div className="truncate">{caseItem.ambulance || 'N/A'}</div>
                    <div className="flex items-center gap-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        caseItem.status?.toLowerCase() === 'completed' ? 'bg-green-500' :
                        caseItem.status?.toLowerCase() === 'active' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></span>
                      <span className="truncate">{caseItem.status}</span>
                    </div>
                    <div className="truncate">{caseItem.case_duration ? `${Math.floor(caseItem.case_duration / 60)}m ${caseItem.case_duration % 60}s` : '0m 0s'}</div>
                    <div>
                      <button 
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition font-medium"
                        onClick={() => openChat(caseItem.case_number)}
                        title="Chat"
                      >
                        💬
                      </button>
                    </div>
                    <div>
                      <button 
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition font-medium"
                        onClick={() => {
                          // Download functionality (placeholder)
                          alert(`Download case ${caseItem.case_number}`);
                        }}
                        title="Download Call Card"
                      >
                        📥
                      </button>
                    </div>
                  </div>
                ))}
                
                {filteredCases.length === 0 && !loading && (
                  <div className="text-gray-400 text-center mt-8 p-4">
                    No cases found for this time period.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


