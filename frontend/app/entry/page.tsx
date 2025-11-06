'use client';

import { useState, useEffect, useRef } from 'react';
import EntryNavigation from '@/components//shared/EntryNavigation';

// Protocol data
const protocols = [
  { id: '1', name: 'Abdominal Pain/Problems' },
  { id: '2', name: 'Allergies (Reactions)/Envenomations (Stings, Bites)' },
  { id: '3', name: 'Animal Bites/Attacks' },
  { id: '4', name: 'Assault/Sexual Assault/Stun Gun' },
  { id: '5', name: 'Back Pain (Non-Traumatic or Non-Recent Trauma)' },
  { id: '6', name: 'Breathing Problems/Inhalation/HazMat/CBRN' },
  { id: '7', name: 'Burns (Scalds)/Explosion (Blast)' },
  { id: '8', name: 'Carbon Monoxide/Inhalation/HazMat/CBRN' },
  { id: '9', name: 'Cardiac or Respiratory Arrest/Death' },
  { id: '10', name: 'Chest Pain/Chest Discomfort (Non-Traumatic)' },
  // Add more protocols as needed...
];

export default function EntryPage() {
  // Timer and Progress State
  const [elapsed, setElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Case data
  const [caseNumber, setCaseNumber] = useState('2000005541');
  
  // Format elapsed time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load Google Maps Script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBk7nQUmLoluH0eVdT3FnBeNreGcqqg9Uk&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    if (!(window as any).google) {
      loadGoogleMapsScript();
    }
  }, []);

  // Auto-start timer on component mount
  useEffect(() => {
    setIsTimerRunning(true);
  }, []);

  // Timer Effect
  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setElapsed(prev => {
        const newElapsed = prev + 1;
        setProgress(Math.min((newElapsed / 60) * 100, 100));
        return newElapsed;
      });
    }, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning]);

  const [formData, setFormData] = useState({
    location: '2585 E 16th St',
    phoneNumber: '555-5555',
    problem: 'Having a baby, heads out',
    withPatient: 'Yes',
    numHurt: '1',
    age: '',
    gender: '',
    conscious: '',
    breathing: '',
    chiefComplaint: ''
  });
  
  const [filteredProtocols, setFilteredProtocols] = useState(protocols);
  const [isAddressValidated, setIsAddressValidated] = useState(false);
  const [validationLoading, setValidationLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const validateAddress = async () => {
    setValidationLoading(true);
    setIsAddressValidated(false);
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      
      geocoder.geocode(
        { address: formData.location },
        (results: any, status: any) => {
          if (status === 'OK') {
            const location = results[0].geometry.location;
            const formattedAddress = results[0].formatted_address;
            setMapPosition({
              lat: location.lat(),
              lng: location.lng()
            });
            setSelectedLocation(formattedAddress);
            setIsAddressValidated(true);
            setFormData(prev => ({
              ...prev,
              location: formattedAddress
            }));
          } else {
            setMapPosition(null);
            setSelectedLocation(null);
            setIsAddressValidated(false);
          }
          setValidationLoading(false);
        }
      );
    } catch (error) {
      console.error('Validation error:', error);
      setMapPosition(null);
      setSelectedLocation(null);
      setIsAddressValidated(false);
      setValidationLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setElapsed(0);
    setProgress(0);
    setIsTimerRunning(true);
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  const handleCloseCase = () => {
    console.log('Closing case...');
  };

  const handleChangeCaseNumber = () => {
    setCaseNumber(window.prompt('Enter new case number:') || caseNumber);
  };

  const handlePrintCase = () => {
    window.print();
  };

  return (
    <EntryNavigation
      username="SUPERVISOR"
      fullName="John Supervisor"
      caseNumber={caseNumber}
      onLogout={handleLogout}
      onCloseCase={handleCloseCase}
      onChangeCaseNumber={handleChangeCaseNumber}
      onPrintCase={handlePrintCase}
    >
      {/* Timer and Loading Bar */}
      <div className="bg-[#1a1a1a] border-t border-b border-gray-700">
        <div className="flex items-center justify-between px-2 py-3">
          <div className="text-white font-mono text-lg pl-1">{formatTime(elapsed)}</div>
          <div className="flex-1 flex justify-center px-4">
            <div className="w-1/2 max-w-lg h-3 bg-gray-700 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="h-full bg-[#1D9BF0] animate-loading-wave"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex">
        {['Case Entry', 'Additional Information'].map((tab) => (
          <button
            key={tab}
            className="py-2 px-4 text-black bg-[#C0C0C0] hover:bg-gray-300 transition"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-2 px-6">
        <div className="space-y-1">
          <div className="grid grid-cols-[200px,1fr] gap-x-3 gap-y-1 items-start">
            <div className="text-left text-black">The location is:</div>
            <div className="flex gap-2 items-start">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => {
                    handleChange(e);
                    setIsAddressValidated(false);
                    setMapPosition(null);
                    setSelectedLocation(null);
                  }}
                  name="location"
                  className={`border px-1 py-0.5 h-7 bg-white text-black w-full ${
                    isAddressValidated ? 'border-green-500' : 
                    isAddressValidated === false && mapPosition === null ? 'border-red-500' : 
                    'border-gray-400'
                  }`}
                />
                {isAddressValidated && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-xs text-green-600">Valid</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <button
                onClick={validateAddress}
                disabled={validationLoading || !formData.location}
                className={`bg-[#C0C0C0] border border-gray-600 px-3 text-black hover:bg-gray-300 transition h-7 flex items-center justify-center gap-1 ${validationLoading || !formData.location ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {validationLoading ? 'Validating...' : 'Validate'}
              </button>
            </div>

            <div className="text-left text-black">The phone number is:</div>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              name="phoneNumber"
              className="border border-gray-400 px-1 py-0.5 h-7 bg-white text-black w-full"
            />

            <div className="text-left text-black">The problem is:</div>
            <input
              type="text"
              value={formData.problem}
              onChange={handleChange}
              name="problem"
              className="border border-gray-400 px-1 py-0.5 h-7 bg-white text-black w-full"
            />

            {/* Add more form fields as needed... */}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              console.log('Confirming entry...');
            }}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
          >
            <span>Confirm & Continue</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </EntryNavigation>
  );
}