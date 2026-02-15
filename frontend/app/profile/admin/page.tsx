'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [tempFullName, setTempFullName] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempPersonalEmail, setTempPersonalEmail] = useState('');
  const [tempGender, setTempGender] = useState('Male');
  const [tempDob, setTempDob] = useState('');
  const [tempUnit, setTempUnit] = useState('');
  const [tempRole, setTempRole] = useState('');
  const [tempDispatcherId, setTempDispatcherId] = useState('');
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');
  const [tempAddress, setTempAddress] = useState('');
  const [tempCity, setTempCity] = useState('');
  const [tempState, setTempState] = useState('');
  const [tempPostcode, setTempPostcode] = useState('');
  const [accountCreated, setAccountCreated] = useState('');
  const [editableField, setEditableField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [tempProfilePicture, setTempProfilePicture] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [confirmUsername, setConfirmUsername] = useState('');
  const [usernameLastChanged, setUsernameLastChanged] = useState<string | null>(null);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [sentCode, setSentCode] = useState('');

  // Load user data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        
        setTempFullName(user.full_name || '');
        setTempUsername(user.username || '');
        setTempEmail(user.email || '');
        setTempPersonalEmail(user.personal_email || '');
        setTempGender(user.gender || 'Male');
        setTempDob(user.dob || '');
        setTempUnit(user.unit || '');
        setTempRole(user.role || '');
        setTempDispatcherId(user.dispatcher_id || '');
        setTempPhoneNumber(user.phone_number || '');
        setTempAddress(user.address || '');
        setTempCity(user.city || '');
        setTempState(user.state || '');
        setTempPostcode(user.postcode || '');
        setProfilePicture(user.profile_picture || null);
        
        // Check username change eligibility
        if (user.username_last_changed) {
          setUsernameLastChanged(user.username_last_changed);
          const lastChanged = new Date(user.username_last_changed);
          const daysSinceChange = (Date.now() - lastChanged.getTime()) / (1000 * 60 * 60 * 24);
          setCanChangeUsername(daysSinceChange >= 365);
        } else {
          setCanChangeUsername(true);
        }
        
        if (user.created_at) {
          setAccountCreated(new Date(user.created_at).toLocaleDateString());
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      console.log('Image converted to base64, length:', base64.length);
      setTempProfilePicture(base64);
      setShowUploadConfirm(true);
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login again');
        router.push('/login');
        return;
      }

      console.log('Saving profile with picture:', profilePicture ? 'Yes' : 'No');
      console.log('Profile picture length:', profilePicture?.length || 0);

      const updatedUser = await api.updateProfile(token, {
        full_name: tempFullName,
        // username: cannot be changed
        email: tempEmail,
        personal_email: tempPersonalEmail,
        gender: tempGender,
        dob: tempDob,
        // unit: cannot be changed
        // role: cannot be changed
        phone_number: tempPhoneNumber,
        address: tempAddress,
        city: tempCity,
        state: tempState,
        postcode: tempPostcode,
        profile_picture: profilePicture || undefined,
      });

      console.log('Profile updated successfully:', updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setEditableField(null);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.detail) {
        errorMessage = error.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      alert(`Failed to save profile: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8 relative">
          {/* Close Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
          <h1 className="text-3xl font-bold text-black mb-6">Profile Settings</h1>

          <div className="flex gap-8">
            {/* Profile Picture Section */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 bg-gray-300 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500 text-6xl">👤</span>
                )}
              </div>
              <input
                type="file"
                id="profile-picture-upload"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => document.getElementById('profile-picture-upload')?.click()}
                className="w-full px-4 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8]"
              >
                Upload Picture
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">Click to upload from device</p>
              {accountCreated && (
                <p className="text-sm text-gray-600 mt-4">Account created on: {accountCreated}</p>
              )}
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">Full Name</label>
                    <input
                      type="text"
                      value={tempFullName}
                      onChange={(e) => setTempFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">Personal Email</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="email"
                        value={tempPersonalEmail}
                        onChange={(e) => setTempPersonalEmail(e.target.value)}
                        placeholder="personal@gmail.com"
                        className="flex-1 px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                      />
                      {!isEmailVerified ? (
                        <button
                          onClick={() => {
                            if (!tempPersonalEmail || !tempPersonalEmail.includes('@')) {
                              alert('Please enter a valid personal email');
                              return;
                            }
                            const code = Math.floor(100000 + Math.random() * 900000).toString();
                            setSentCode(code);
                            setShowVerifyDialog(true);
                            alert(`Verification code sent to ${tempPersonalEmail}\nCode: ${code} (Development mode)`);
                          }}
                          className="px-4 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8]"
                        >
                          Verify
                        </button>
                      ) : (
                        <span className="text-green-600 text-2xl" title="Verified">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">For password recovery</p>
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">Username</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempUsername}
                        className="flex-1 px-3 py-2 bg-gray-100 text-black border border-gray-400 rounded"
                        disabled
                      />
                      <button
                        onClick={() => setShowChangeUsername(true)}
                        disabled={!canChangeUsername}
                        className="px-4 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Change
                      </button>
                    </div>
                    {canChangeUsername ? (
                      <p className="text-xs text-green-600 mt-1">✓ You can change your username</p>
                    ) : (
                      <p className="text-xs text-orange-600 mt-1">
                        ⚠️ Username can be changed once a year. Last changed: {usernameLastChanged ? new Date(usernameLastChanged).toLocaleDateString() : 'Never'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">Password</label>
                    <input
                      type="password"
                      value="********"
                      className="w-full px-3 py-2 bg-gray-100 text-black border border-gray-400 rounded"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">ID</label>
                    <input
                      type="text"
                      value={tempDispatcherId}
                      className="w-full px-3 py-2 bg-gray-100 text-black border border-gray-400 rounded"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">Gender</label>
                    <select
                      value={tempGender}
                      onChange={(e) => setTempGender(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">Date of Birth</label>
                    <input
                      type="date"
                      value={tempDob}
                      onChange={(e) => setTempDob(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Work Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">Unit</label>
                    <select
                      value={tempUnit}
                      onChange={(e) => setTempUnit(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                    >
                      <option value="MECC HUMS">MECC HUMS</option>
                      <option value="MECC HQE">MECC HQE</option>
                      <option value="MECC Tawau">MECC Tawau</option>
                      <option value="MECC Keningau">MECC Keningau</option>
                      <option value="MECC Beaufort">MECC Beaufort</option>
                      <option value="MECC Semporna">MECC Semporna</option>
                      <option value="MECC Lahad Datu">MECC Lahad Datu</option>
                      <option value="MECC Sandakan">MECC Sandakan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">Role</label>
                    <select
                      value={tempRole}
                      className="w-full px-3 py-2 bg-gray-100 text-black border border-gray-400 rounded"
                      disabled
                    >
                      <option value="dispatcher">Dispatcher</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                  </div>
                </div>
              </div>

              {/* Location & Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Location & Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-black text-sm mb-1 font-medium">Address</label>
                    <input
                      type="text"
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">City</label>
                    <input
                      type="text"
                      value={tempCity}
                      onChange={(e) => setTempCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">State</label>
                    <input
                      type="text"
                      value={tempState}
                      onChange={(e) => setTempState(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">Postcode</label>
                    <input
                      type="text"
                      value={tempPostcode}
                      onChange={(e) => setTempPostcode(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      value={tempPhoneNumber}
                      onChange={(e) => setTempPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Upload Picture Confirmation Dialog */}
    {showUploadConfirm && (
          <div className="fixed inset-0 flex items-center justify-center" style={{zIndex: 999999}}>
            <div className="fixed inset-0 bg-black/70" onClick={() => setShowUploadConfirm(false)}></div>
            <div className="relative bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] max-w-md z-10">
              <h3 className="text-xl font-semibold text-black mb-4">Upload Profile Picture</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to upload this picture as your profile picture? This will replace your current profile picture.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowUploadConfirm(false);
                    setTempProfilePicture(null);
                  }}
                  className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setProfilePicture(tempProfilePicture);
                    setShowUploadConfirm(false);
                    setTempProfilePicture(null);
                    alert('Image loaded! Click "Save Changes" to save.');
                  }}
                  className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
                >
                  Upload Picture
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Dialog */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center" style={{zIndex: 999999}}>
            <div className="fixed inset-0 bg-black/70" onClick={() => setShowLogoutConfirm(false)}></div>
            <div className="relative bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] max-w-md z-10">
              <h3 className="text-xl font-semibold text-black mb-4">Confirm Logout</h3>
              <p className="text-gray-700 mb-6">
                Confirm to log out and return to Login?
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user_data');
                    router.push('/login');
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Verification Dialog */}
        {showVerifyDialog && (
          <div className="fixed inset-0 flex items-center justify-center" style={{zIndex: 999999}}>
            <div className="fixed inset-0 bg-black/70" onClick={() => setShowVerifyDialog(false)}></div>
            <div className="relative bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] max-w-md w-full z-10">
              <h3 className="text-xl font-semibold text-black mb-4">Verify Personal Email</h3>
              <p className="text-gray-700 mb-4">
                Enter the verification code sent to {tempPersonalEmail}
              </p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC] mb-4"
              />
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowVerifyDialog(false);
                    setVerificationCode('');
                  }}
                  className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (verificationCode === sentCode) {
                      setIsEmailVerified(true);
                      setShowVerifyDialog(false);
                      setVerificationCode('');
                      alert('Email verified successfully!');
                    } else {
                      alert('Invalid code. Please try again.');
                    }
                  }}
                  className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Username Dialog */}
        {showChangeUsername && (
          <div className="fixed inset-0 flex items-center justify-center" style={{zIndex: 999999}}>
            <div className="fixed inset-0 bg-black/70" onClick={() => setShowChangeUsername(false)}></div>
            <div className="relative bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] max-w-md w-full z-10">
              <h3 className="text-xl font-semibold text-black mb-4">Change Username</h3>
              <p className="text-gray-700 mb-4">
                Your username can only be changed once per year. Current username: <strong>{tempUsername}</strong>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-black text-sm mb-1 font-medium">New Username</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                  />
                </div>
                <div>
                  <label className="block text-black text-sm mb-1 font-medium">Confirm Username</label>
                  <input
                    type="text"
                    value={confirmUsername}
                    onChange={(e) => setConfirmUsername(e.target.value)}
                    placeholder="Retype new username"
                    className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                  />
                </div>
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button
                  onClick={() => {
                    setShowChangeUsername(false);
                    setNewUsername('');
                    setConfirmUsername('');
                  }}
                  className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newUsername || !confirmUsername) {
                      alert('Please fill in both fields');
                      return;
                    }
                    if (newUsername !== confirmUsername) {
                      alert('Usernames do not match');
                      return;
                    }
                    if (newUsername.length < 3) {
                      alert('Username must be at least 3 characters');
                      return;
                    }
                    // Update the username
                    setTempUsername(newUsername);
                    setShowChangeUsername(false);
                    setNewUsername('');
                    setConfirmUsername('');
                    alert('Username updated! Click "Save Changes" to confirm.');
                  }}
                  className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
                >
                  Change Username
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
