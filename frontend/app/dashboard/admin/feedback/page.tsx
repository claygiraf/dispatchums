'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Chat state
  const [conversations, setConversations] = useState<FeedbackConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<FeedbackConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
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

  const fetchConversations = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      // Admin sees all conversations
      const response = await fetch('http://127.0.0.1:8001/api/v1/feedback/chat/all-conversations', {
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
    if (!selectedConversation) return;

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
          case_number: selectedConversation.case_number,
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
        
        const updatedConv = await fetchConversationById(selectedConversation.id);
        if (updatedConv) {
          setSelectedConversation(updatedConv);
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
      return null;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`http://127.0.0.1:8001/api/v1/feedback/chat/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchConversations();
        if (selectedConversation) {
          const updatedConv = await fetchConversationById(selectedConversation.id);
          if (updatedConv) {
            setSelectedConversation(updatedConv);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleDeleteConversation = async (conversationId: number) => {
    if (!confirm('Are you sure you want to delete this entire conversation?')) return;

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`http://127.0.0.1:8001/api/v1/feedback/chat/conversation/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setShowChat(false);
        setSelectedConversation(null);
        await fetchConversations();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

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
                  href="/dashboard/admin"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/admin/users"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
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
                  className="text-[#1D9BF0] hover:text-[#1D9BF0] transition font-medium text-lg"
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
                      router.push('/profile/admin');
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

      <div className="pt-36 pb-8 px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">All Feedback Conversations</h2>
            <p className="text-gray-400 text-lg">View and respond to feedback from dispatchers and responders.</p>
          </div>

          {/* Chat & History Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chat Window */}
            <div className="bg-[#1A1A1A] rounded-lg border border-[#27272A] p-6">
              <h3 className="text-xl font-bold text-white mb-4">Chat</h3>

              {showChat && selectedConversation ? (
                <div className="flex flex-col h-[600px]">
                  <div className="pb-4 border-b border-[#27272A] mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-semibold text-lg">Case: {selectedConversation.case_number}</h4>
                        {selectedConversation && selectedConversation.messages.length > 0 && (
                          <p className="text-gray-400 text-sm">
                            Chat created by {selectedConversation.messages[0].sender_name} 
                            {selectedConversation.messages[0].sender_dispatcher_id && ` (ID: ${selectedConversation.messages[0].sender_dispatcher_id})`}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setShowChat(false);
                          setSelectedConversation(null);
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
                                    ? 'bg-[#1D9BF0] text-white rounded-br-none'
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
                      className="px-6 py-2 bg-[#1D9BF0] text-white rounded-lg hover:bg-[#1a8cd8] transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[600px] text-gray-400">
                  <p>Select a conversation from history to view and reply</p>
                </div>
              )}
            </div>

            {/* Feedback History */}
            <div className="bg-[#1A1A1A] rounded-lg border border-[#27272A] p-6">
              <h3 className="text-xl font-bold text-white mb-4">Feedback History</h3>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {conversations.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No feedback conversations yet</p>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="bg-[#2A2A2A] rounded-lg p-4 hover:bg-[#3A3A3A] transition cursor-pointer border border-[#27272A]"
                      onClick={() => {
                        setSelectedConversation(conv);
                        setShowChat(true);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-semibold">Case: {conv.case_number}</h4>
                          {conv.messages.length > 0 && (
                            <p className="text-gray-400 text-sm">
                              Created by {conv.messages[0].sender_name}
                              {conv.messages[0].sender_dispatcher_id && ` (ID: ${conv.messages[0].sender_dispatcher_id})`}
                            </p>
                          )}
                        </div>
                        {conv.unread_count > 0 && (
                          <span className="bg-[#1D9BF0] text-white text-xs px-2 py-1 rounded-full">
                            {conv.unread_count} new
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm truncate mb-2">
                        {conv.messages[conv.messages.length - 1]?.message || 'Photo message'}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{conv.messages.length} messages</span>
                        <span>{new Date(conv.updated_at).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                        className="mt-2 text-red-500 hover:text-red-400 text-sm"
                      >
                        Delete Conversation
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
