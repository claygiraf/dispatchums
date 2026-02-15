'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';

interface DialogProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  className?: string;
}

// Common dialog component
const Dialog: React.FC<DialogProps> = ({ 
  title, 
  children, 
  isOpen, 
  onClose, 
  width = '500px',
  className = ''
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className={`bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto ${width ? `w-[${width}]` : ''} ${className}`}>
        <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
          <span>{title}</span>
          <button onClick={onClose} className="text-white hover:bg-red-600 px-2">✕</button>
        </div>
        <div className="p-6 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

interface DialogButtonsProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

// Dialog buttons container
const DialogButtons: React.FC<DialogButtonsProps> = ({ children, align = 'end' }) => (
  <div className={`flex gap-3 justify-${align} mt-6`}>
    {children}
  </div>
);

interface DialogButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
  className?: string;
  width?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
}

// Reusable button component
const DialogButton: React.FC<DialogButtonProps> = ({
  onClick,
  variant = 'secondary',
  children,
  className = '',
  width,
  type = 'button',
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'px-6 py-2 border border-gray-600 transition-colors duration-200';
  const variantClasses = {
    primary: 'bg-[#1D9BF0] text-white enabled:hover:bg-[#1a8cd8]',
    secondary: 'bg-[#C0C0C0] text-black enabled:hover:bg-gray-300',
    danger: 'bg-red-600 text-white enabled:hover:bg-red-700',
    ghost: 'bg-transparent text-black hover:bg-gray-100 border-transparent',
  } as const;

  const sizeClasses = width ? `w-[${width}]` : fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
import { useState, useEffect } from 'react';
import SharedNavigation from '@/components/shared/SharedNavigation';
import { FaPencilAlt } from 'react-icons/fa';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Case interface matching backend
interface Case {
  id: number;
  case_number: string;
  call_date: string;
  location: string;
  postcode: string;
  city: string;
  state: string;
  phone_number: string;
  contact_name?: string;
  language?: string;
  protocol_id?: string;
  protocol_name?: string;
  problem_description?: string;
  chief_complaint?: string;
  patient_age?: number;
  patient_gender?: string;
  is_conscious?: boolean;
  is_breathing?: boolean;
  with_patient?: string;
  num_hurt: number;
  kq_responses?: string;
  determinant_code?: string;
  dispatch_priority: string;
  dispatched_units?: string;
  hazards?: string;
  weapons?: string;
  notes?: string;
  dispatcher_name: string;
  dispatcher_id: string;
  dispatcher_unit?: string;
  dispatcher_location: string;
  dispatcher_city: string;
  dispatcher_state: string;
  dispatcher_postcode: string;
  resource_id: string;
  ambulance: string;
  status: string;
  case_duration: number;
  time_to_dispatch: number;
  dispatch_time: string;
  case_summary: string;
  feedback: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [caseNumber, setCaseNumber] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(false);

  // Logout function
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    
    // Redirect to login page
    router.push('/login');
  };
  
  const generateCaseNumber = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    // In real app, this should be fetched from database
    const currentCaseCount = 1; // This would be fetched from database
    const caseCount = String(currentCaseCount).padStart(3, '0');
    return `${year}${month}${caseCount}`;
  };
  
  // Menu states
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showSpecLogMenu, setShowSpecLogMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showTabsMenu, setShowTabsMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showSearchIncident, setShowSearchIncident] = useState(false);
  const [showAbortReason, setShowAbortReason] = useState(false);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [showPickupCase, setShowPickupCase] = useState(false);
  const [showPickupConfirm, setShowPickupConfirm] = useState(false);
  const [selectedPickupCase, setSelectedPickupCase] = useState<number | null>(null);
  const [showChangeCaseNumber, setShowChangeCaseNumber] = useState(false);
  const [showPrintCase, setShowPrintCase] = useState(false);
  const [showLogoffConfirmation, setShowLogoffConfirmation] = useState(false);
  const [showLogComments, setShowLogComments] = useState(false);
  const [showUrgentMessage, setShowUrgentMessage] = useState(false);
  const [showHazmatInfo, setShowHazmatInfo] = useState(false);
  const [showCBRN, setShowCBRN] = useState(false);
  const [showSARS, setShowSARS] = useState(false);
  const [showInvalidCaseNumber, setShowInvalidCaseNumber] = useState(false);
  const [showVersionInfo, setShowVersionInfo] = useState(false);
  const [showSpecificPAI, setShowSpecificPAI] = useState(false);
  const [showLanguageApplyConfirm, setShowLanguageApplyConfirm] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showLearnMoreConfirm, setShowLearnMoreConfirm] = useState(false);
  const [selectedOperatorLanguage, setSelectedOperatorLanguage] = useState('ENGLISH');
  const [selectedCallerLanguage, setSelectedCallerLanguage] = useState('ENGLISH');
  const [tempOperatorLanguage, setTempOperatorLanguage] = useState('ENGLISH');
  const [tempCallerLanguage, setTempCallerLanguage] = useState('ENGLISH');
  const [expandedPAI, setExpandedPAI] = useState<Record<string, boolean>>({});
  const [selectedPAI, setSelectedPAI] = useState<string[]>([]);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [sortChiefComplaints, setSortChiefComplaints] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [showChangeConfirm, setShowChangeConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [showVerifyEmailDialog, setShowVerifyEmailDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailToVerify, setEmailToVerify] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [changeType, setChangeType] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  // Controlled profile fields so updates reflect immediately in the UI
  const [fullName, setFullName] = useState('John Supervisor');
  const [tempFullName, setTempFullName] = useState('John Supervisor');
  const [username, setUsername] = useState('SUPERVISOR');
  const [tempUsername, setTempUsername] = useState('SUPERVISOR');
  const [email, setEmail] = useState('supervisor@dispatchums.com');
  const [tempEmail, setTempEmail] = useState('supervisor@dispatchums.com');
  const [personalEmail, setPersonalEmail] = useState('');
  const [tempPersonalEmail, setTempPersonalEmail] = useState('');
  const [gender, setGender] = useState('Male');
  const [tempGender, setTempGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [tempDob, setTempDob] = useState('');
  const [unit, setUnit] = useState('MECC HUMS');
  const [tempUnit, setTempUnit] = useState('MECC HUMS');
  const [address, setAddress] = useState('');
  const [tempAddress, setTempAddress] = useState('');
  const [city, setCity] = useState('Kota Kinabalu');
  const [tempCity, setTempCity] = useState('Kota Kinabalu');
  const [state, setState] = useState('Sabah');
  const [tempState, setTempState] = useState('Sabah');
  const [postcode, setPostcode] = useState('88000');
  const [tempPostcode, setTempPostcode] = useState('88000');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');
  const [dispatcherId, setDispatcherId] = useState('PED001');
  const [isWaiting, setIsWaiting] = useState(false);
  const [nextIncident, setNextIncident] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editableField, setEditableField] = useState<string | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackCaseNumber, setFeedbackCaseNumber] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackPhoto, setFeedbackPhoto] = useState<File | null>(null);
  const [feedbackPhotoPreview, setFeedbackPhotoPreview] = useState<string | null>(null);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [showDeleteConfirmCase, setShowDeleteConfirmCase] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<Case | null>(null);
  const [selectedCasesForDelete, setSelectedCasesForDelete] = useState<number[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [showProfilePictureError, setShowProfilePictureError] = useState(false);
  const [profilePictureErrorMessage, setProfilePictureErrorMessage] = useState('');
  const [dateFilter, setDateFilter] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [filterDateRange, setFilterDateRange] = useState('');
  const [pieChartPeriod, setPieChartPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [lineChartPeriod, setLineChartPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [pieAnalyticsData, setPieAnalyticsData] = useState<any>(null);
  const [lineAnalyticsData, setLineAnalyticsData] = useState<any>(null);
  
  // Load profile data from backend and localStorage on mount
  useEffect(() => {
    // First, try to fetch fresh data from backend
    const loadProfileFromBackend = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const response = await fetch('http://127.0.0.1:8001/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const user = await response.json();
            // Update all profile fields from backend
            if (user.profile_picture) setProfilePicture(user.profile_picture);
            if (user.full_name) setFullName(user.full_name);
            if (user.username) setUsername(user.username);
            if (user.email) setEmail(user.email);
            if (user.personal_email) setPersonalEmail(user.personal_email);
            if (user.is_verified !== undefined) setIsEmailVerified(user.is_verified);
            if (user.gender) setGender(user.gender);
            if (user.dob) setDob(user.dob);
            if (user.unit) setUnit(user.unit);
            if (user.address) setAddress(user.address);
            if (user.city) setCity(user.city);
            if (user.state) setState(user.state);
            if (user.postcode) setPostcode(user.postcode);
            if (user.phone_number) setPhoneNumber(user.phone_number);
            if (user.dispatcher_id) setDispatcherId(user.dispatcher_id);
            
            // Set temp values as well
            setTempFullName(user.full_name || '');
            setTempUsername(user.username || '');
            setTempEmail(user.email || '');
            setTempPersonalEmail(user.personal_email || '');
            setTempGender(user.gender || 'Male');
            setTempDob(user.dob || '');
            setTempUnit(user.unit || 'MECC HUMS');
            setTempAddress(user.address || '');
            setTempCity(user.city || '');
            setTempState(user.state || '');
            setTempPostcode(user.postcode || '');
            setTempPhoneNumber(user.phone_number || '');
            
            // Update localStorage with fresh data
            localStorage.setItem('user_data', JSON.stringify(user));
            return; // Exit early if backend fetch succeeds
          }
        }
      } catch (error) {
        console.error('Error loading profile from backend:', error);
      }
      
      // Fallback to localStorage if backend fetch fails
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.profile_picture) setProfilePicture(user.profile_picture);
          if (user.full_name) setFullName(user.full_name);
          if (user.username) setUsername(user.username);
          if (user.email) setEmail(user.email);
          if (user.gender) setGender(user.gender);
          if (user.dob) setDob(user.dob);
          if (user.unit) setUnit(user.unit);
          if (user.address) setAddress(user.address);
          if (user.city) setCity(user.city);
          if (user.state) setState(user.state);
          if (user.postcode) setPostcode(user.postcode);
          if (user.phone_number) setPhoneNumber(user.phone_number);
          if (user.dispatcher_id) setDispatcherId(user.dispatcher_id);
          
          // Set temp values as well
          if (user.full_name) setTempFullName(user.full_name);
          if (user.username) setTempUsername(user.username);
          if (user.email) setTempEmail(user.email);
          if (user.gender) setTempGender(user.gender);
          if (user.dob) setTempDob(user.dob);
          if (user.unit) setTempUnit(user.unit);
          if (user.address) setTempAddress(user.address);
          if (user.city) setTempCity(user.city);
          if (user.state) setTempState(user.state);
          if (user.postcode) setTempPostcode(user.postcode);
          if (user.phone_number) setTempPhoneNumber(user.phone_number);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };
    
    loadProfileFromBackend();
  }, []);
  
  // Fetch cases on component mount
  useEffect(() => {
    fetchCases();
    fetchPieAnalytics();
    fetchLineAnalytics();
  }, []);
  
  // Fetch pie chart analytics when period changes
  useEffect(() => {
    fetchPieAnalytics();
  }, [pieChartPeriod]);
  
  // Fetch line chart analytics when period changes
  useEffect(() => {
    fetchLineAnalytics();
  }, [lineChartPeriod]);
  
  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);
  
  const fetchCases = async () => {
    setLoading(true);
    try {
      // Fetch all cases (including deleted ones for analytics)
      const response = await fetch('http://127.0.0.1:8001/api/v1/cases/');
      if (response.ok) {
        const data = await response.json();
        // Filter out deleted cases from the display list
        // (but keep them in backend for analytics)
        const activeCases = data.filter((c: Case) => c.status !== 'deleted');
        setCases(activeCases);
        // Don't auto-select - user must tick a case to view it
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPieAnalytics = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8001/api/v1/cases/analytics/data?period=${pieChartPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setPieAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching pie analytics:', error);
    }
  };
  
  const fetchLineAnalytics = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8001/api/v1/cases/analytics/data?period=${lineChartPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setLineAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching line analytics:', error);
    }
  };
  
  const handleCaseClick = (caseItem: Case) => {
    // Toggle selection when clicking on row
    if (selectedCase?.id === caseItem.id) {
      setSelectedCase(null);
    } else {
      setSelectedCase(caseItem);
    }
  };
  
  const formatDuration = (seconds: number | null | undefined) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return '0m 0s';
    // Take absolute value to avoid negative times
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = Math.floor(absSeconds % 60);
    return `${mins}m ${secs}s`;
  };
  
  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'completed') return 'bg-green-500';
    if (statusLower === 'incomplete') return 'bg-orange-500';
    if (statusLower === 'en route' || statusLower === 'enroute') return 'bg-yellow-500';
    if (statusLower === 'arrived') return 'bg-blue-500';
    if (statusLower === 'depart') return 'bg-purple-500';
    return 'bg-gray-500';
  };

  const handleFeedbackPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeedbackPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeedbackPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        setProfilePictureErrorMessage('File type not supported. Only PNG, JPG, and JPEG formats are supported.');
        setShowProfilePictureError(true);
        e.target.value = ''; // Reset input
        return;
      }
      
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
      setShowUploadConfirm(true);
    }
  };

  const confirmProfilePictureUpload = () => {
    if (profilePicture && profilePictureFile) {
      // Update user data in localStorage with new profile picture
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        user.profile_picture = profilePicture;
        localStorage.setItem('user_data', JSON.stringify(user));
      }
      
      // Also save standalone for quick access
      localStorage.setItem('profile_picture', profilePicture);
      
      setShowUploadConfirm(false);
      
      // TODO: Upload to backend when auth is implemented
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login again');
        router.push('/login');
        return;
      }

      const subject = feedbackCaseNumber ? `Feedback for Case ${feedbackCaseNumber}` : 'General Feedback';
      
      const response = await fetch('http://127.0.0.1:8001/api/v1/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: subject,
          message: feedbackText
        })
      });

      if (response.ok) {
        // Close feedback dialog and show success
        setShowFeedbackDialog(false);
        setShowFeedbackSuccess(true);
        
        // Reset form
        setFeedbackText('');
        setFeedbackCaseNumber('');
        setFeedbackPhoto(null);
        setFeedbackPhotoPreview(null);
      } else {
        const error = await response.json();
        alert(`Failed to submit feedback: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const handleDownloadCase = (caseItem: Case) => {
    // Create PDF document
    const doc = new jsPDF();
    
    // Set font sizes and styles
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CALL CARD SUMMARY', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    // Call Card Number (Large and prominent)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Call Card Number: ${caseItem.case_number}`, margin, yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Call Date: ${caseItem.call_date ? new Date(caseItem.call_date).toLocaleString() : 'N/A'}`, margin, yPos);
    yPos += 12;
    
    // Section: LOCATION INFORMATION
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('LOCATION INFORMATION', margin, yPos);
    yPos += 6;
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Location: ${caseItem.location || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`City: ${caseItem.city || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`State: ${caseItem.state || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`Postcode: ${caseItem.postcode || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`Phone Number: ${caseItem.phone_number || 'N/A'}`, margin, yPos);
    yPos += 10;
    
    // Section: DISPATCHER INFORMATION
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DISPATCHER INFORMATION', margin, yPos);
    yPos += 6;
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${caseItem.dispatcher_name || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`ID: ${caseItem.dispatcher_id || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`Unit: ${caseItem.dispatcher_location || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`City: ${caseItem.dispatcher_city || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`State: ${caseItem.dispatcher_state || 'N/A'}`, margin, yPos);
    yPos += 10;
    
    // Section: CASE DETAILS
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CASE DETAILS', margin, yPos);
    yPos += 6;
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Resource ID: ${caseItem.resource_id || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`Ambulance: ${caseItem.ambulance || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`Status: ${caseItem.status || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`Priority: ${caseItem.dispatch_priority || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`Duration: ${formatDuration(caseItem.case_duration)}`, margin, yPos);
    yPos += 5;
    doc.text(`Number of Hurt/Sick: ${caseItem.num_hurt || 'N/A'}`, margin, yPos);
    yPos += 10;
    
    // Section: FEEDBACK
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('FEEDBACK', margin, yPos);
    yPos += 6;
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const feedbackText = caseItem.feedback || 'No feedback provided';
    const splitFeedback = doc.splitTextToSize(feedbackText, pageWidth - 2 * margin);
    doc.text(splitFeedback, margin, yPos);
    yPos += splitFeedback.length * 5 + 10;
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
    
    // Save the PDF
    doc.save(`call-card-${caseItem.case_number}.pdf`);
  };

  const handleDeleteCase = async (caseItem: Case) => {
    setCaseToDelete(caseItem);
    setShowDeleteConfirmCase(true);
  };

  const confirmDeleteCase = async () => {
    if (!caseToDelete) return;
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login again');
        return;
      }

      // First, move to trash
      const trashResponse = await fetch('http://127.0.0.1:8001/api/v1/feedback/trash/move-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          case_id: caseToDelete.id,
          case_data: caseToDelete
        })
      });

      if (!trashResponse.ok) {
        alert('Failed to move case to trash');
        return;
      }

      // Then delete the case
      const response = await fetch(`http://127.0.0.1:8001/api/v1/cases/${caseToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Remove from local state
        setCases(cases.filter(c => c.id !== caseToDelete.id));
        if (selectedCase?.id === caseToDelete.id) {
          setSelectedCase(null);
        }
        setShowDeleteConfirmCase(false);
        setCaseToDelete(null);
        
        // Refresh analytics charts to reflect the deleted case
        fetchPieAnalytics();
        fetchLineAnalytics();
      }
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  };

  const handleBulkDelete = () => {
    if (selectedCasesForDelete.length === 0) {
      alert('No cases selected. Please check the boxes next to cases you want to delete.');
      return;
    }
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login again');
        return;
      }

      // Move all selected cases to trash first
      const casesToDelete = cases.filter(c => selectedCasesForDelete.includes(c.id));
      
      for (const caseItem of casesToDelete) {
        await fetch('http://127.0.0.1:8001/api/v1/feedback/trash/move-case', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            case_id: caseItem.id,
            case_data: caseItem
          })
        });
      }

      // Then delete all selected cases
      await Promise.all(
        selectedCasesForDelete.map(caseId =>
          fetch(`http://127.0.0.1:8001/api/v1/cases/${caseId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        )
      );
      
      // Remove from local state
      setCases(cases.filter(c => !selectedCasesForDelete.includes(c.id)));
      if (selectedCase && selectedCasesForDelete.includes(selectedCase.id)) {
        setSelectedCase(null);
      }
      setSelectedCasesForDelete([]);
      setShowBulkDeleteConfirm(false);
      
      // Refresh analytics
      fetchPieAnalytics();
      fetchLineAnalytics();
    } catch (error) {
      console.error('Error deleting cases:', error);
    }
  };

  const toggleCaseSelection = (caseId: number) => {
    setSelectedCasesForDelete(prev => {
      if (prev.includes(caseId)) {
        return prev.filter(id => id !== caseId);
      } else {
        return [...prev, caseId];
      }
    });
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
      // Get Monday of current week
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      const monday = new Date(today.setDate(diff));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return `${formatDate(monday)} - ${formatDate(sunday)}`;
    } else {
      // Monthly
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    }
  };

  const getFilteredCases = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return cases.filter(caseItem => {
      const caseDate = new Date(caseItem.call_date || caseItem.created_at);
      caseDate.setHours(0, 0, 0, 0);

      if (dateFilter === 'daily') {
        return caseDate.getTime() === today.getTime();
      } else if (dateFilter === 'weekly') {
        // Get Monday of current week
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
        // Monthly
        return caseDate.getMonth() === today.getMonth() && 
               caseDate.getFullYear() === today.getFullYear();
      }
    });
  };
  
  useEffect(() => {
    // Check for next incident every 30 seconds
    const interval = setInterval(() => {
      // Simulated check for next incident
      const hasNewIncident = Math.random() > 0.7; // 30% chance of new incident
      if (hasNewIncident) {
        setNextIncident(Math.floor(Math.random() * 1000000));
        setIsWaiting(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleConfirm = () => {
    const trimmedNumber = caseNumber.trim();
    if (trimmedNumber) {
      if (trimmedNumber.length !== 9 || !/^\d+$/.test(trimmedNumber)) {
        setShowInvalidCaseNumber(true);
      } else {
        setShowConfirmation(true);
      }
    }
  };

  const handleYes = () => {
    window.location.href = `/entry?case=${encodeURIComponent(caseNumber)}`;
  };

  const handleNo = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation Bar */}
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
                  className="text-[#1D9BF0] hover:text-[#1D9BF0] transition font-medium text-lg"
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
                      setShowProfileSettings(true);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white text-gray-700 font-medium transition flex items-center gap-3 border-b border-gray-100"
                  >
                    <span className="text-xl"></span>
                    <span>Profile Settings</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoffConfirmation(true);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white text-gray-700 font-medium transition flex items-center gap-3"
                  >
                    <span className="text-xl"></span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 min-h-screen flex flex-col">
        {/* Menu Bar */}
        <div className="bg-[#C0C0C0] border-b border-gray-400 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-6 text-black text-sm font-medium">
              {/* File Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowFileMenu(!showFileMenu);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                    setShowHelpMenu(false);
                  }}
                >
                  File
                </button>
                
                {showFileMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setCaseNumber('');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>New case</span>
                      <span className="text-xs">Ctrl+N</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowSearchIncident(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Open case...</span>
                      <span className="text-xs">Ctrl+O</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowAbortReason(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Close case</span>
                      <span className="text-xs">Ctrl+F4</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Caller hangup
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black">
                      <span>Hold case</span>
                      <span className="text-xs">Ctrl+H</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowPickupCase(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Pick-up case...</span>
                      <span className="text-xs">Ctrl+P</span>
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowChangeCaseNumber(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Change case number...</span>
                      <span className="text-xs">Ctrl+G</span>
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowPrintCase(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Print case...</span>
                      <span className="text-xs">Ctrl+P</span>
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowLogoffConfirmation(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Exit
                    </button>
                  </div>
                )}
              </div>

              {/* View Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowViewMenu(!showViewMenu);
                    setShowFileMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                    setShowHelpMenu(false);
                  }}
                >
                  View
                </button>
                
                {showViewMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                    <button 
                      onClick={() => setHintsEnabled(!hintsEnabled)}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex items-center gap-2 text-black"
                    >
                      <span className="w-4">{hintsEnabled ? 'X' : ''}</span>
                      <span>Hints</span>
                    </button>
                    <button 
                      onClick={() => setSortChiefComplaints(!sortChiefComplaints)}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex items-center gap-2 text-black"
                    >
                      <span className="w-4">{sortChiefComplaints ? 'X' : ''}</span>
                      <span>Sort Chief Complaints</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Spec Log Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowSpecLogMenu(!showSpecLogMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                    setShowHelpMenu(false);
                  }}
                >
                  Spec Log
                </button>
                
                {showSpecLogMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                    <button 
                      onClick={() => {
                        setShowSpecLogMenu(false);
                        setShowLogComments(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Log comments</span>
                      <span className="text-xs">Ctrl+L</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowSpecLogMenu(false);
                        setShowHazmatInfo(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>HAZMAT Info</span>
                      <span className="text-xs">Shift+Ctrl+H</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowSpecLogMenu(false);
                        setShowUrgentMessage(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Urgent Message
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button 
                      onClick={() => {
                        setShowSpecLogMenu(false);
                        setShowCBRN(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      CBRN
                    </button>
                    <button 
                      onClick={() => {
                        setShowSpecLogMenu(false);
                        setShowSARS(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      SARS
                    </button>
                  </div>
                )}
              </div>

              {/* Options Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowOptionsMenu(!showOptionsMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                    setShowHelpMenu(false);
                  }}
                >
                  Options
                </button>
                
                {showOptionsMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                    <button 
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowLogoffConfirmation(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Logout operator
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Go to protocol...
                    </button>
                    <button 
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowSpecificPAI(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Go to specific PAI...
                    </button>
                  </div>
                )}
              </div>

              {/* Go to language Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    if (!showLanguageMenu) {
                      // When opening the menu, set temporary values to current values
                      setTempOperatorLanguage(selectedOperatorLanguage);
                      setTempCallerLanguage(selectedCallerLanguage);
                    }
                    setShowLanguageMenu(!showLanguageMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowTabsMenu(false);
                    setShowHelpMenu(false);
                  }}
                >
                  Go to language
                </button>
                
                {showLanguageMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[300px]">
                    <div className="p-4">
                      <div className="mb-4">
                        <label className="block text-black text-sm mb-2">Operator text:</label>
                        <select 
                          value={tempOperatorLanguage}
                          onChange={(e) => setTempOperatorLanguage(e.target.value)}
                          className="w-full bg-white border border-gray-400 p-2 text-black"
                        >
                          <option value="ENGLISH">ENGLISH</option>
                          <option value="CHINESE">CHINESE</option>
                          <option value="MALAY">MALAY</option>
                          <option value="SPANISH">SPANISH</option>
                          <option value="FRENCH">FRENCH</option>
                          <option value="INDONESIAN">INDONESIAN</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-black text-sm mb-2">Caller text:</label>
                        <select 
                          value={tempCallerLanguage}
                          onChange={(e) => setTempCallerLanguage(e.target.value)}
                          className="w-full bg-white border border-gray-400 p-2 text-black"
                        >
                          <option value="ENGLISH">ENGLISH</option>
                          <option value="CHINESE">CHINESE</option>
                          <option value="MALAY">MALAY</option>
                          <option value="SPANISH">SPANISH</option>
                          <option value="FRENCH">FRENCH</option>
                          <option value="INDONESIAN">INDONESIAN</option>
                        </select>
                      </div>
                      <div className="flex justify-center">
                        <button 
                          onClick={() => {
                            setShowLanguageMenu(false);
                            setShowLanguageApplyConfirm(true);
                          }}
                          className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowTabsMenu(!showTabsMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowHelpMenu(false);
                  }}
                >
                  Tabs
                </button>
                
                {showTabsMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[250px]">
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Case Entry
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Key Questions
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Post Dispatch Instructions
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Dispatch Life Support
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Case Summary
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black">
                      <span>Next tab</span>
                      <span className="text-xs">F6</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black">
                      <span>Prior tab</span>
                      <span className="text-xs">Shift+F6</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black">
                      <span>Additional Information</span>
                      <span className="text-xs">Ctrl+I</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Help Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowHelpMenu(!showHelpMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                  }}
                >
                  Help
                </button>
                
                {showHelpMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                    <button 
                      onClick={() => {
                        setShowHelpMenu(false);
                        setShowVersionInfo(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Version
                    </button>
                    <button 
                      onClick={() => {
                        setShowHelpMenu(false);
                        setShowAboutDialog(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      About DISPATCHUMS
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#C0C0C0] border-b border-gray-500">
          <div className="max-w-7xl mx-auto">
            <div className="flex w-full">
              <button className="flex-1 py-2 bg-white text-black font-medium border-r border-gray-500">
                Entry
              </button>
              <button className="flex-1 py-2 text-black hover:bg-gray-300 transition border-r border-gray-500">
                KQ
              </button>
              <button className="flex-1 py-2 text-black hover:bg-gray-300 transition border-r border-gray-500">
                PDI/CEI
              </button>
              <button className="flex-1 py-2 text-black hover:bg-gray-300 transition border-r border-gray-500">
                DLS
              </button>
              <button className="flex-1 py-2 text-black hover:bg-gray-300 transition">
                Summary
              </button>
            </div>
          </div>
        </div>

        {/* Center Content Area - Reorganized Layout */}
        <div className="flex-1 flex flex-col bg-[#0A0A0A] overflow-hidden">
          {/* Charts Section - Above the two columns */}
          <div className="flex border-b border-gray-600" style={{ height: '40%' }}>
            {/* Left Chart: Pie Chart - Case Distribution */}
            <div className="w-1/2 border-r border-gray-600 p-4 bg-[#1A1A1A] flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white text-lg font-bold">Case Distribution</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPieChartPeriod('weekly')}
                    className={`px-3 py-1 text-sm ${
                      pieChartPeriod === 'weekly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    } rounded`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setPieChartPeriod('monthly')}
                    className={`px-3 py-1 text-sm ${
                      pieChartPeriod === 'monthly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    } rounded`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-[200px] relative">
                {pieAnalyticsData && pieAnalyticsData.status_counts && Object.keys(pieAnalyticsData.status_counts).length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(pieAnalyticsData.status_counts).map(([name, value]) => ({
                            name: name.charAt(0).toUpperCase() + name.slice(1),
                            value: value
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent, value }) => `${name}: ${value} ${value === 1 ? 'case' : 'cases'} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {Object.entries(pieAnalyticsData.status_counts).map((entry, index) => {
                            const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                          })}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#2A2A2A', border: '1px solid #666', borderRadius: '4px' }}
                          labelStyle={{ color: '#fff' }}
                          formatter={(value: any, name: any) => [
                            <span style={{ color: '#fff' }}>{value} {value === 1 ? 'case' : 'cases'}</span>,
                            <span style={{ color: '#fff' }}>{name}</span>
                          ]}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Display date range below chart */}
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      {pieChartPeriod === 'weekly' && pieAnalyticsData.time_metrics && pieAnalyticsData.time_metrics.length > 0 && (
                        <div className="text-white text-xs font-semibold">
                          {pieAnalyticsData.time_metrics[0].formatted_range || ''}
                        </div>
                      )}
                      {pieChartPeriod === 'monthly' && pieAnalyticsData.start_date && (
                        <div className="text-white text-xs font-semibold">
                          {pieAnalyticsData.formatted_month_range || ''}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-gray-500 text-6xl mb-4">📊</div>
                      <div className="text-gray-400 text-sm">No case data available</div>
                      <div className="text-gray-500 text-xs mt-1">Chart will appear here once cases are created</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Chart: Line Chart - Time Metrics */}
            <div className="w-1/2 p-4 bg-[#1A1A1A] flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white text-lg font-bold">Dispatch Time & Case Time</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLineChartPeriod('weekly')}
                    className={`px-3 py-1 text-sm ${
                      lineChartPeriod === 'weekly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    } rounded`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setLineChartPeriod('monthly')}
                    className={`px-3 py-1 text-sm ${
                      lineChartPeriod === 'monthly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    } rounded`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-[250px]">
                {lineAnalyticsData && lineAnalyticsData.time_metrics && lineAnalyticsData.time_metrics.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={lineAnalyticsData.time_metrics.map((item: any) => ({
                          label: item.label,
                          dispatch_time: item.dispatch_time ? Math.abs(Number((item.dispatch_time / 60).toFixed(2))) : 0,
                          case_duration: item.case_duration ? Math.abs(Number((item.case_duration / 60).toFixed(2))) : 0,
                          count: item.count
                        }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                      <XAxis 
                        dataKey="label" 
                        stroke="#FFF"
                        tick={{ fill: '#FFF', fontSize: 11 }}
                        interval={lineChartPeriod === 'weekly' ? 0 : 'preserveStartEnd'}
                        angle={lineChartPeriod === 'monthly' ? -45 : 0}
                        textAnchor={lineChartPeriod === 'monthly' ? 'end' : 'middle'}
                        height={lineChartPeriod === 'monthly' ? 80 : 30}
                      />
                      <YAxis 
                        stroke="#FFF"
                        tick={{ fill: '#FFF', fontSize: 12 }}
                        label={{ value: 'Time (minutes)', angle: -90, position: 'insideLeft', fill: '#FFF', style: { fontSize: 14 } }}
                        domain={[0, 24]}
                        ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#2A2A2A', border: '1px solid #666', borderRadius: '4px' }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                        formatter={(value: any, name: string) => {
                          const formattedValue = `${value} min`;
                          const displayName = name === 'Dispatch Time' ? 'Total Dispatch Time' : 'Total Case Time';
                          return [formattedValue, displayName];
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#fff' }}
                        iconType="line"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="dispatch_time" 
                        stroke="#0088FE" 
                        strokeWidth={3}
                        name="Dispatch Time"
                        dot={{ fill: '#0088FE', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="case_duration" 
                        stroke="#00C49F" 
                        strokeWidth={3}
                        name="Case Time"
                        dot={{ fill: '#00C49F', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-gray-500 text-6xl mb-4">📈</div>
                      <div className="text-gray-400 text-sm">No time metrics available</div>
                      <div className="text-gray-500 text-xs mt-1">Chart will show average dispatch times</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Row: Two Columns Side by Side */}
          <div className="flex border-b border-gray-600" style={{ height: '35%' }}>
            {/* Column 1: Call Card Info (Case Summary) */}
            <div className="w-1/2 border-r border-gray-600 p-4 overflow-y-auto bg-[#1A1A1A]">
              <h3 className="text-white text-lg font-bold mb-4 border-b border-gray-600 pb-2">
                {selectedCase ? `Case Number: ${selectedCase.case_number}` : 'Call Card Info'}
              </h3>
              
              {selectedCase ? (
                <div className="space-y-3">
                  {/* Call Card Info Section */}
                  <div className="border border-gray-500 bg-[#2A2A2A] p-3">
                    <h4 className="text-white font-bold mb-3 text-sm border-b border-gray-600 pb-2">
                      Call Card Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Call date:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.call_date ? new Date(selectedCase.call_date).toLocaleString() : 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Location:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.location || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Postcode:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.postcode || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">City:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.city || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">State:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.state || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Phone number:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.phone_number || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Number of hurt / sick:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.num_hurt || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dispatcher Info Section */}
                  <div className="border border-gray-500 bg-[#2A2A2A] p-3">
                    <h4 className="text-white font-bold mb-3 text-sm border-b border-gray-600 pb-2">
                      Dispatcher Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Name:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.dispatcher_name || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">ID:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.dispatcher_id || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Unit:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.dispatcher_location || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Address:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.dispatcher_location || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">City:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.dispatcher_city || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">State:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.dispatcher_state || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Postcode:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          {selectedCase.dispatcher_postcode || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Phone number:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-white flex-1">
                          N/A
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Call Card Info Section - Empty */}
                  <div className="border border-gray-500 bg-[#2A2A2A] p-3">
                    <h4 className="text-white font-bold mb-3 text-sm border-b border-gray-600 pb-2">
                      Call Card Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Call date:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Location:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Postcode:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">City:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">State:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Phone number:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Number of hurt / sick:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dispatcher Info Section - Empty */}
                  <div className="border border-gray-500 bg-[#2A2A2A] p-3">
                    <h4 className="text-white font-bold mb-3 text-sm border-b border-gray-600 pb-2">
                      Dispatcher Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Name:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">ID:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Unit:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Address:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">City:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">State:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Postcode:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 whitespace-nowrap">Phone number:</span>
                        <div className="bg-[#1A1A1A] p-2 rounded text-gray-600 flex-1">
                          --
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Call Card Display */}
            <div className="w-1/2 p-4 overflow-y-auto bg-[#1A1A1A]">
              <h3 className="text-white text-lg font-bold mb-4 border-b border-gray-600 pb-2">
                Call Card Display
              </h3>
              {selectedCase ? (
                <div className="space-y-3 text-xs">
                  {/* Case Entry Information */}
                  <div className="bg-[#2A2A2A] p-3 rounded border border-gray-500">
                    <h4 className="text-sm font-bold mb-3 text-white border-b border-gray-600 pb-2">Case Entry Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-white">
                      <div className="space-y-2">
                        <div><strong>Case Number:</strong> {selectedCase.case_number}</div>
                        <div><strong>Date/Time:</strong> {selectedCase.call_date ? new Date(selectedCase.call_date).toLocaleString() : 'N/A'}</div>
                        <div><strong>Location:</strong> {selectedCase.location || 'Not specified'}</div>
                        <div><strong>Phone Number:</strong> {selectedCase.phone_number || 'Not specified'}</div>
                      </div>
                      <div className="space-y-2">
                        <div><strong>City:</strong> {selectedCase.city || 'Not specified'}</div>
                        <div><strong>State:</strong> {selectedCase.state || 'Not specified'}</div>
                        <div><strong>Postcode:</strong> {selectedCase.postcode || 'Not specified'}</div>
                        <div><strong>Status:</strong> {selectedCase.status || 'Not specified'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Dispatcher Information */}
                  <div className="bg-[#2A2A2A] p-3 rounded border border-gray-500">
                    <h4 className="text-sm font-bold mb-3 text-white border-b border-gray-600 pb-2">Dispatcher Information</h4>
                    <div className="grid grid-cols-3 gap-3 text-white">
                      <div><strong>Name:</strong> {selectedCase.dispatcher_name || 'N/A'}</div>
                      <div><strong>ID:</strong> {selectedCase.dispatcher_id || 'N/A'}</div>
                      <div><strong>Unit:</strong> {selectedCase.dispatcher_location || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Key Questions Answers */}
                  <div className="bg-[#2A2A2A] p-3 rounded border border-gray-500">
                    <h4 className="text-sm font-bold mb-3 text-red-400 border-b border-gray-600 pb-2">Key Questions - Protocol 6 (Breathing Problems)</h4>
                    <div className="space-y-2 text-white">
                      <div className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span><strong>Q1: Patient alert status</strong> - <span className="font-bold text-red-400">Yes</span></span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span><strong>Q2: Difficulty speaking</strong> - <span className="font-bold text-red-400">No</span></span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span><strong>Q3: Changing color</strong> - <span className="font-bold text-red-400">No</span></span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span><strong>Q4: Clammy/cold sweats</strong> - <span className="font-bold">No</span></span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span><strong>Q5: Asthma/lung problems</strong> - <span className="font-bold">Yes</span></span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span><strong>Q6: Special equipment</strong> - <span className="font-bold">No</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Summary */}
                  <div className="bg-[#2A2A2A] p-3 rounded border border-gray-500">
                    <h4 className="text-sm font-bold mb-3 text-white border-b border-gray-600 pb-2">Timeline Summary</h4>
                    <div className="space-y-3">
                      {(() => {
                        let timeline = [];
                        let metrics = { totalTime: 0, timeToDispatch: 0 };
                        
                        // Try to parse case_summary for timeline and metrics
                        if (selectedCase.case_summary) {
                          try {
                            const summary = typeof selectedCase.case_summary === 'string' 
                              ? JSON.parse(selectedCase.case_summary)
                              : selectedCase.case_summary;
                            
                            if (summary.timeline) timeline = summary.timeline;
                            if (summary.metrics) metrics = summary.metrics;
                          } catch (e) {
                            console.error('Error parsing case_summary:', e);
                          }
                        }
                        
                        // Fallback to calculated timestamps if no timeline in summary
                        if (timeline.length === 0 && selectedCase.call_date) {
                          const startTime = new Date(selectedCase.call_date);
                          timeline = [
                            { phase: 'Case Entry Started', time: startTime.toISOString(), status: 'Completed' },
                            { phase: 'Key Questions Completed', time: new Date(startTime.getTime() + 120000).toISOString(), status: 'Completed' },
                            { phase: 'DISPATCH DETERMINATION', time: selectedCase.dispatch_time || new Date(startTime.getTime() + 180000).toISOString(), status: 'Completed' },
                            { phase: 'CASE COMPLETED', time: new Date(startTime.getTime() + (selectedCase.case_duration * 1000 || 600000)).toISOString(), status: 'Completed' }
                          ];
                        }
                        
                        // Calculate duration from case start for each phase
                        const startTime = timeline.length > 0 ? new Date(timeline[0].time) : new Date();
                        
                        return timeline.map((item: any, index: number) => {
                          const timeColor = index === 0 ? 'text-white' : index === timeline.length - 1 ? 'text-green-400' : 'text-red-400';
                          const textColor = index === 0 ? 'text-white' : index === timeline.length - 1 ? 'text-green-400' : 'text-red-400';
                          
                          // Calculate duration from start (in seconds)
                          const itemTime = new Date(item.time);
                          const durationSeconds = Math.floor((itemTime.getTime() - startTime.getTime()) / 1000);
                          const minutes = Math.floor(durationSeconds / 60);
                          const seconds = durationSeconds % 60;
                          const durationDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                          
                          return (
                            <div key={index} className={`flex items-start gap-3 ${index < timeline.length - 1 ? 'pb-2 border-b border-gray-700' : ''}`}>
                              <div className={`text-lg font-mono font-bold ${timeColor}`}>
                                {durationDisplay}
                              </div>
                              <div className="flex-1">
                                <div className={`font-bold ${textColor}`}>{item.phase}</div>
                                {index === 1 && <div className="text-xs text-gray-400">Protocol 6 - Breathing Problems</div>}
                                {index === 2 && <div className="text-xs text-gray-400">Priority: {selectedCase.dispatch_priority || 'Standard'}</div>}
                                {index === 3 && <div className="text-xs text-gray-400">All protocols completed successfully</div>}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="bg-[#2A2A2A] p-3 rounded border border-gray-500">
                    <h4 className="text-sm font-bold mb-3 text-white border-b border-gray-600 pb-2">Key Metrics</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-xl font-bold text-blue-400">{formatDuration(selectedCase.case_duration)}</div>
                        <div className="text-xs text-gray-400">Total Case Time</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-400">{formatDuration(selectedCase.time_to_dispatch)}</div>
                        <div className="text-xs text-gray-400">Time to Dispatch</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-400">{selectedCase.ambulance ? selectedCase.ambulance.split(',').length : 0}</div>
                        <div className="text-xs text-gray-400">Units Dispatched</div>
                      </div>
                    </div>
                  </div>

                  {/* Resource Information */}
                  <div className="bg-[#2A2A2A] p-3 rounded border border-gray-500">
                    <h4 className="text-sm font-bold mb-3 text-white border-b border-gray-600 pb-2">Resource Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-white">
                      <div><strong>Resource ID:</strong> {selectedCase.resource_id || 'N/A'}</div>
                      <div><strong>Ambulance:</strong> {selectedCase.ambulance || 'N/A'}</div>
                      <div><strong>Priority:</strong> {selectedCase.dispatch_priority || 'N/A'}</div>
                      <div><strong>Number of Hurt/Sick:</strong> {selectedCase.num_hurt || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center mt-8">
                  No case selected
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: List of Calls (Full Width) */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#1A1A1A]">
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
                    Total: {getFilteredCases().length} {getFilteredCases().length === 1 ? 'call' : 'calls'}
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition font-medium"
                  >
                    🗑️ Delete {selectedCasesForDelete.length > 0 && `(${selectedCasesForDelete.length})`}
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  // Generate case number based on current date/time
                  const now = new Date();
                  const year = now.getFullYear();
                  const month = String(now.getMonth() + 1).padStart(2, '0');
                  const day = String(now.getDate()).padStart(2, '0');
                  const hour = String(now.getHours()).padStart(2, '0');
                  const min = String(now.getMinutes()).padStart(2, '0');
                  const autoCase = `${year}${month}${day}${hour}${min}`;
                  
                  // Redirect to entry page with auto-assigned case number
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
                <div className="grid grid-cols-9 gap-1 text-xs font-bold text-white bg-[#2A2A2A] p-2 rounded">
                  <div className="flex items-center justify-center">✓</div>
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
                {getFilteredCases().map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className={`grid grid-cols-9 gap-1 text-xs text-white p-2 rounded transition ${
                      selectedCase?.id === caseItem.id ? 'bg-[#0066CC]' : 'bg-[#2A2A2A] hover:bg-[#3A3A3A]'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedCasesForDelete.includes(caseItem.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleCaseSelection(caseItem.id);
                        }}
                        className="w-4 h-4 cursor-pointer accent-red-500"
                      />
                    </div>
                    <div className="truncate cursor-pointer" onClick={() => handleCaseClick(caseItem)}>{caseItem.case_number}</div>
                    <div className="truncate cursor-pointer" onClick={() => handleCaseClick(caseItem)} title={caseItem.location}>{caseItem.location}</div>
                    <div className="truncate cursor-pointer" onClick={() => handleCaseClick(caseItem)}>{caseItem.resource_id || '00001'}</div>
                    <div className="truncate cursor-pointer" onClick={() => handleCaseClick(caseItem)}>{caseItem.ambulance || 'N/A'}</div>
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleCaseClick(caseItem)}>
                      <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(caseItem.status)}`}></span>
                      <span className="truncate">{caseItem.status}</span>
                    </div>
                    <div className="truncate cursor-pointer" onClick={() => handleCaseClick(caseItem)}>{formatDuration(caseItem.case_duration)}</div>
                    <div>
                      {caseItem.status?.toLowerCase() === 'incomplete' ? (
                        <button 
                          className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition font-medium"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const response = await fetch(`http://127.0.0.1:8001/api/v1/cases/${caseItem.id}/continue`, {
                                method: 'POST',
                              });
                              if (response.ok) {
                                // Redirect to entry page with case number
                                window.location.href = `/entry?case=${caseItem.case_number}`;
                              }
                            } catch (error) {
                              console.error('Error continuing case:', error);
                            }
                          }}
                          title="Continue Case"
                        >
                          ▶️ Continue
                        </button>
                      ) : (
                        <button 
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFeedbackCaseNumber(caseItem.case_number);
                            setShowFeedbackDialog(true);
                          }}
                          title="Give Feedback"
                        >
                          📝
                        </button>
                      )}
                    </div>
                    <div>
                      <button 
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadCase(caseItem);
                        }}
                        title="Download Call Card"
                      >
                        📥
                      </button>
                    </div>
                  </div>
                ))}
                
                {getFilteredCases().length === 0 && !loading && (
                  <div className="text-gray-400 text-center mt-8 p-4">
                    No cases found for this time period.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="bg-[#27272A] border-t border-[#27272A] flex mt-auto">
          <div className="w-full p-3 text-center">
            <div className="text-sm text-gray-400">
              © 2025 DISPATCHUMS Corporation. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* ALL DIALOGS BELOW */}

      {/* Invalid Case Number Modal */}
{showInvalidCaseNumber && (
  <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
      <h3 className="text-xl font-semibold text-black mb-4">Case Number Invalid</h3>
      
      {/* Note with blinking icon and red text */}
            <div className="flex items-center mb-4">
              <span className="animate-pulse text-red-500 mr-2 text-lg">⚠️</span>
              <p className="text-red-500 font-medium">
                Note: 9 digits case number format (year-month-case number)
              </p>
            </div>
            
            {/* Confirmation question */}
            <p className="text-gray-700 mb-6">
              Confirm & continue to create new case with auto assign case number?
            </p>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowInvalidCaseNumber(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const generatedNumber = generateCaseNumber();
                  setCaseNumber(generatedNumber);
                  window.location.href = `/entry?case=${encodeURIComponent(generatedNumber)}`;
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Confirm Case Number</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to proceed with case number: <strong>{caseNumber}</strong>?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleNo}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                onClick={handleYes}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Comments Dialog */}
      {showLogComments && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Comment</span>
              <button onClick={() => setShowLogComments(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <label className="block text-black text-sm mb-2">Reason:</label>
              <textarea
                className="w-full px-4 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC] mb-4"
                rows={6}
                maxLength={60}
                placeholder="Type your comment here (max 60 characters)..."
              />
              <p className="text-xs text-gray-600 mb-4">
                The text field will accept up to 60 alphanumeric characters.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowLogComments(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
                <button 
                  onClick={() => setShowLogComments(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Urgent Message Dialog */}
      {showUrgentMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Urgent Message</span>
              <button onClick={() => setShowUrgentMessage(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <label className="block text-black text-sm mb-2">Reason:</label>
              <textarea
                className="w-full px-4 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC] mb-4"
                rows={6}
                maxLength={60}
                placeholder="Type your urgent message here (max 60 characters)..."
              />
              <p className="text-xs text-gray-600 mb-2">
                The text field will accept up to 60 alphanumeric characters.
              </p>
              <p className="text-xs text-red-600 mb-4">
                This feature may not be supported by all CAD systems. Check with your CAD vendor before using it.
              </p>
              <div className="flex gap-3 justify-end">
                <DialogButton onClick={() => setShowUrgentMessage(false)}>
                  Cancel
                </DialogButton>
                <DialogButton onClick={() => setShowUrgentMessage(false)} variant="primary">
                  OK
                </DialogButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HAZMAT Info Dialog */}
      {showHazmatInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[550px] max-h-[90vh] overflow-y-auto">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Essential HAZMAT Information</span>
              <button onClick={() => setShowHazmatInfo(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-4 bg-white">
              <div className="flex justify-between mb-3">
                <button 
                  onClick={() => setShowHazmatInfo(false)}
                  className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2 text-sm"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
                <button className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2 text-sm">
                  <span className="text-green-600">Info Completed ✓</span>
                </button>
              </div>
              <div className="space-y-2">
                {[
                  '1. Name/Phone:',
                  '2. Location/Source/Nature:',
                  '3. Dead/Injured:',
                  '4. Chemical name:',
                  '5. Container description:',
                  '6. Amount released:',
                  '7. Type of release:',
                  '8. Time of release:',
                  '9. Total amount:',
                  '10. Present state:',
                  '11. Significant amounts?:',
                  '12. Direction of vapors/fumes:',
                  '13. Weather conditions:',
                  '14. Local terrain:'
                ].map((label, idx) => (
                  <div key={idx}>
                    <label className="block text-black text-xs mb-0.5">{label}</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC] text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CBRN Dialog */}
      {showCBRN && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>CBRN Surveillance</span>
              <button onClick={() => setShowCBRN(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-4 bg-[#C0C0C0]">
              <div className="flex justify-between mb-4">
                <button 
                  onClick={() => setShowCBRN(false)}
                  className="px-4 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
                <button className="px-4 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2">
                  <span className="text-green-600">Info Completed ✓</span>
                </button>
              </div>
              
              <p className="text-blue-700 text-sm mb-3">
                Listen carefully and tell me if s/he has any of the following symptoms:
              </p>
              
              <div className="space-y-1 text-sm text-black">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>a rash</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>diarrhea</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>low back pain</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>has or had a fever (clearly hot to touch)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>weakness</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>double vision</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>difficulty swallowing</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>drooling</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>pinpoint pupils</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>excessive nasal discharge</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>a bloody discharge</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>pox or pustules</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>blistered skin</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>peeling skin</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>vomiting</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SARS Dialog */}
      {showSARS && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>SARS Symptoms</span>
              <button onClick={() => setShowSARS(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-4 bg-[#C0C0C0]">
              <div className="flex justify-between mb-4">
                <button 
                  onClick={() => setShowSARS(false)}
                  className="px-4 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
                <button className="px-4 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2">
                  <span className="text-green-600">Info Completed ✓</span>
                </button>
              </div>
              
              <p className="text-blue-700 text-sm mb-3">
                Listen carefully and tell me if s/he has any of the following symptoms:
              </p>
              
              <div className="space-y-1 text-sm text-black">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>difficulty breathing or shortness of breath</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>a persistent cough</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>diarrhea</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>a rash</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>contact with a known or suspected SARS-infected patient</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>has or had a fever (clearly hot to touch)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to or from China</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to or from Hong Kong</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to or from Vietnam</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to or from Toronto</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to or from Singapore</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to anywhere else in Asia</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Open Case Dialog - Search for Incident Number */}
      {showSearchIncident && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[700px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Search for Incident Number</span>
              <button onClick={() => setShowSearchIncident(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-4 bg-white">
              <div className="bg-[#D3D3D3] border border-gray-400 mb-3">
                <div className="flex">
                  <button className="px-4 py-2 bg-white border-b-2 border-white text-black font-semibold">
                    Incidents
                  </button>
                  <button className="px-4 py-2 bg-[#C0C0C0] text-black">
                    Display criteria
                  </button>
                </div>
              </div>
              
              <div className="border-2 border-gray-400 bg-white">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#C0C0C0]">
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Incident #</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Operator ID</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Date/Time</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Address</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">CC#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { incident: '0002000002', operator: '5555', datetime: '7/11/2002 14:15:20', address: '12 Willard', cc: '10' },
                      { incident: '0002000003', operator: '5555', datetime: '7/11/2002 14:17:50', address: '15 Conco', cc: '28' },
                      { incident: '0002000004', operator: '5555', datetime: '7/11/2002 14:18:53', address: '13 Marion', cc: '13' },
                      { incident: '0002000005', operator: '2222', datetime: '7/12/2002 07:37:53', address: '12 Freddc', cc: '9' },
                      { incident: '0002000014', operator: '7777', datetime: '7/12/2002 08:42:06', address: 'intersectic', cc: '29' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-500 hover:text-white cursor-pointer">
                        <td className="border border-gray-400 px-2 py-1 text-black hover:text-white">{row.incident}</td>
                        <td className="border border-gray-400 px-2 py-1 text-black hover:text-white">{row.operator}</td>
                        <td className="border border-gray-400 px-2 py-1 text-black hover:text-white">{row.datetime}</td>
                        <td className="border border-gray-400 px-2 py-1 text-black hover:text-white">{row.address}</td>
                        <td className="border border-gray-400 px-2 py-1 text-black hover:text-white">{row.cc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex gap-3 justify-center mt-4">
                <button 
                  onClick={() => setShowSearchIncident(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
                <button 
                  onClick={() => setShowSearchIncident(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Case Dialog - Abort reason */}
      {showAbortReason && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Abort reason...</span>
              <button onClick={() => setShowAbortReason(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <input
                type="text"
                className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC] mb-3"
                placeholder="Enter description..."
              />
              
              <select className="w-full bg-white border-2 border-gray-400 p-2 text-black mb-3 focus:outline-none focus:border-[#0066CC]" size={6}>
                <option>1. Test call</option>
                <option>2. Bug report</option>
                <option>3. Duplicate Incident</option>
                <option>4. Caller Refused Service</option>
                <option>5. Entered in Error</option>
              </select>
              
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowAbortConfirm(true)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
                <button 
                  onClick={() => setShowAbortReason(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Abort Confirmation Dialog */}
      {showAbortConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Confirm Abort Case</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to abort this case?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowAbortConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAbortConfirm(false);
                  setShowAbortReason(false);
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes, Abort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pick-up Case Dialog */}
      {showPickupCase && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[700px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Pick-up case...</span>
              <button onClick={() => {
                setShowPickupCase(false);
                setSelectedPickupCase(null);
              }} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-4 bg-white">
              <div className="border-2 border-gray-400 bg-white mb-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#C0C0C0]">
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold w-8"></th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Operator ID</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Code</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Address</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Start Time</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Incident #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, operator: 'SUPERVISOR', code: '68-D-2', address: '163 E. South Temple', time: '14:26', incident: '0004000002' },
                      { id: 2, operator: 'SUPERVISOR', code: '52-C-3P', address: '15 Concord Blvd.', time: '14:27', incident: '0004000003' }
                    ].map((row) => (
                      <tr 
                        key={row.id}
                        onClick={() => setSelectedPickupCase(row.id)}
                        className={`cursor-pointer ${selectedPickupCase === row.id ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}
                      >
                        <td className="border border-gray-400 px-2 py-1 text-center">
                          <input 
                            type="radio" 
                            checked={selectedPickupCase === row.id}
                            onChange={() => setSelectedPickupCase(row.id)}
                            className="w-3 h-3"
                          />
                        </td>
                        <td className={`border border-gray-400 px-2 py-1 ${selectedPickupCase === row.id ? 'text-white' : 'text-black'}`}>{row.operator}</td>
                        <td className={`border border-gray-400 px-2 py-1 ${selectedPickupCase === row.id ? 'text-white' : 'text-black'}`}>{row.code}</td>
                        <td className={`border border-gray-400 px-2 py-1 ${selectedPickupCase === row.id ? 'text-white' : 'text-black'}`}>{row.address}</td>
                        <td className={`border border-gray-400 px-2 py-1 ${selectedPickupCase === row.id ? 'text-white' : 'text-black'}`}>{row.time}</td>
                        <td className={`border border-gray-400 px-2 py-1 ${selectedPickupCase === row.id ? 'text-white' : 'text-black'}`}>{row.incident}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-center text-black text-sm mb-4">
                Pick-up case: 1 (of 2)
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => {
                    if (selectedPickupCase) {
                      setShowPickupConfirm(true);
                    }
                  }}
                  disabled={!selectedPickupCase}
                  className={`px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2 ${!selectedPickupCase ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
                <button 
                  onClick={() => {
                    setShowPickupCase(false);
                    setSelectedPickupCase(null);
                  }}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pick-up Confirmation Dialog */}
      {showPickupConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Confirm Pick-up Case</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to pick up this case?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowPickupConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPickupConfirm(false);
                  setShowPickupCase(false);
                  setSelectedPickupCase(null);
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes, Pick Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Case Number Dialog */}
      {showChangeCaseNumber && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[450px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Change case number...</span>
              <button onClick={() => setShowChangeCaseNumber(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-[#C0C0C0]">
              <div className="flex items-center gap-3 mb-4">
                <label className="text-black text-sm whitespace-nowrap">Case number:</label>
                <input
                  type="text"
                  defaultValue={caseNumber || ''}
                  className="flex-1 px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                />
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setShowChangeCaseNumber(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
                <button 
                  onClick={() => setShowChangeCaseNumber(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Case Dialog */}
      {showPrintCase && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[400px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Print Case Summary</span>
              <button onClick={() => setShowPrintCase(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-[#C0C0C0]">
              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Case information</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Four commandments</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Dispatch information</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Responder script</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Time stamps</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Running times</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Key Question Answers</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Case sequences</span>
                </label>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setShowPrintCase(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  Print
                </button>
                <button 
                  onClick={() => setShowPrintCase(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logoff Confirmation Dialog */}
      {showLogoffConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Logout Operator</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to logout and return to the login page?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowLogoffConfirmation(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoffConfirmation(false);
                  handleLogout();
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Specific PAI Target Tool Dialog */}
      {showSpecificPAI && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[700px] max-h-[600px] overflow-y-auto">
            <div className="bg-[#0066CC] text-white px-3 py-1 font-semibold flex justify-between items-center">
              <span>Specific PAI Target Tool</span>
              <button onClick={() => setShowSpecificPAI(false)} className="text-white">✕</button>
            </div>
            <div className="p-4">
              <div className="flex gap-2 mb-4 flex-wrap">
                <button className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 text-black text-sm">
                  Case Exit X-1
                </button>
                <button className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 text-black text-sm">
                  Urgent Disconnect
                </button>
                <button className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 text-black text-sm">
                  Control Bleeding
                </button>
                <button className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 text-black text-sm">
                  Arrival Interface
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div>
                  <div className="bg-[#C0C0C0] text-black px-2 py-1 text-center font-semibold border border-gray-400">
                    Adult
                  </div>
                  <div className="bg-white border border-gray-400 h-64 overflow-y-auto p-2">
                    <div className="space-y-1 text-xs text-black">
                      {[
                        { id: 'adult-a', text: 'A: Arrest / Choking (Unconscious)', hasOptions: true, options: ['1 - Check responsiveness', '2 - Position for CPR', '3 - Check pulse/breathing', '4 - Begin CPR cycles', '5 - Apply AED if available'] },
                        { id: 'adult-d', text: 'D: Choking (Conscious)', hasOptions: true, options: ['1 - Encourage coughing', '2 - Back blows (5 times)', '3 - Abdominal thrusts', '4 - Alternate back blows/thrusts', '5 - Check mouth for object'] },
                        { id: 'adult-h', text: 'H: Childbirth - Delivery', hasOptions: true, options: ['1 - Delivery preparation', '2 - Support baby\'s head', '3 - Check for cord around neck', '4 - Deliver shoulders', '5 - Postpartum care'] },
                        { id: 'adult-k', text: 'K: Stoma support - Adult', hasOptions: true, options: ['1 - Assess stoma opening', '2 - Remove secretions', '3 - Provide oxygen to stoma', '4 - Suction if needed', '5 - Position for breathing'] },
                        { id: 'adult-x', text: 'X: Exit', hasOptions: true, options: ['1 - Normal completion', '2 - Emergency exit', '3 - Transfer to ALS'] },
                        { id: 'adult-z', text: 'Z: AED support', hasOptions: true, options: ['1 - Attach AED pads', '2 - Analyze rhythm', '3 - Deliver shock if advised', '4 - Resume CPR', '5 - Reanalyze every 2 minutes'] }
                      ].map((item) => (
                        <div key={item.id}>
                          <div className="flex items-center gap-1">
                            {item.hasOptions && (
                              <button 
                                onClick={() => setExpandedPAI(prev => ({...prev, [item.id]: !prev[item.id]}))}
                                className="text-black hover:bg-gray-200 px-1"
                              >
                                {expandedPAI[item.id] ? '−' : '+'}
                              </button>
                            )}
                            <div 
                              className={`cursor-pointer hover:bg-blue-100 p-1 flex-1 ${selectedPAI.includes(item.id) ? 'bg-blue-500 text-white' : ''}`}
                              onClick={() => {
                                setSelectedPAI(prev => 
                                  prev.includes(item.id) 
                                    ? prev.filter(id => id !== item.id)
                                    : [...prev, item.id]
                                )
                              }}
                            >
                              {item.text}
                            </div>
                          </div>
                          {item.hasOptions && expandedPAI[item.id] && item.options && (
                            <div className="ml-4 space-y-0.5 text-xs">
                              {item.options.map((option, idx) => (
                                <div key={idx} className="text-black">{option}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-[#C0C0C0] text-black px-2 py-1 text-center font-semibold border border-gray-400">
                    Child
                  </div>
                  <div className="bg-white border border-gray-400 h-64 overflow-y-auto p-2">
                    <div className="space-y-1 text-xs text-black">
                      {[
                        { id: 'child-b', text: 'B: Arrest / Choking (Unconscious)', hasOptions: true, options: ['1 - Check child responsiveness', '2 - Position for pediatric CPR', '3 - Check pulse/breathing (10 sec)', '4 - Begin child CPR (15:2 ratio)', '5 - Consider AED if >1 year'] },
                        { id: 'child-d', text: 'D: Choking (Conscious)', hasOptions: true, options: ['1 - Encourage coughing', '2 - Back blows (child position)', '3 - Abdominal thrusts (modified)', '4 - Check mouth carefully', '5 - Call for advanced help'] },
                        { id: 'child-j', text: 'J: Stoma support - Child', hasOptions: true, options: ['1 - Assess pediatric stoma', '2 - Gentle suction', '3 - Humidified oxygen', '4 - Position for comfort', '5 - Monitor breathing'] },
                        { id: 'child-x', text: 'X: Exit', hasOptions: true, options: [
                          '1 - First Party Caller',
                          '2 - Routine Disconnect (Stable)', 
                          '3 - Stay on Line (unstable)',
                          '4 - Urgent Disconnect (1st Party)',
                          '5 - Control Bleeding',
                          '6 - Bleeding now Controlled',
                          '7 - Danger Present (Scene/HAZMAT)',
                          '8 - Amputation'
                        ]}
                      ].map((item) => (
                        <div key={item.id}>
                          <div className="flex items-center gap-1">
                            {item.hasOptions && (
                              <button 
                                onClick={() => setExpandedPAI(prev => ({...prev, [item.id]: !prev[item.id]}))}
                                className="text-black hover:bg-gray-200 px-1"
                              >
                                {expandedPAI[item.id] ? '−' : '+'}
                              </button>
                            )}
                            <div 
                              className={`cursor-pointer hover:bg-blue-100 p-1 flex-1 ${selectedPAI.includes(item.id) ? 'bg-blue-500 text-white' : ''}`}
                              onClick={() => {
                                setSelectedPAI(prev => 
                                  prev.includes(item.id) 
                                    ? prev.filter(id => id !== item.id)
                                    : [...prev, item.id]
                                )
                              }}
                            >
                              {item.text}
                            </div>
                          </div>
                          {item.hasOptions && expandedPAI[item.id] && item.options && (
                            <div className="ml-4 space-y-0.5 text-xs">
                              {item.options.map((option, idx) => (
                                <div key={idx} className="text-black">{option}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-[#C0C0C0] text-black px-2 py-1 text-center font-semibold border border-gray-400">
                    Infant
                  </div>
                  <div className="bg-white border border-gray-400 h-64 overflow-y-auto p-2">
                    <div className="space-y-1 text-xs text-black">
                      {[
                        { id: 'infant-a', text: 'A: Arrest / Choking (Unconscious)', hasOptions: false },
                        { id: 'infant-d', text: 'D: Choking (Conscious)', hasOptions: false },
                        { id: 'infant-f', text: 'F: Childbirth - Delivery', hasOptions: false },
                        { id: 'infant-i', text: 'I: Stoma support - Infant', hasOptions: false },
                        { id: 'infant-n', text: 'N: Arrest / Choking (Unconscious - Neonate)', hasOptions: false },
                        { id: 'infant-x', text: 'X: Exit', hasOptions: true, options: ['1 - Normal Exit', '2 - Emergency Exit', '3 - Quick Exit'] }
                      ].map((item) => (
                        <div key={item.id}>
                          <div className="flex items-center gap-1">
                            {item.hasOptions && (
                              <button 
                                onClick={() => setExpandedPAI(prev => ({...prev, [item.id]: !prev[item.id]}))}
                                className="text-black hover:bg-gray-200 px-1"
                              >
                                {expandedPAI[item.id] ? '−' : '+'}
                              </button>
                            )}
                            <div 
                              className={`cursor-pointer hover:bg-blue-100 p-1 flex-1 ${selectedPAI.includes(item.id) ? 'bg-blue-500 text-white' : ''}`}
                              onClick={() => {
                                setSelectedPAI(prev => 
                                  prev.includes(item.id) 
                                    ? prev.filter(id => id !== item.id)
                                    : [...prev, item.id]
                                )
                              }}
                            >
                              {item.text}
                            </div>
                          </div>
                          {item.hasOptions && expandedPAI[item.id] && item.options && (
                            <div className="ml-4 space-y-0.5 text-xs">
                              {item.options.map((option, idx) => (
                                <div key={idx} className="text-black">{option}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                <button className="px-6 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2">
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
                <button 
                  onClick={() => setShowSpecificPAI(false)}
                  className="px-6 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version Information Dialog */}
      {showVersionInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[600px]">
            <div className="bg-[#0066CC] text-white px-3 py-1 font-semibold flex justify-between items-center">
              <span>DISPATCHUMS Version Information</span>
              <button onClick={() => setShowVersionInfo(false)} className="text-white">✕</button>
            </div>
            <div className="p-4">
              <div className="text-center mb-6">
                <h2 className="text-4xl font-serif text-black tracking-wide">
                  DISPATCHUMS
                </h2>
                <p className="text-black text-sm">Medical Priority Dispatch System</p>
              </div>

              <table className="w-full text-sm mb-4">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-2 bg-[#C0C0C0] text-black font-semibold">DISPATCHUMS Program:</td>
                    <td className="py-2 px-2 text-black">Version 0.0.1</td>
                    <td className="py-2 px-2 text-black">Date: 05/15/2025</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2 bg-[#C0C0C0] text-black font-semibold">DLL engine:</td>
                    <td className="py-2 px-2 text-black">0.0.1</td>
                    <td className="py-2 px-2 text-black">4/14/2025</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2 bg-[#C0C0C0] text-black font-semibold">Screen Resolution:</td>
                    <td className="py-2 px-2 text-black" colSpan={2}>Default</td>
                  </tr>
                </tbody>
              </table>

              <div className="mb-4">
                <div className="bg-[#C0C0C0] text-black px-2 py-1 font-semibold mb-2">Logic Info:</div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#C0C0C0] text-black">
                      <th className="border border-gray-400 px-2 py-1">Version</th>
                      <th className="border border-gray-400 px-2 py-1">Language</th>
                      <th className="border border-gray-400 px-2 py-1">Type</th>
                      <th className="border border-gray-400 px-2 py-1">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1 text-black">0.0.1</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">ENGLISH</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">STANDARD AMERICAN</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">4/22/2025</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1 text-black">0.0.1</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">CHINESE</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">STANDARD</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">4/22/2025</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1 text-black">0.0.1</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">MALAY</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">STANDARD</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">4/22/2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-4">
                <div className="bg-[#C0C0C0] text-black px-2 py-1 font-semibold mb-2">Program text:</div>
                <div className="bg-white border border-gray-400 p-2 text-xs text-black space-y-1">
                  <div>Version: 0.0.1</div>
                  <div>English - 4/20/2025</div>
                </div>
              </div>

              <div className="flex gap-2 justify-between items-center">
                <div className="text-xs text-black">
                  <div className="font-semibold">DISPATCHUMS Corporation</div>
                  <div>Sabah, Malaysia</div>
                  <div>www.dispatchums.com</div>
                  <div>Copyright (c) 2025</div>
                  <div>All rights reserved.</div>
                </div>
                <button 
                  onClick={() => setShowVersionInfo(false)}
                  className="px-6 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About DISPATCHUMS Dialog */}
      {showAboutDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[550px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>About DISPATCHUMS</span>
              <button onClick={() => setShowAboutDialog(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            
            <div className="bg-white p-6">
              <div className="mb-4">
                <p className="text-black text-sm leading-relaxed mb-4">
                  Welcome to DISPATCHUMS, Advanced Medical Priority Dispatch System (MPDS) initially built for Hospital Universiti Malaysia Sabah, . It provides the user with simple, accurate, and safe access to all MPDS protocols, and allows rapid interaction between the System's Priority Dispatch and Dispatch Life Support (Post-Dispatch Instructions and Pre-Arrival Instructions). This is the standard approach in Emergency Medical Dispatching which is suitable for training demo, case study and professional dispatching. Save lives, save all.
                </p>
                
                <p className="text-black text-sm mb-2">
                  For more details may enter learn more as below.
                </p>
              </div>

              <div className="border-t border-gray-400 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-black">
                    <div className="font-semibold">DISPATCHUMS Corporation</div>
                    <div>Sabah, Malaysia</div>
                    <div>www.dispatchums.com</div>
                    <div>Copyright (c) 2025</div>
                    <div>All rights reserved.</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-center">
                      <h2 className="text-3xl font-serif text-black tracking-wide">
                        DISPATCHUMS
                      </h2>
                      <p className="text-black text-xs">Medical Priority Dispatch System</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowLearnMoreConfirm(true)}
                  className="px-6 py-2 bg-[#1D9BF0] text-white border border-gray-600 hover:bg-[#1a8cd8] transition"
                >
                  Learn More
                </button>
                <button 
                  onClick={() => setShowAboutDialog(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learn More Confirmation Dialog */}
      {showLearnMoreConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Exit to Landing Page</h3>
            <p className="text-gray-700 mb-6">
              You are about to exit the operator interface and go to the landing page.<br/>
              Are you sure you want to continue?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowLearnMoreConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Apply Confirmation Dialog */}
      {showLanguageApplyConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Apply Language Settings</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to apply these language settings?<br/>
              <strong>Operator text:</strong> {tempOperatorLanguage}<br/>
              <strong>Caller text:</strong> {tempCallerLanguage}
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowLanguageApplyConfirm(false);
                  // Reset temp values to current values
                  setTempOperatorLanguage(selectedOperatorLanguage);
                  setTempCallerLanguage(selectedCallerLanguage);
                }}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Apply temp values to actual state
                  setSelectedOperatorLanguage(tempOperatorLanguage);
                  setSelectedCallerLanguage(tempCallerLanguage);
                  setShowLanguageApplyConfirm(false);
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Dialog - Modern Style */}
      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center z-[110]">
          <div className="bg-white rounded-2xl shadow-2xl w-[450px] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">🔒 Change Password</h2>
              <button onClick={() => {
                setShowChangePassword(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }} className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">✕</button>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 bg-gray-50 text-black border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-3 bg-gray-50 text-black border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 bg-gray-50 text-black border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition" 
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-8">
                <button 
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    // Validation
                    if (!currentPassword || !newPassword || !confirmPassword) {
                      alert('Please fill in all fields');
                      return;
                    }
                    
                    if (newPassword.length < 6) {
                      alert('New password must be at least 6 characters long');
                      return;
                    }
                    
                    if (newPassword !== confirmPassword) {
                      alert('New passwords do not match');
                      return;
                    }
                    
                    try {
                      const token = localStorage.getItem('access_token');
                      
                      if (!token) {
                        alert('⚠️ Session expired. Please login again.');
                        router.push('/login');
                        return;
                      }
                      
                      const response = await fetch('http://127.0.0.1:8001/api/v1/auth/change-password', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          current_password: currentPassword,
                          new_password: newPassword
                        })
                      });
                      
                      if (response.status === 401) {
                        alert('⚠️ Session expired. Please login again.');
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user_data');
                        router.push('/login');
                        return;
                      }
                      
                      if (response.ok) {
                        setShowChangePassword(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        alert('✅ Password changed successfully! Please use your new password next time you login.');
                      } else {
                        const error = await response.json();
                        alert(`❌ Failed to change password: ${error.detail}`);
                      }
                    } catch (error) {
                      alert(`❌ Error changing password: ${error}`);
                    }
                  }}
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                  className={`px-6 py-2.5 ${!currentPassword || !newPassword || !confirmPassword ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'} text-white rounded-lg font-medium transition shadow-lg`}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Username Dialog - Modern Style */}
      {showChangeUsername && (
        <div className="fixed inset-0 flex items-center justify-center z-[110]">
          <div className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">👤 Change Username</h2>
              <button onClick={() => {
                setShowChangeUsername(false);
                setNewUsername('');
              }} className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">✕</button>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Current Username</label>
                  <input 
                    type="text" 
                    value={username} 
                    className="w-full px-4 py-3 bg-gray-100 text-gray-600 border-2 border-gray-200 rounded-lg font-medium" 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">New Username</label>
                  <input 
                    type="text" 
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    className="w-full px-4 py-3 bg-gray-50 text-black border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:bg-white transition" 
                  />
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 p-4 rounded-lg">
                  <p className="text-amber-800 text-sm flex items-start gap-2">
                    <span className="text-xl">⚠️</span>
                    <span><strong>Warning:</strong> Username can only be changed once a year (365 days). This change is irreversible.</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-8">
                <button 
                  onClick={() => {
                    setShowChangeUsername(false);
                    setNewUsername('');
                  }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (!newUsername || newUsername.trim() === '') {
                      alert('Please enter a new username');
                      return;
                    }
                    
                    if (newUsername === username) {
                      alert('New username must be different from current username');
                      return;
                    }
                    
                    try {
                      const token = localStorage.getItem('access_token');
                      const response = await fetch('http://127.0.0.1:8001/api/v1/auth/update-profile', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          username: newUsername
                        })
                      });
                      
                      if (response.ok) {
                        const updatedUser = await response.json();
                        
                        // Update all username states
                        setUsername(newUsername);
                        setTempUsername(newUsername);
                        
                        // Update localStorage
                        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
                        userData.username = newUsername;
                        localStorage.setItem('user_data', JSON.stringify(userData));
                        
                        setShowChangeUsername(false);
                        setNewUsername('');
                        alert('✅ Username changed successfully! This change can only be done once a year.');
                      } else {
                        const error = await response.json();
                        alert(`❌ Failed to change username: ${error.detail}`);
                      }
                    } catch (error) {
                      alert(`❌ Error changing username: ${error}`);
                    }
                  }}
                  disabled={!newUsername || newUsername.trim() === ''}
                  className={`px-6 py-2.5 ${!newUsername || newUsername.trim() === '' ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'} text-white rounded-lg font-medium transition shadow-lg`}
                >
                  Change Username
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Confirmation Dialog */}
      {showChangeConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Confirm Changes</span>
              <button onClick={() => setShowChangeConfirm(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <p className="text-gray-700 mb-6">
                Are you sure you want to update the following information?<br/><br/>
                {changeType === 'fullName' && <><strong>Full Name:</strong> {tempFullName}<br/></>}
                {changeType === 'username' && <><strong>Username:</strong> {tempUsername}<br/></>}
                {changeType === 'email' && <><strong>Email:</strong> {tempEmail}<br/></>}
                {changeType === 'gender' && <><strong>Gender:</strong> {tempGender}<br/></>}
                {changeType === 'dob' && <><strong>Date of Birth:</strong> {tempDob}<br/></>}
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowChangeConfirm(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
                <button 
                  onClick={() => {
                    // Enable editing after confirmation
                    setEditableField(changeType);
                    setHasUnsavedChanges(true);
                    setShowChangeConfirm(false);
                  }}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-red-500 pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Delete Account</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete your account? This action is <strong>irreversible</strong> and will permanently remove all your data.
            </p>
            <div className="bg-red-100 border border-red-400 p-3 rounded mb-6">
              <p className="text-red-800 text-sm">
                <strong>Warning:</strong> This action cannot be undone. All your profile information, case history, and account data will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  // Add actual delete logic here
                }}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Picture Confirmation Dialog */}
      {showUploadConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md">
            <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
              <span className="text-3xl">📸</span>
              Upload Profile Picture
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to upload this picture as your profile picture? This will replace your current profile picture.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowUploadConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUploadConfirm(false);
                  // Add actual upload logic here
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Upload Picture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Dialog */}
      {showFeedbackDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-8 shadow-2xl">
            <h3 className="text-xl font-bold text-black mb-4">Give Feedback to Admin</h3>
            
            <div className="space-y-4">
              {/* Case Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Number:
                </label>
                <input
                  type="text"
                  value={feedbackCaseNumber}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700"
                />
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type here:
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-black"
                  placeholder="Enter your feedback..."
                />
              </div>

              {/* From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From:
                </label>
                <input
                  type="text"
                  value={fullName}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700"
                />
              </div>

              {/* Upload Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photo (optional):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeedbackPhotoChange}
                  className="hidden"
                  id="feedback-photo-upload"
                />
                <label
                  htmlFor="feedback-photo-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  📷 Choose Photo
                </label>
                
                {/* Photo Preview */}
                {feedbackPhotoPreview && (
                  <div className="mt-3 relative group">
                    <img
                      src={feedbackPhotoPreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded border border-gray-300"
                    />
                    <button
                      onClick={() => {
                        setFeedbackPhoto(null);
                        setFeedbackPhotoPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowFeedbackDialog(false);
                  setFeedbackText('');
                  setFeedbackPhoto(null);
                  setFeedbackPhotoPreview(null);
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={!feedbackText.trim()}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Success Dialog */}
      {showFeedbackSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm">
            <div className="text-center">
              <div className="text-6xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Success!</h3>
              <p className="text-gray-700 mb-6">Feedback submitted successfully.</p>
              <button
                onClick={() => setShowFeedbackSuccess(false)}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Case Confirmation Dialog */}
      {showDeleteConfirmCase && caseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md">
            <div className="text-center">
              <div className="text-6xl text-red-500 mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-black mb-4">Delete Case</h3>
              <p className="text-gray-700 mb-2">Are you sure you want to delete this case?</p>
              <p className="text-gray-900 font-semibold mb-6">
                Case Number: {caseToDelete.case_number}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteConfirmCase(false);
                    setCaseToDelete(null);
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCase}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md">
            <div className="text-center">
              <div className="text-6xl text-red-500 mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-black mb-4">Delete Multiple Cases</h3>
              <p className="text-gray-700 mb-2">Are you sure you want to delete these cases?</p>
              <p className="text-gray-900 font-semibold mb-6">
                {selectedCasesForDelete.length} case{selectedCasesForDelete.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowBulkDeleteConfirm(false);
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Profile Settings Overlay */}
      {showProfileSettings && (
        <div className="fixed inset-0 z-[90] bg-[#0A0A0A]">
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
              <div className="bg-white rounded-lg shadow-xl p-8 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowProfileSettings(false)}
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
                      id="dashboard-profile-upload"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => document.getElementById('dashboard-profile-upload')?.click()}
                      className="w-full px-4 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8]"
                    >
                      Upload Picture
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">Click to upload from device</p>
                    <p className="text-sm text-gray-600 mt-4">Account created on: 1/4/2026</p>
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
                          <label className="block text-black text-sm mb-1 font-medium">
                            Personal Email
                            {isEmailVerified && (
                              <span className="ml-2 text-green-600 font-semibold" title="Email verified">
                                ✓ Verified
                              </span>
                            )}
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="email"
                              value={tempPersonalEmail}
                              onChange={(e) => setTempPersonalEmail(e.target.value)}
                              placeholder="personal@gmail.com"
                              className="flex-1 px-3 py-2 bg-white text-black border border-gray-400 rounded focus:outline-none focus:border-[#0066CC]"
                            />
                            <button
                              onClick={async () => {
                                if (!tempPersonalEmail) {
                                  alert('Please enter an email address');
                                  return;
                                }
                                
                                setIsSendingEmail(true);
                                try {
                                  const token = localStorage.getItem('access_token');
                                  const response = await fetch('http://127.0.0.1:8001/api/v1/auth/send-verification-code', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ email: tempPersonalEmail })
                                  });
                                  
                                  if (response.ok) {
                                    setEmailToVerify(tempPersonalEmail);
                                    setShowVerifyEmailDialog(true);
                                    setResendCountdown(60); // 60 second cooldown
                                  } else {
                                    const error = await response.json();
                                    alert(`Failed to send verification code: ${error.detail}`);
                                  }
                                } catch (error) {
                                  alert(`Error sending verification code: ${error}`);
                                } finally {
                                  setIsSendingEmail(false);
                                }
                              }}
                              disabled={isEmailVerified || isSendingEmail}
                              className={`px-4 py-2 ${isEmailVerified || isSendingEmail ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1D9BF0] hover:bg-[#1a8cd8]'} text-white rounded transition`}
                            >
                              {isSendingEmail ? 'Sending...' : isEmailVerified ? '✓ Verified' : 'Verify'}
                            </button>
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
                              className="px-4 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8]"
                            >
                              Change
                            </button>
                          </div>
                          <p className="text-xs text-orange-600 mt-1">⚠️ Username can be changed only once a year (365 days)</p>
                        </div>
                        <div>
                          <label className="block text-black text-sm mb-1 font-medium">Password</label>
                          <div className="flex gap-2">
                            <input
                              type="password"
                              value="********"
                              className="flex-1 px-3 py-2 bg-gray-100 text-black border border-gray-400 rounded"
                              disabled
                            />
                            <button
                              onClick={() => setShowChangePassword(true)}
                              className="px-4 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8]"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-black text-sm mb-1 font-medium">ID</label>
                          <input
                            type="text"
                            value={dispatcherId}
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
                            <option value="MECC UMS">MECC UMS</option>
                            <option value="Kota Kinabalu">Kota Kinabalu</option>
                            <option value="Sandakan">Sandakan</option>
                            <option value="Tawau">Tawau</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-black text-sm mb-1 font-medium">Role</label>
                          <select
                            value="dispatcher"
                            className="w-full px-3 py-2 bg-gray-100 text-black border border-gray-400 rounded"
                            disabled
                          >
                            <option value="dispatcher">Dispatcher</option>
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
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                              alert('Account deletion feature coming soon');
                            }
                          }}
                          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete Account
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setTempFullName(fullName);
                            setTempUsername(username);
                            setTempEmail(email);
                            setTempGender(gender);
                            setTempDob(dob);
                            setTempUnit(unit);
                            setTempAddress(address);
                            setTempCity(city);
                            setTempState(state);
                            setTempPostcode(postcode);
                            setTempPhoneNumber(phoneNumber);
                            setShowProfileSettings(false);
                          }}
                          className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('access_token');
                              
                              if (!token) {
                                alert('⚠️ Session expired. Please login again.');
                                router.push('/login');
                                return;
                              }
                              
                              // Build update object, only include personal_email if it's valid
                              const updateData: any = {
                                full_name: tempFullName,
                                email: tempEmail,
                                profile_picture: profilePicture,
                                gender: tempGender,
                                dob: tempDob,
                                unit: tempUnit,
                                address: tempAddress,
                                city: tempCity,
                                state: tempState,
                                postcode: tempPostcode,
                                phone_number: tempPhoneNumber
                              };
                              
                              // Only include personal_email if it's not empty and contains @
                              if (tempPersonalEmail && tempPersonalEmail.includes('@')) {
                                updateData.personal_email = tempPersonalEmail;
                              }
                              
                              const response = await fetch('http://127.0.0.1:8001/api/v1/auth/update-profile', {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(updateData)
                              });
                              
                              if (response.status === 401) {
                                alert('⚠️ Session expired. Please login again.');
                                localStorage.removeItem('access_token');
                                localStorage.removeItem('user_data');
                                router.push('/login');
                                return;
                              }
                              
                              if (response.ok) {
                                const updatedUser = await response.json();
                                
                                // Update local state
                                setFullName(tempFullName);
                                setUsername(tempUsername);
                                setEmail(tempEmail);
                                setPersonalEmail(tempPersonalEmail);
                                setGender(tempGender);
                                setDob(tempDob);
                                setUnit(tempUnit);
                                setAddress(tempAddress);
                                setCity(tempCity);
                                setState(tempState);
                                setPostcode(tempPostcode);
                                setPhoneNumber(tempPhoneNumber);
                                
                                // Update localStorage with fresh data from backend
                                const userData = {
                                  ...updatedUser,
                                  dispatcher_name: tempFullName,
                                  dispatcher_unit: tempUnit,
                                };
                                
                                localStorage.setItem('user_data', JSON.stringify(userData));
                                setShowProfileSettings(false);
                                alert('✅ Profile updated successfully!');
                              } else {
                                const errorText = await response.text();
                                console.error('Failed to update profile:', response.status, errorText);
                                alert(`❌ Failed to update profile: ${errorText}`);
                              }
                            } catch (error) {
                              console.error('Error updating profile:', error);
                              alert(`❌ Error updating profile: ${error}`);
                            }
                          }}
                          className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Verification Code Dialog */}
      {showVerifyEmailDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-[110]">
          <div className="bg-white rounded-2xl shadow-2xl w-[450px] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">📧 Verify Email</h2>
              <button onClick={() => {
                setShowVerifyEmailDialog(false);
                setVerificationCode('');
              }} className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">✕</button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                We've sent a 6-digit verification code to:
              </p>
              <p className="text-blue-600 font-semibold mb-6 text-center text-lg">
                {emailToVerify}
              </p>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Enter Verification Code</label>
                  <input 
                    type="text" 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-gray-50 text-black text-center text-2xl font-mono border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition tracking-widest" 
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">Code expires in 10 minutes</p>
                </div>
              </div>
              
              {/* Resend Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={async () => {
                    setIsSendingEmail(true);
                    setVerificationCode(''); // Clear existing code
                    try {
                      const token = localStorage.getItem('access_token');
                      const response = await fetch('http://127.0.0.1:8001/api/v1/auth/send-verification-code', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ email: emailToVerify })
                      });
                      
                      if (response.ok) {
                        setResendCountdown(60); // Reset countdown
                        alert('✅ New verification code sent!');
                      } else {
                        const error = await response.json();
                        alert(`Failed to resend code: ${error.detail}`);
                      }
                    } catch (error) {
                      alert(`Error resending code: ${error}`);
                    } finally {
                      setIsSendingEmail(false);
                    }
                  }}
                  disabled={resendCountdown > 0 || isSendingEmail}
                  className={`text-sm ${resendCountdown > 0 || isSendingEmail ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 hover:underline cursor-pointer'} transition`}
                >
                  {isSendingEmail ? 'Sending...' : resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : '↻ Resend verification code'}
                </button>
              </div>
              
              <div className="flex gap-3 justify-end mt-8">
                <button 
                  onClick={() => {
                    setShowVerifyEmailDialog(false);
                    setVerificationCode('');
                  }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (verificationCode.length !== 6) {
                      alert('Please enter a 6-digit code');
                      return;
                    }
                    try {
                      const token = localStorage.getItem('access_token');
                      const response = await fetch('http://127.0.0.1:8001/api/v1/auth/verify-email-code', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ 
                          email: emailToVerify,
                          code: verificationCode 
                        })
                      });
                      
                      if (response.ok) {
                        setShowVerifyEmailDialog(false);
                        setVerificationCode('');
                        setIsEmailVerified(true);
                        alert('✅ Email verified successfully! Your personal email is now confirmed for password recovery.');
                      } else {
                        const error = await response.json();
                        alert(`❌ Verification failed: ${error.detail}`);
                      }
                    } catch (error) {
                      alert(`❌ Error: ${error}`);
                    }
                  }}
                  disabled={verificationCode.length !== 6}
                  className={`px-6 py-2.5 ${verificationCode.length === 6 ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gray-300 cursor-not-allowed'} text-white rounded-lg font-medium transition shadow-lg`}
                >
                  Verify Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}