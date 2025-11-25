'use client';

import { useState, useEffect, useRef } from 'react';
import EntryNavigation from '@/components/shared/EntryNavigation';

// Protocol data
const protocols = [
  { id: '1', name: 'Abdominal Pain/Problems' },
  { id: '2', name: 'Allergies (Reactions)/Envenomations (Stings, Bites)' },
  { id: '3', name: 'Animal Bites/Attacks' },
  { id: '4', name: 'Assault/Sexual Assault/Stun Gun' },
  { id: '5', name: 'Back Pain (Non-Traumatic or Non-Recent Trauma)' },
  { id: '6', name: 'Breathing Problems' },
  { id: '7', name: 'Burns (Scalds)/Explosion (Blast)' },
  { id: '8', name: 'Carbon Monoxide/Inhalation/HazMat/CBRN' },
  { id: '9', name: 'Cardiac or Respiratory Arrest/Death' },
  { id: '10', name: 'Chest Pain/Chest Discomfort (Non-Traumatic)' },
  { id: '11', name: 'Choking' },
  { id: '12', name: 'Convulsions/Seizures' },
  { id: '13', name: 'Diabetic Problems' },
  { id: '14', name: 'Drowning/Near Drowning/Diving/SCUBA Accident' },
  { id: '15', name: 'Electrocution/Lightning' },
  { id: '16', name: 'Eye Problems/Injuries' },
  { id: '17', name: 'Falls' },
  { id: '18', name: 'Headache' },
  { id: '19', name: 'Heart Problems/A.I.C.D.' },
  { id: '20', name: 'Heat/Cold Exposure' },
  { id: '21', name: 'Hemorrhage/Lacerations' },
  { id: '22', name: 'Inaccessible Incident/Other Entrapments (Non-Traffic)' },
  { id: '23', name: 'Overdose/Poisoning (Ingestion)' },
  { id: '24', name: 'Pregnancy/Childbirth/Miscarriage' },
  { id: '25', name: 'Psychiatric/Abnormal Behavior/Suicide Attempt' },
  { id: '26', name: 'Sick Person (Specific Diagnosis)' },
  { id: '27', name: 'Stab/Gunshot/Penetrating Trauma' },
  { id: '28', name: 'Stroke (CVA)/Transient Ischemic Attack (TIA)' },
  { id: '29', name: 'Traffic/Transportation Incidents' },
  { id: '30', name: 'Traumatic Injuries (Specific)' },
  { id: '31', name: 'Unconscious/Fainting (Near)' }
];

// Ambulance data with various statuses
const ambulances = [
  { id: 'HUMS01', name: 'HUMS 01', status: 'available' },
  { id: 'HUMS02', name: 'HUMS 02', status: 'available' },
  { id: 'HUMS03', name: 'HUMS 03', status: 'available' },
  { id: 'HUMS04', name: 'HUMS 04', status: 'available' },
  { id: 'HQE01', name: 'HQE 01', status: 'available' },
  { id: 'HQE2', name: 'HQE 2', status: 'available' },
  { id: 'HQE3', name: 'HQE 3', status: 'available' },
  { id: 'HQE4', name: 'HQE 4', status: 'available' },
  { id: 'HQE01_2', name: 'HQE II 01', status: 'available' },
  { id: 'HQE02', name: 'HQE II 02', status: 'available' },
  { id: 'HQE03', name: 'HQE II 03', status: 'available' },
  { id: 'MESRABP01', name: 'MESRA BP 01', status: 'available' },
  { id: 'WWK01', name: 'WWK 01', status: 'available' },
  { id: 'KLIKAS01', name: 'KK LIKAS 01', status: 'available' },
  { id: 'KLUYANG01', name: 'KK LUYANG 01', status: 'available' },
  { id: 'KTELIPOK01', name: 'KK TELIPOK 01', status: 'available' },
  { id: 'UTCKK01', name: 'UTC KK 01', status: 'available' },
  { id: 'BSMM01', name: 'BSMM 01', status: 'available' },
  { id: 'STJOHN01', name: 'ST. JOHN 01', status: 'available' },
  { id: 'KMENGGATOL01', name: 'KK MENGGATAL 01', status: 'unavailable' }
];

export default function EntryPage() {
  const [filteredProtocols, setFilteredProtocols] = useState<typeof protocols>([]);
  const [currentSubpart, setCurrentSubpart] = useState<'case-entry' | 'additional-info'>('case-entry');
  const [currentPage, setCurrentPage] = useState<'entry' | 'kq' | 'pdi' | 'cpr' | 'dls' | 'summary'>('entry');
  
  // KQ Page state
  const [kqAnswers, setKqAnswers] = useState({
    question1: '', // completely alert
    question2: '', // difficulty speaking
    question2a: '', // color change description 
    question2i: '', // tracheostomy distress
    question3: '', // changing color
    question3a: '', // color change description
    question4: '', // clammy/cold sweats
    question5: '', // asthma/lung problems
    question5a: '', // prescribed inhaler
    question5i: '', // inhaler used
    question6: '', // special equipment
    question6a: '' // equipment used
  });

  // KQ Pagination state
  const [currentKqPage, setCurrentKqPage] = useState(1);
  
  // KQ Tab state for navigation between Question Answers, Additional Information, etc.
  const [currentKqTab, setCurrentKqTab] = useState<'question-answers' | 'additional-info' | 'determinants' | 'det-codes'>('question-answers');

  // Navigation history for back button
  const [navigationHistory, setNavigationHistory] = useState<Array<{page: 'entry' | 'kq' | 'pdi' | 'cpr', subpart?: 'case-entry' | 'additional-info', kqPage?: number}>>([]);
  const [autoSaved, setAutoSaved] = useState(false);

  // CPR Instructions State
  const [currentCprStep, setCurrentCprStep] = useState('pdi');
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>({});
  const [showExitModal, setShowExitModal] = useState(false);
  const [showAgonalOptions, setShowAgonalOptions] = useState(false);
  
  // Step 5 Dialog States
  const [showStep5Dialog, setShowStep5Dialog] = useState(false);
  const [step5DialogStage, setStep5DialogStage] = useState<'initial' | 'yesno' | 'yes-options' | 'no-options'>('initial');
  const [selectedButtons, setSelectedButtons] = useState<{[key: string]: boolean}>({});
  
  // PDI Follow-up States
  const [showPdiFollowUp, setShowPdiFollowUp] = useState(false);
  
  // DLS/X-Card States
  const [showDLS, setShowDLS] = useState(false);
  const [dlsCallerType, setDlsCallerType] = useState<'1st' | '2nd' | null>(null);
  const [dlsStage, setDlsStage] = useState<number>(1);
  const [showCaseCompletionModal, setShowCaseCompletionModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showConfirmSummaryModal, setShowConfirmSummaryModal] = useState(false);
  const [showInlineTimelineSummary, setShowInlineTimelineSummary] = useState(false);

  const [formData, setFormData] = useState({
    // Case Entry Fields
    location: '2585 E 16th St',
    phoneNumber: '555-5555',
    problem: 'Okey, tell me exactly what happened',
    withPatient: 'Yes',
    numHurt: '1',
    age: '',
    gender: '',
    conscious: '',
    breathing: '',
    chiefComplaint: '',
    
    // Additional Information Fields
    contactName: '',
    language: '',
    hazards: '',
    weapons: '',
    notes: ''
  });

  // State to track which fields have been interacted with
  const [fieldInteractions, setFieldInteractions] = useState<{[key: string]: boolean}>({});
    // ADD THESE DEBUGGING EFFECTS HERE:
      useEffect(() => {
        console.log('showCaseCompletionModal changed to:', showCaseCompletionModal);
      }, [showCaseCompletionModal]);

      useEffect(() => {
        console.log('showDLS changed to:', showDLS);
      }, [showDLS]);
      // END DEBUGGING EFFECTS

      // Auto-save effect
      useEffect(() => {
        const saveTimer = setTimeout(() => {
          setAutoSaved(true);
          setTimeout(() => setAutoSaved(false), 2000);
        }, 1000);

        return () => clearTimeout(saveTimer);
      }, [formData, kqAnswers]);

  // Auto-save effect
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000); // Show saved icon for 2 seconds
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [formData, kqAnswers]);

  const [showMap, setShowMap] = useState(false);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [mapLocation, setMapLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Effect to initialize/update map when container becomes visible or location changes
  useEffect(() => {
    if (showMap && mapLocation && mapRef.current) {
      // Small delay to ensure container is ready
      setTimeout(() => {
        if (mapRef.current) {
          // Create new map if it doesn't exist
          if (!googleMapRef.current) {
            googleMapRef.current = new google.maps.Map(mapRef.current, {
              center: mapLocation,
              zoom: 15
            });
          } else {
            // Update existing map center
            googleMapRef.current.setCenter(mapLocation);
          }
          
          // Update existing marker or create new one
          if (markerRef.current) {
            // Update existing marker position
            markerRef.current.setPosition(mapLocation);
          } else {
            // Create new marker
            markerRef.current = new google.maps.Marker({
              position: mapLocation,
              map: googleMapRef.current,
              title: formData.location
            });
          }
        }
      }, 100);
    }
  }, [showMap, mapLocation, formData.location]);

  const validateLocation = async () => {
    if (!formData.location) return;

    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ address: formData.location });
      
      if (result.results && result.results[0]) {
        const location = result.results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        setMapLocation({ lat, lng });
        setIsLocationValid(true);
        setShowMap(true);
      } else {
        setIsLocationValid(false);
        setShowMap(false);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setIsLocationValid(false);
      setShowMap(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Reset location validation state when location is changed
    if (name === 'location') {
      setIsLocationValid(false);
      setShowMap(false);
      setMapLocation(null);
      // Clean up existing map references
      markerRef.current = null;
      googleMapRef.current = null;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  const handleCloseCase = () => {
    // Handle close case
  };

  const handleChangeCaseNumber = () => {
    // Handle change case number
  };

  const handlePrintCase = () => {
    window.print();
  };

  const handleKqAnswer = (questionKey: string, value: string) => {
    const updatedAnswers = {
      ...kqAnswers,
      [questionKey]: value
    };
    
    setKqAnswers(updatedAnswers);
    
    // Check for immediate dispatch conditions
    if (questionKey === 'question1' && value === 'no') {
      // Patient is not alert - immediate dispatch required
      setHasDispatchedFromQ1(true);
      
      // Calculate determinant with updated answers
      const determinant = calculateDeterminantWithAnswers(updatedAnswers);
      setSelectedDeterminant(determinant);
      setShowDispatchConfirm(true);
    }
  };

  const handleAdditionalInfoContinue = () => {
    // Add current page to history
    setNavigationHistory(prev => [...prev, { page: 'entry', subpart: 'additional-info' }]);
    setCurrentPage('kq');
    setCurrentKqPage(1); // Start with first KQ page
  };

  // Add determinant calculation state
  const [selectedDeterminant, setSelectedDeterminant] = useState<string | null>(null);
  const [showDispatchConfirm, setShowDispatchConfirm] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchComplete, setDispatchComplete] = useState(false);
  const [hasDispatchedFromQ1, setHasDispatchedFromQ1] = useState(false);

  // Ambulance Selection States
  const [showAmbulanceSelection, setShowAmbulanceSelection] = useState(false);
  const [selectedAmbulances, setSelectedAmbulances] = useState<string[]>([]);
  const [showAmbulanceConfirm, setShowAmbulanceConfirm] = useState(false);
  const [ambulanceError, setAmbulanceError] = useState('');

  // Auto-select ambulances based on number of hurt people (only available ones)
  useEffect(() => {
    if (showAmbulanceSelection) {
      const numHurt = parseInt(formData.numHurt) || 0;
      
      if (numHurt > 0) {
        // Auto-select required number of available ambulances starting with HUMS01
        const availableAmbulances = ambulances.filter(amb => amb.status === 'available');
        const autoSelected = availableAmbulances.slice(0, numHurt).map(amb => amb.id);
        setSelectedAmbulances(autoSelected);
        setAmbulanceError('');
      } else {
        setSelectedAmbulances([]);
        setAmbulanceError('Number of hurt/sick people not detected. Cannot dispatch ambulance.');
      }
    }
  }, [showAmbulanceSelection, formData.numHurt]);

  // Determinant calculation logic with current answers
  const calculateDeterminantWithAnswers = (answers: typeof kqAnswers) => {
    const determinants: string[] = [];
    
    // Level E - INEFFECTIVE BREATHING (highest priority) - when patient not alert
    if (answers.question1 === 'no') {
      determinants.push('6-E-1'); // INEFFECTIVE BREATHING - Not alert
    }
    
    // Level D determinants
    if (answers.question1 === 'no') {
      determinants.push('6-D-1'); // Not alert (backup determinant)
    }
    if (answers.question2 === 'yes') {
      determinants.push('6-D-2'); // DIFFICULTY SPEAKING BETWEEN BREATHS
    }
    if (answers.question3 === 'yes') {
      determinants.push('6-D-3'); // CHANGING COLOR
    }
    if (answers.question4 === 'yes') {
      determinants.push('6-D-4'); // Clammy or cold sweats
    }
    if (answers.question2i === 'yes') {
      determinants.push('6-D-5'); // Tracheostomy (obvious distress)
    }
    
    // Level C determinants (only if patient is alert and no D-level conditions)
    if (answers.question1 === 'yes' && !determinants.some(d => d.startsWith('6-D'))) {
      if (formData.breathing === 'Yes') { // Abnormal breathing
        determinants.push('6-C-1');
      }
    }
    if (answers.question6 === 'yes' && answers.question6a === 'no') {
      determinants.push('6-C-2'); // Tracheostomy (no obvious distress)
    }

    // Find highest priority determinant
    const priorityOrder = ['E', 'D', 'C', 'B', 'A'];
    
    for (const level of priorityOrder) {
      const levelDeterminants = determinants.filter(d => d.includes(`-${level}-`));
      
      if (levelDeterminants.length > 0) {
        // If multiple determinants in same level, prioritize number 1 first
        if (levelDeterminants.length > 1) {
          const hasNumber1 = levelDeterminants.find(d => d.endsWith('-1'));
          if (hasNumber1) {
            return hasNumber1;
          }
        }
        
        // Otherwise return the highest numbered determinant in this level
        return levelDeterminants.sort((a, b) => {
          const numA = parseInt(a.split('-')[2]);
          const numB = parseInt(b.split('-')[2]);
          return numB - numA;
        })[0];
      }
    }

    return '6-E-1'; // Default to E-1 for "not alert" if no other conditions met
  };

  // Wrapper function for current state
  const calculateDeterminant = () => {
    return calculateDeterminantWithAnswers(kqAnswers);
  };

  const getKqSummary = (questionKey: string, answer: string) => {
    if (!answer || answer === '') return 'Not answered';
    
    switch (questionKey) {
      case 'question1':
        return answer === 'yes' ? 'Patient is completely alert and responding appropriately' : 
               answer === 'no' ? 'Patient is not alert or not responding appropriately' : 'Alertness status unknown';
      case 'question2':
        return answer === 'yes' ? 'Patient has difficulty speaking or crying between breaths' : 
               'Patient can speak normally between breaths';
      case 'question3':
        return answer === 'yes' ? 'Patient is changing color (clinical significance)' : 
               'Patient is not changing color';
      case 'question4':
        return answer === 'yes' ? 'Patient is clammy or having cold sweats' : 
               'Patient is not clammy or having cold sweats';
      case 'question5':
        return answer === 'yes' ? 'Patient has asthma or other lung problems' : 
               'Patient does not have asthma or lung problems';
      case 'question6':
        return answer === 'yes' ? 'Patient has special equipment or instructions available' : 
               'Patient does not have special equipment or instructions';
      default:
        return answer;
    }
  };

  const handleKqComplete = () => {
    // If dispatch has already been completed, go directly to PDI
    if (hasDispatchedFromQ1 || dispatchComplete) {
      setNavigationHistory(prev => [...prev, { page: 'kq', kqPage: currentKqPage }]);
      setCurrentPage('pdi');
      return;
    }
    
    // Otherwise, show dispatch confirmation modal
    const determinant = calculateDeterminant();
    setSelectedDeterminant(determinant);
    setShowDispatchConfirm(true);
  };

  const handleKqNext = () => {
    // If patient is not alert (question1 = 'no') and we're on page 1, proceed to PDI after dispatch
    if (kqAnswers.question1 === 'no' && currentKqPage === 1) {
      // Add to navigation history and go to PDI
      setNavigationHistory(prev => [...prev, { page: 'kq', kqPage: currentKqPage }]);
      setCurrentPage('pdi');
      return;
    }
    
    if (shouldSkipToQuestion5()) {
      setCurrentKqPage(5);
    } else if (currentKqPage < 6) {
      setCurrentKqPage(currentKqPage + 1);
    }
  };

  const handleKqBack = () => {
    if (currentKqPage > 1) {
      setCurrentKqPage(currentKqPage - 1);
    } else {
      // Go back to Additional Info
      setCurrentPage('entry');
      setCurrentSubpart('additional-info');
    }
  };

  // Ambulance Selection Functions
  const handleAmbulanceToggle = (ambulanceId: string) => {
    const ambulance = ambulances.find(amb => amb.id === ambulanceId);
    
    // Only allow selection of available ambulances
    if (ambulance?.status !== 'available') {
      return;
    }

    const numHurt = parseInt(formData.numHurt) || 0;
    
    if (selectedAmbulances.includes(ambulanceId)) {
      setSelectedAmbulances(prev => prev.filter(id => id !== ambulanceId));
    } else {
      if (selectedAmbulances.length < numHurt) {
        setSelectedAmbulances(prev => [...prev, ambulanceId]);
      }
    }
  };

  const getAmbulanceStatus = (ambulanceId: string) => {
    const ambulance = ambulances.find(amb => amb.id === ambulanceId);
    
    if (selectedAmbulances.includes(ambulanceId)) {
      return 'selected'; // Blue - preparing to depart
    }
    
    return ambulance?.status || 'available'; // Return the actual status
  };

  const getAmbulanceClass = (ambulanceId: string) => {
    const status = getAmbulanceStatus(ambulanceId);
    const baseClass = "border-2 p-3 rounded transition-all duration-200 text-center font-semibold min-h-[60px] flex items-center justify-center";
    
    switch (status) {
      case 'selected':
        return `${baseClass} bg-blue-200 border-blue-600 text-blue-800 cursor-pointer`;
      case 'available':
        return `${baseClass} bg-green-100 border-green-500 text-green-800 hover:bg-green-200 cursor-pointer`;
      case 'en-route':
        return `${baseClass} bg-yellow-200 border-yellow-600 text-yellow-800 cursor-not-allowed`;
      case 'arrived':
        return `${baseClass} bg-purple-200 border-purple-600 text-purple-800 cursor-not-allowed`;
      case 'unavailable':
        return `${baseClass} bg-red-200 border-red-600 text-red-800 cursor-not-allowed`;
      default:
        return `${baseClass} bg-gray-100 border-gray-400 text-gray-600 cursor-not-allowed`;
    }
  };

  const handleAmbulanceConfirm = () => {
    const numHurt = parseInt(formData.numHurt) || 0;
    
    if (numHurt === 0) {
      setAmbulanceError('Cannot dispatch ambulance - number of hurt/sick people not detected.');
      return;
    }
    
    if (selectedAmbulances.length !== numHurt) {
      setAmbulanceError(`Please select exactly ${numHurt} ambulance(s) for ${numHurt} hurt/sick person(s).`);
      return;
    }
    
    setShowAmbulanceConfirm(true);
  };

  const confirmAmbulanceDispatch = () => {
    setShowAmbulanceConfirm(false);
    setShowAmbulanceSelection(false);
    setIsDispatching(true);
    setDispatchComplete(true);
    
    // Simulate dispatch delay then show static indicator
    setTimeout(() => {
      setIsDispatching(false);
      
      // Continue with the flow
      if (hasDispatchedFromQ1) {
        setCurrentKqPage(4);
        setCurrentPage('kq');
      } else {
        setCurrentPage('pdi');
      }
    }, 2000);
  };

  const shouldSkipToQuestion5 = () => {
    return currentKqPage === 2 && kqAnswers.question2 === 'yes' && kqAnswers.question2i === 'yes';
  };

  const canProceedToNext = () => {
    // If dispatch has already occurred, allow proceeding regardless of current answers
    if (hasDispatchedFromQ1 || dispatchComplete) {
      return true;
    }
    
    switch (currentKqPage) {
      case 1:
        return kqAnswers.question1 !== '';
      case 2:
        if (kqAnswers.question1 === 'no') return true; // Skip if not alert
        return kqAnswers.question2 !== '';
      case 3:
        return kqAnswers.question3 !== '';
      case 4:
        return kqAnswers.question4 !== '';
      case 5:
        return kqAnswers.question5 !== '';
      case 6:
        // Question 6 must be answered, and if answered "yes", then question6a must also be answered
        if (kqAnswers.question6 === '') return false;
        if (kqAnswers.question6 === 'yes' && kqAnswers.question6a === '') return false;
        return true;
      default:
        return false;
    }
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 0) {
      const lastPage = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      
      if (lastPage.page === 'entry' && lastPage.subpart) {
        setCurrentPage('entry');
        setCurrentSubpart(lastPage.subpart);
      } else if (lastPage.page === 'kq' && lastPage.kqPage) {
        setCurrentPage('kq');
        setCurrentKqPage(lastPage.kqPage);
      } else {
        setCurrentPage(lastPage.page);
      }
    } else {
      // Default fallback
      setCurrentPage('entry');
      setCurrentSubpart('additional-info');
    }
  };

  // CPR Handler Functions
  const handleCheckboxChange = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleButtonClick = (buttonId: string, action?: () => void) => {
    // Mark button as selected (blue)
    setSelectedButtons(prev => ({
      ...prev,
      [buttonId]: true
    }));
    
    // Execute the action if provided
    if (action) {
      action();
    }
  };

  const getButtonClass = (buttonId: string, baseClass: string) => {
    const isSelected = selectedButtons[buttonId];
    if (isSelected) {
      return baseClass.replace('bg-gray-100', 'bg-blue-200').replace('hover:bg-gray-200', 'hover:bg-blue-300');
    }
    return baseClass;
  };

  // Step 5 Dialog Handlers
  const handleStep5ContinueDialog = () => {
    setShowStep5Dialog(true);
    setStep5DialogStage('yesno');
  };

  const handleStep5YesNo = (answer: 'yes' | 'no') => {
    if (answer === 'yes') {
      setStep5DialogStage('yes-options');
    } else {
      setStep5DialogStage('no-options');
    }
  };

  const handleStep5NoMouthToMouth = () => {
    setShowStep5Dialog(false);
    setStep5DialogStage('initial');
    // Continue to next case
    setCurrentCprStep('6');
  };

  const handleCprGoBack = () => {
    if (currentCprStep === 'pdi') return;
    
    // Reset Step 5 dialog state when leaving step 5
    if (currentCprStep === '5') {
      setShowStep5Dialog(false);
      setStep5DialogStage('initial');
    }
    
    if (currentCprStep === '1') {
      setCurrentCprStep('pdi');
    } else if (currentCprStep === '15a') {
      setCurrentCprStep('15');
    } else {
      const stepNum = parseInt(currentCprStep);
      if (!isNaN(stepNum)) {
        setCurrentCprStep((stepNum - 1).toString());
      }
    }
  };

  const handleCaseExit = () => {
    setShowExitModal(true);
  };

const confirmCaseExit = () => {
  setShowExitModal(false);
  // Reset any conflicting page states
  setCurrentPage('dls');  // Changed from 'entry' to 'dls'
  setShowStep5Dialog(false);
  setShowPdiFollowUp(false);
  // Show DLS
  setShowDLS(true);
  setDlsCallerType(null);
  setDlsStage(1);
};

  // DLS Handler Functions
  const handleDlsCallerSelection = (type: '1st' | '2nd') => {
    setDlsCallerType(type);
    setDlsStage(1);
  };

  const handleDlsNavigation = (stage: number) => {
    setDlsStage(stage);
  };

    const handleDlsEnd = () => {
      // Show case completion confirmation modal
      setShowCaseCompletionModal(true);
    };

  const confirmCaseCompletion = () => {
    setShowCaseCompletionModal(false);
    setShowDLS(false);
    setCurrentPage('summary'); // Navigate to Timeline Summary with Timestamps
  };

  const confirmToSummary = () => {
    setShowConfirmSummaryModal(false);
    setShowSummaryModal(true);
  };

  const handleSaveAndReturn = () => {
    setShowConfirmSummaryModal(false);
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  const renderSummaryPage = () => {
    return (
      <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-black font-bold text-lg">Case Summary</h3>
          {autoSaved && (
            <div className="flex items-center text-green-600 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Auto-saved
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Case Entry Information */}
          <div className="bg-white p-4 rounded border border-gray-400">
            <h4 className="text-lg font-bold mb-4 text-black">Case Entry Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-black">
              <div className="space-y-2">
                <div><strong>Case Number:</strong> 2024001</div>
                <div><strong>Date/Time:</strong> {new Date().toLocaleString()}</div>
                <div><strong>Location:</strong> {formData.location || 'Not specified'}</div>
                <div><strong>Phone Number:</strong> {formData.phoneNumber || 'Not specified'}</div>
                <div><strong>Problem:</strong> {formData.problem || 'Not specified'}</div>
                <div><strong>Chief Complaint:</strong> {formData.chiefComplaint || 'Not specified'}</div>
              </div>
              <div className="space-y-2">
                <div><strong>Protocol:</strong> 6 - Breathing Problems</div>
                <div><strong>Age:</strong> {formData.age || 'Not specified'}</div>
                <div><strong>Gender:</strong> {formData.gender || 'Not specified'}</div>
                <div><strong>With Patient:</strong> {formData.withPatient || 'Not specified'}</div>
                <div><strong>Conscious:</strong> {formData.conscious || 'Not specified'}</div>
                <div><strong>Breathing:</strong> {formData.breathing || 'Not specified'}</div>
              </div>
            </div>
            {formData.notes && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div><strong>Additional Notes:</strong> {formData.notes}</div>
              </div>
            )}
          </div>

          {/* Dispatcher Information */}
          <div className="bg-gray-50 p-4 rounded border border-gray-400">
            <h4 className="text-lg font-bold mb-4 text-black">Dispatcher Information</h4>
            <div className="grid grid-cols-3 gap-4 text-sm text-black">
              <div><strong>Dispatcher Name:</strong> John Supervisor</div>
              <div><strong>ID:</strong> PED001</div>
              <div><strong>Unit:</strong> MECC HUMS</div>
            </div>
          </div>

          {/* Timeline Summary with Timestamps */}
          <div className="bg-blue-50 p-4 rounded border">
            <h4 className="text-lg font-bold mb-3 text-black">Timeline Summary with Timestamps</h4>
            <div className="space-y-4">
              {/* Case Entry Started */}
              <div className="flex items-start gap-4 pb-3 border-b border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-mono font-bold text-black leading-none">
                    {new Date(Date.now() - 600000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div className="text-xs font-mono text-gray-600 mt-1">
                    {new Date(Date.now() - 600000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-black text-lg">Case Entry Started</div>
                  <div className="text-sm text-black mt-1">Initial case information collected</div>
                </div>
              </div>
              
              {/* Key Questions Completed */}
              <div className="flex items-start gap-4 pb-3 border-b border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-mono font-bold text-black leading-none">
                    {new Date(Date.now() - 480000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div className="text-xs font-mono text-gray-600 mt-1">
                    {new Date(Date.now() - 480000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-red-600 text-lg">Key Questions Completed</div>
                  <div className="text-sm text-black mt-1">
                    <span className="font-bold text-red-600">Protocol 6 - Breathing Problems</span>
                    <br />• Q1: Patient alert status - <span className="font-bold">{kqAnswers.question1 || 'Not answered'}</span>
                    {kqAnswers.question2 && <><br />• Q2: Difficulty speaking - <span className="font-bold text-red-600">{kqAnswers.question2}</span></>}
                    {kqAnswers.question3 && <><br />• Q3: Changing color - <span className="font-bold text-red-600">{kqAnswers.question3}</span></>}
                    {kqAnswers.question4 && <><br />• Q4: Clammy/cold sweats - <span className="font-bold">{kqAnswers.question4}</span></>}
                    {kqAnswers.question5 && <><br />• Q5: Asthma/lung problems - <span className="font-bold">{kqAnswers.question5}</span></>}
                    {kqAnswers.question6 && <><br />• Q6: Special equipment - <span className="font-bold">{kqAnswers.question6}</span></>}
                  </div>
                </div>
              </div>

              {/* Dispatch Determination */}
              {selectedDeterminant && (
                <div className="flex items-start gap-4 pb-3 border-b border-gray-200">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-mono font-bold text-red-600 leading-none">
                      {new Date(Date.now() - 420000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </div>
                    <div className="text-xs font-mono text-gray-600 mt-1">
                      {new Date(Date.now() - 420000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-red-600 text-lg">DISPATCH DETERMINATION</div>
                    <div className="text-sm text-black mt-1">
                      Determinant: <span className="font-bold text-red-700 bg-red-100 px-2 py-1 rounded">{selectedDeterminant}</span>
                      <br />Ambulances dispatched: <span className="font-bold text-red-600">{selectedAmbulances.join(', ') || 'None'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Post-Dispatch Instructions */}
              <div className="flex items-start gap-4 pb-3 border-b border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-mono font-bold text-black leading-none">
                    {new Date(Date.now() - 360000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div className="text-xs font-mono text-gray-600 mt-1">
                    {new Date(Date.now() - 360000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-black text-lg">Post-Dispatch Instructions</div>
                  <div className="text-sm text-black mt-1">
                    PDI instructions provided to caller
                    <br />• <span className="font-bold text-red-600">Ambulance dispatch confirmed</span>
                    • Instructions given for breathing problems
                  </div>
                </div>
              </div>

              {/* Dispatch Life Support */}
              <div className="flex items-start gap-4 pb-3 border-b border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-mono font-bold text-black leading-none">
                    {new Date(Date.now() - 180000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div className="text-xs font-mono text-gray-600 mt-1">
                    {new Date(Date.now() - 180000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-black text-lg">Dispatch Life Support</div>
                  <div className="text-sm text-black mt-1">
                    DLS instructions completed
                    <br />• {dlsCallerType === '1st' ? '1st Party' : dlsCallerType === '2nd' ? '2nd Party' : 'Standard'} caller protocol followed
                    • Case monitoring until arrival
                  </div> 
                </div>
              </div>

              {/* Case Completed */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-mono font-bold text-black leading-none">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div className="text-xs font-mono text-gray-600 mt-1">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-green-600 text-lg">CASE COMPLETED</div>
                  <div className="text-sm text-black mt-1">All protocols completed successfully</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-yellow-50 p-4 rounded border">
            <h4 className="text-lg font-bold mb-3 text-black">Key Metrics</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">10:00</div>
                <div className="text-sm text-black">Total Case Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">2:30</div>
                <div className="text-sm text-black">Time to Dispatch</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{selectedAmbulances.length || 0}</div>
                <div className="text-sm text-black">Units Dispatched</div>
              </div>
            </div>
          </div>

          {/* Main Points Highlighted */}
          <div className="bg-red-50 p-4 rounded border border-red-200">
            <h4 className="text-lg font-bold mb-3 text-red-800">Critical Points Summary</h4>
            <ul className="space-y-2 text-sm text-black">
              {kqAnswers.question1 === 'no' && (
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <span className="text-black"><strong>CRITICAL:</strong> Patient not alert - Immediate dispatch required</span>
                </li>
              )}
              {kqAnswers.question2 === 'yes' && (
                <li className="flex items-center">
                  <span className="text-orange-600 mr-2">⚠️</span>
                  <span className="text-black"><strong>HIGH PRIORITY:</strong> Difficulty speaking between breaths</span>
                </li>
              )}
              {kqAnswers.question3 === 'yes' && (
                <li className="flex items-center">
                  <span className="text-orange-600 mr-2">⚠️</span>
                  <span className="text-black"><strong>HIGH PRIORITY:</strong> Patient changing color</span>
                </li>
              )}
              {selectedDeterminant && (
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">🚨</span>
                  <span className="text-black"><strong>DISPATCH LEVEL:</strong> {selectedDeterminant} - {selectedDeterminant.includes('E') ? 'ECHO (Highest Priority)' : selectedDeterminant.includes('D') ? 'DELTA (High Priority)' : selectedDeterminant.includes('C') ? 'CHARLIE (Medium Priority)' : 'Standard Priority'}</span>
                </li>
              )}
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span className="text-black"><strong>PROTOCOL COMPLETE:</strong> All required instructions provided to caller</span>
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">📋</span>
                <span className="text-black"><strong>DOCUMENTATION:</strong> Case fully documented with timestamps</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowConfirmSummaryModal(true)}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg shadow-lg"
            >
              Save Case & Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderKqQuestion = () => {
    const baseClasses = "bg-[#D3D3D3] rounded shadow-sm p-4";
    
        return (
  <div className={baseClasses}>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-black font-bold text-lg">
          Key Questions (KQ)
        </h3>
        <p className="text-black text-sm mt-1">
          6 - Breathing Problems Protocol (Question {currentKqPage})
        </p>
      </div>
      <div className="flex items-center gap-4">
        {autoSaved && (
          <div className="flex items-center text-green-600 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Auto-saved
          </div>
        )}
      </div>
    </div>
          

        {/* Question Answers Content */}
        <div className="space-y-6">
          {/* Question 1 */}
          {currentKqPage === 1 && (
            <div className="bg-white p-4 rounded border border-gray-400">
              <div className="flex items-center justify-between">
                <div className="text-black font-medium">
                  1. Is he/she completely alert (responding appropriately)?
                </div>
                <div className="w-32">
                  <select
                    value={kqAnswers.question1}
                    onChange={(e) => handleKqAnswer('question1', e.target.value)}
                    className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                  >
                    <option value="">Select...</option>
                    <option value="yes">YES</option>
                    <option value="no">NO</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 bg-gray-100 p-2 rounded">
                <span className="text-sm text-gray-700 font-medium">
                  Caller statement: {formData.problem}
                </span>
              </div>
              {kqAnswers.question1 === 'no' && (
                <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded">
                  <span className="text-red-800 font-medium">
                    → INEFFECTIVE BREATHING and Not alert - Proceed to immediate dispatch
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Question 2 */}
          {currentKqPage === 2 && kqAnswers.question1 === 'yes' && (
            <div className="bg-white p-4 rounded border border-gray-400">
              <div className="flex items-center justify-between">
                <div className="text-black font-medium">
                  2. Does he/she have difficulty speaking/crying between breaths?
                </div>
                <div className="w-32">
                  <select
                    value={kqAnswers.question2}
                    onChange={(e) => handleKqAnswer('question2', e.target.value)}
                    className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                  >
                    <option value="">Select...</option>
                    <option value="yes">YES</option>
                    <option value="no">NO</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 bg-gray-100 p-2 rounded">
                <span className="text-sm text-gray-700 font-medium">
                  Caller statement: {formData.problem}
                </span>
              </div>
              
              {kqAnswers.question2 === 'yes' && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                  <div className="text-black font-medium mb-2">a. Describe the color change:</div>
                  <input
                    type="text"
                    value={kqAnswers.question2a}
                    onChange={(e) => handleKqAnswer('question2a', e.target.value)}
                    className="w-full border border-gray-400 px-2 py-1 h-8 bg-white text-black mb-3"
                    placeholder="Describe color change..."
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-black font-medium">i. (Tracheostomy) Is he/she in obvious distress?</div>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="question2i"
                          value="yes"
                          checked={kqAnswers.question2i === 'yes'}
                          onChange={(e) => handleKqAnswer('question2i', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-black font-medium">YES</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="question2i"
                          value="no"
                          checked={kqAnswers.question2i === 'no'}
                          onChange={(e) => handleKqAnswer('question2i', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-black font-medium">NO</span>
                      </label>
                    </div>
                  </div>
                  
                  {kqAnswers.question2i === 'yes' && (
                    <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded">
                      <span className="text-orange-800 font-medium">→ Jump to Question 5</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Question 3 */}
          {currentKqPage === 3 && kqAnswers.question1 === 'yes' && kqAnswers.question2i !== 'yes' && (
            <div className="bg-white p-4 rounded border border-gray-400">
              <div className="flex items-center justify-between">
                <div className="text-black font-medium">
                  3. (Not 1st party) Is he/she changing color?
                </div>
                <div className="w-32">
                  <select
                    value={kqAnswers.question3}
                    onChange={(e) => handleKqAnswer('question3', e.target.value)}
                    className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                  >
                    <option value="">Select...</option>
                    <option value="yes">YES</option>
                    <option value="no">NO</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 bg-gray-100 p-2 rounded">
                <span className="text-sm text-gray-700 font-medium">
                  Caller statement: {formData.problem}
                </span>
              </div>
              
              {kqAnswers.question3 === 'yes' && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                  <div className="text-black font-medium mb-2">a. Describe the color change:</div>
                  <input
                    type="text"
                    value={kqAnswers.question3a}
                    onChange={(e) => handleKqAnswer('question3a', e.target.value)}
                    className="w-full border border-gray-400 px-2 py-1 h-8 bg-white text-black"
                    placeholder="Describe color change..."
                  />
                </div>
              )}
            </div>
          )}

          {/* Question 4 */}
          {currentKqPage === 4 && (kqAnswers.question1 === 'yes' || hasDispatchedFromQ1) && kqAnswers.question2i !== 'yes' && (
            <div className="bg-white p-4 rounded border border-gray-400">
              <div className="flex items-center justify-between">
                <div className="text-black font-medium">
                  4. Is he/she clammy or having cold sweats?
                </div>
                <div className="w-32">
                  <select
                    value={kqAnswers.question4}
                    onChange={(e) => handleKqAnswer('question4', e.target.value)}
                    className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                  >
                    <option value="">Select...</option>
                    <option value="yes">YES</option>
                    <option value="no">NO</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 bg-gray-100 p-2 rounded">
                <span className="text-sm text-gray-700 font-medium">
                  Caller statement: {formData.problem}
                </span>
              </div>
            </div>
          )}

          {/* Question 5 */}
          {currentKqPage === 5 && (kqAnswers.question1 === 'yes' || hasDispatchedFromQ1) && (
            <div className="bg-white p-4 rounded border border-gray-400">
              <div className="flex items-center justify-between">
                <div className="text-black font-medium">
                  5. Does he/she have asthma or other lung problems?
                </div>
                <div className="w-32">
                  <select
                    value={kqAnswers.question5}
                    onChange={(e) => handleKqAnswer('question5', e.target.value)}
                    className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                  >
                    <option value="">Select...</option>
                    <option value="yes">YES</option>
                    <option value="no">NO</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 bg-gray-100 p-2 rounded">
                <span className="text-sm text-gray-700 font-medium">
                  Caller statement: {formData.problem}
                </span>
              </div>
              
              {kqAnswers.question5 === 'yes' && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-black font-medium">a. Does he/she have a prescribed inhaler?</div>
                    <div className="w-32">
                      <select
                        value={kqAnswers.question5a}
                        onChange={(e) => handleKqAnswer('question5a', e.target.value)}
                        className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                      >
                        <option value="">Select...</option>
                        <option value="yes">YES</option>
                        <option value="no">NO</option>
                      </select>
                    </div>
                  </div>
                  
                  {kqAnswers.question5a === 'yes' && (
                    <div className="flex items-center justify-between">
                      <div className="text-black font-medium">i. Has he/she used it yet?</div>
                      <div className="w-32">
                        <select
                          value={kqAnswers.question5i}
                          onChange={(e) => handleKqAnswer('question5i', e.target.value)}
                          className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                        >
                          <option value="">Select...</option>
                          <option value="yes">YES</option>
                          <option value="no">NO</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Question 6 */}
          {currentKqPage === 6 && kqAnswers.question1 === 'yes' && (
            <div className="bg-white p-4 rounded border border-gray-400">
              <div className="flex items-center justify-between">
                <div className="text-black font-medium">
                  6. (Tracheostomy blockage) Does he/she have any special equipment or instructions to treat this?
                </div>
                <div className="w-32">
                  <select
                    value={kqAnswers.question6}
                    onChange={(e) => handleKqAnswer('question6', e.target.value)}
                    className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                  >
                    <option value="">Select...</option>
                    <option value="yes">YES</option>
                    <option value="no">NO</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 bg-gray-100 p-2 rounded">
                <span className="text-sm text-gray-700 font-medium">
                  Caller statement: {formData.problem}
                </span>
              </div>
              
              {kqAnswers.question6 === 'yes' && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                  <div className="flex items-center justify-between">
                    <div className="text-black font-medium">a. Have they been used?</div>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="question6a"
                          value="yes"
                          checked={kqAnswers.question6a === 'yes'}
                          onChange={(e) => handleKqAnswer('question6a', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-black font-medium">YES</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="question6a"
                          value="no"
                          checked={kqAnswers.question6a === 'no'}
                          onChange={(e) => handleKqAnswer('question6a', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-black font-medium">NO</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleKqBack}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          {currentKqPage < 6 ? (
            <button
              onClick={handleKqNext}
              disabled={!canProceedToNext()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {(kqAnswers.question1 === 'no' && currentKqPage === 1) ? 'Proceed to PDI' : 'Confirm & Continue →'}
            </button>
          ) : (
            <button
              onClick={handleKqComplete}
              disabled={!canProceedToNext()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {(hasDispatchedFromQ1 || dispatchComplete) ? 'Proceed to PDI' : 'Complete KQ / Determine Dispatch'}
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 border-t pt-4">
          <div className="flex border-b border-gray-300">
            <button 
              onClick={() => setCurrentKqTab('question-answers')}
              className={`px-4 py-2 ${currentKqTab === 'question-answers' ? 'border-b-2 border-blue-500 bg-white text-black font-medium' : 'text-black hover:bg-gray-100'}`}
            >
              Question Answers
            </button>
            <button 
              onClick={() => setCurrentKqTab('additional-info')}
              className={`px-4 py-2 ${currentKqTab === 'additional-info' ? 'border-b-2 border-blue-500 bg-white text-black font-medium' : 'text-black hover:bg-gray-100'}`}
            >
              Additional Information
            </button>
            <button 
              onClick={() => setCurrentKqTab('determinants')}
              className={`px-4 py-2 ${currentKqTab === 'determinants' ? 'border-b-2 border-blue-500 bg-white text-black font-medium' : 'text-black hover:bg-gray-100'}`}
            >
              Determinants/Suffixes
            </button>
            <button 
              onClick={() => setCurrentKqTab('det-codes')}
              className={`px-4 py-2 ${currentKqTab === 'det-codes' ? 'border-b-2 border-blue-500 bg-white text-black font-medium' : 'text-black hover:bg-gray-100'}`}
            >
              Det. Codes
            </button>
          </div>

          {/* Question Answers Tab Content */}
          {currentKqTab === 'question-answers' && (
            <div className="bg-white p-4 rounded shadow mt-4">
              <h3 className="text-black font-bold text-lg mb-4">Questions and Answers Summary</h3>
              <div className="space-y-4 text-black">
                {/* Only show questions that have been answered */}
                {kqAnswers.question1 && (
                  <div className="border-b pb-2">
                    <p className="font-bold">Q1: Is he/she completely alert (responding appropriately)?</p>
                    <p className="ml-4 mt-1">Answer: {kqAnswers.question1}</p>
                  </div>
                )}

                {kqAnswers.question2 && (
                  <div className="border-b pb-2">
                    <p className="font-bold">Q2: Does he/she have difficulty speaking/crying between breaths?</p>
                    <p className="ml-4 mt-1">Answer: {kqAnswers.question2}</p>
                    {kqAnswers.question2a && (
                      <p className="ml-4">Color change: {kqAnswers.question2a}</p>
                    )}
                    {kqAnswers.question2i && (
                      <p className="ml-4">Obvious distress: {kqAnswers.question2i}</p>
                    )}
                  </div>
                )}

                {kqAnswers.question3 && (
                  <div className="border-b pb-2">
                    <p className="font-bold">Q3: Is he/she changing color?</p>
                    <p className="ml-4 mt-1">Answer: {kqAnswers.question3}</p>
                    {kqAnswers.question3a && (
                      <p className="ml-4">Color change: {kqAnswers.question3a}</p>
                    )}
                  </div>
                )}

                {kqAnswers.question4 && (
                  <div className="border-b pb-2">
                    <p className="font-bold">Q4: Is he/she clammy or having cold sweats?</p>
                    <p className="ml-4 mt-1">Answer: {kqAnswers.question4}</p>
                  </div>
                )}

                {kqAnswers.question5 && (
                  <div className="border-b pb-2">
                    <p className="font-bold">Q5: Does he/she have asthma or other lung problems?</p>
                    <p className="ml-4 mt-1">Answer: {kqAnswers.question5}</p>
                    {kqAnswers.question5a && (
                      <p className="ml-4">Has prescribed inhaler: {kqAnswers.question5a}</p>
                    )}
                    {kqAnswers.question5i && (
                      <p className="ml-4">Has used inhaler: {kqAnswers.question5i}</p>
                    )} 
                  </div>
                )}

                {kqAnswers.question6 && (
                  <div className="border-b pb-2">
                    <p className="font-bold">Q6: Does he/she have any special equipment or instructions to treat this?</p>
                    <p className="ml-4 mt-1">Answer: {kqAnswers.question6}</p>
                    {kqAnswers.question6a && (
                      <p className="ml-4">Equipment used: {kqAnswers.question6a}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information Tab Content */}
          {currentKqTab === 'additional-info' && (
            <div className="bg-white p-4 rounded shadow mt-4">
              <h3 className="text-green-700 font-bold mb-3">DIFFICULTY SPEAKING BETWEEN BREATHS</h3>
              <p className="text-black mb-2">Can also be described as:</p>
              <ul className="list-disc pl-6 mb-4 text-black">
                <li>Unable to <span className="font-bold">complete a full sentence</span> without taking a breath</li>
                <li>Only able to <span className="font-bold">speak a few words</span> without taking a breath</li>
                <li>Breathing attempts that <span className="font-bold">severely hinder</span> crying in infants and small children</li>
              </ul>

              <h3 className="text-green-700 font-bold mb-3">CHANGING COLOR</h3>
              <p className="text-black mb-2">Changing colors of <span className="font-bold">clinical significance</span> include:</p>
              <ul className="list-disc pl-6 mb-2 text-black">
                <li><span className="font-bold">Ashen/Gray</span></li>
                <li><span className="font-bold">Blue/Cyanotic/Purple</span></li>
                <li><span className="font-bold">Mottled</span></li>
              </ul>
              <p className="text-red-600 text-sm">
                (Pale, pink, and red are not colors of clinical significance in the dispatch environment and will not, alone, 
                change the Dispatch Priority. These answer choices in ProQA enable further study. Callers failing to initially 
                identify a listed color should not be coached by asking unlisted clarifiers such as "Well, is she gray?")
              </p>

              <h3 className="text-green-700 font-bold mb-3 mt-4">Confront Problem Suffix</h3>
              <p className="text-black text-sm mb-3">
                The suffix code may be used to delineate the presence of this condition regardless of the patient's acuity 
                and may be used to track patient outcomes or send correctly equipped responders.
              </p>
              
              <div className="text-black text-sm">
                <span className="text-red-600">A</span> = Asthma<br />
                <span className="text-red-600">E</span> = <span className="font-bold">COPD</span> (Emphysema/Chronic bronchitis)<br />
                <span className="text-red-600">O</span> = Other lung problems
              </div>
            </div>
          )}

          {/* Determinants/Suffixes Tab Content */}
          {currentKqTab === 'determinants' && (
            <div className="bg-white p-4 rounded shadow mt-4">
              <h3 className="text-black font-bold text-lg mb-4">Determinants/Suffixes & Det. Codes</h3>
              
              {/* Traditional Table Layout matching original image */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  {/* Table Header */}
                  <thead>
                    <tr>
                      <th className="text-left p-2 text-black font-bold border-b">LEVELS</th>
                      <th className="text-left p-2 text-black font-bold border-b"># DETERMINANT DESCRIPTORS</th>
                      <th className="text-center p-2 text-black font-bold border-b">✱ A E O</th>
                      <th className="text-center p-2 text-black font-bold border-b">CODES</th>
                      <th className="text-center p-2 text-black font-bold border-b">RESPONSES</th>
                      <th className="text-center p-2 text-black font-bold border-b">MODES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Level E Row */}
                    <tr className="bg-purple-50">
                      <td className="p-3 border-b">
                        <div className="flex items-center">
                          <div className="text-4xl font-bold text-purple-700 bg-purple-200 rounded w-12 h-12 flex items-center justify-center mr-3">E</div>
                        </div>
                      </td>
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <div className="font-bold">1 INEFFECTIVE BREATHING</div>
                          <div className="text-xs ml-4 mt-1">✱ (Not to be selected from Case Entry only)</div>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-E-1</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>

                    {/* Level D Rows */}
                    <tr className="bg-red-50">
                      <td className="p-3 border-b" rowSpan={5}>
                        <div className="flex items-center">
                          <div className="text-4xl font-bold text-red-700 bg-red-200 rounded w-12 h-12 flex items-center justify-center mr-3">D</div>
                        </div>
                      </td>
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">1</span> <span className="font-normal">Not alert</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-D-1</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">2</span> <span className="font-bold">DIFFICULTY SPEAKING BETWEEN BREATHS</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-D-2</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">3</span> <span className="font-bold">CHANGING COLOR</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-D-3</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">4</span> <span className="font-normal">Clammy or cold sweats</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-D-4</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">5</span> <span className="font-normal">Tracheostomy</span> <span className="text-xs text-black">(obvious distress)</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-D-5</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>

                    {/* Level C Rows */}
                    <tr className="bg-yellow-50">
                      <td className="p-3 border-b" rowSpan={2}>
                        <div className="flex items-center">
                          <div className="text-4xl font-bold text-yellow-700 bg-yellow-200 rounded w-12 h-12 flex items-center justify-center mr-3">C</div>
                        </div>
                      </td>
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">1</span> <span className="font-normal">Abnormal breathing</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-C-1</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">2</span> <span className="font-normal">Tracheostomy</span> <span className="text-xs text-black">(no obvious distress)</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-C-2</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Det. Codes Tab Content */}
          {currentKqTab === 'det-codes' && (
            <div className="bg-white p-4 rounded shadow mt-4">
              <h3 className="text-black font-bold text-lg mb-4">Determinants/Suffixes & Det. Codes</h3>
              
              {/* Traditional Table Layout matching original image */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  {/* Table Header */}
                  <thead>
                    <tr>
                      <th className="text-left p-2 text-black font-bold border-b">LEVELS</th>
                      <th className="text-left p-2 text-black font-bold border-b"># DETERMINANT DESCRIPTORS</th>
                      <th className="text-center p-2 text-black font-bold border-b">✱ A E O</th>
                      <th className="text-center p-2 text-black font-bold border-b">CODES</th>
                      <th className="text-center p-2 text-black font-bold border-b">RESPONSES</th>
                      <th className="text-center p-2 text-black font-bold border-b">MODES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Level E Row */}
                    <tr className="bg-purple-50">
                      <td className="p-3 border-b">
                        <div className="flex items-center">
                          <div className="text-4xl font-bold text-purple-700 bg-purple-200 rounded w-12 h-12 flex items-center justify-center mr-3">E</div>
                        </div>
                      </td>
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <div className="font-bold">1 INEFFECTIVE BREATHING</div>
                          <div className="text-xs ml-4 mt-1">✱ (Not to be selected from Case Entry only)</div>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-E-1</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>

                    {/* Level D Rows */}
                    <tr className="bg-red-50">
                      <td className="p-3 border-b" rowSpan={5}>
                        <div className="flex items-center">
                          <div className="text-4xl font-bold text-red-700 bg-red-200 rounded w-12 h-12 flex items-center justify-center mr-3">D</div>
                        </div>
                      </td>
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">1</span> <span className="font-normal">Not alert</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-D-1</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">2</span> <span className="font-bold">DIFFICULTY SPEAKING BETWEEN BREATHS</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-D-2</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">3</span> <span className="font-bold">CHANGING COLOR</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-D-3</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">4</span> <span className="font-normal">Clammy or cold sweats</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-D-4</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">5</span> <span className="font-normal">Tracheostomy</span> <span className="text-xs text-black">(obvious distress)</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-D-5</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>

                    {/* Level C Rows */}
                    <tr className="bg-yellow-50">
                      <td className="p-3 border-b" rowSpan={2}>
                        <div className="flex items-center">
                          <div className="text-4xl font-bold text-yellow-700 bg-yellow-200 rounded w-12 h-12 flex items-center justify-center mr-3">C</div>
                        </div>
                      </td>
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">1</span> <span className="font-normal">Abnormal breathing</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-C-1</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="p-3 border-b">
                        <div className="text-sm text-black">
                          <span className="font-bold">2</span> <span className="font-normal">Tracheostomy</span> <span className="text-xs text-black">(no obvious distress)</span>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center text-black font-medium">6-C-2</td>
                      <td className="p-3 border-b text-center"></td>
                      <td className="p-3 border-b text-center"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPdiPage = () => {
    return (
      <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-black font-bold text-lg">Post-Dispatch Instructions (PDI)</h3>
          {autoSaved && (
            <div className="flex items-center text-green-600 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Auto-saved
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Instruction a */}
          <div className="bg-white p-4 rounded border border-gray-400">
            <div className="flex items-center justify-between">
              <div className="text-black flex-1">
                <span className="font-bold">a.</span> I'm sending the paramedics (ambulance) to help you now. Stay on the line and I'll tell you exactly what to do next.
              </div>
              <input
                type="checkbox"
                checked={checkedItems.a || false}
                onChange={() => {
                  handleCheckboxChange('a');
                  if (!checkedItems.a) {
                    setShowPdiFollowUp(true);
                  }
                }}
                className="ml-4 w-5 h-5 border-2 border-gray-400"
              />
            </div>
          </div>

          {/* Follow-up options for instruction a - Now independent buttons */}
          {checkedItems.a && (
            <div className="ml-6 flex gap-4 items-start">
              <button 
                onClick={() => {
                  // Mark button as selected
                  setSelectedButtons(prev => ({
                    ...prev,
                    'pdi-xcard': true
                  }));
                  // Immediately show exit modal
                  setShowExitModal(true);
                }} 
                className={selectedButtons['pdi-xcard'] ? 
                  "text-left px-4 py-2 bg-blue-200 text-blue-800 border border-purple-400 rounded hover:bg-blue-300" : 
                  "text-left px-4 py-2 bg-purple-100 text-black border border-purple-400 rounded hover:bg-purple-200"
                }
              >
                X-CARD
              </button>
              <button 
                onClick={() => {
                  // Mark button as selected
                  setSelectedButtons(prev => ({
                    ...prev,
                    'pdi-followup': true
                  }));
                  // Clear any existing modal states to prevent conflicts
                  setShowCaseCompletionModal(false);
                  setShowExitModal(false);
                  setShowDLS(false);
                  // Go to CPR instructions
                  setCurrentCprStep('1');
                  setCurrentPage('cpr');
                }} 
                className={selectedButtons['pdi-followup'] ? 
                  "text-left px-4 py-2 bg-blue-200 text-blue-800 border border-green-400 rounded hover:bg-blue-300" : 
                  "text-left px-4 py-2 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200"
                }
              >
                Follow up
              </button>
            </div>
          )}

          {/* Instruction b */}
          <div className="bg-white p-4 rounded border border-gray-400">
            <div className="flex items-center justify-between">
              <div className="text-black flex-1">
                <span className="font-bold">b.</span> <span className="font-bold">( &gt;1,E-1 or D-1,2,3)</span> If there is a defibrillator (AED) available, send someone to get it now in case we need it later.
              </div>
              <input
                type="checkbox"
                checked={checkedItems.b || false}
                onChange={() => handleCheckboxChange('b')}
                className="ml-4 w-5 h-5 border-2 border-gray-400"
              />
            </div>
          </div>

          {/* Instruction c */}
          <div className="bg-white p-4 rounded border border-gray-400">
            <div className="flex items-center justify-between">
              <div className="text-black flex-1">
                <span className="font-bold">c.</span> <span className="font-bold">(Asthma or other lung problems)</span> 
                If s/he has a prescribed inhaler or nebulizer for these attacks, tell her/him to use it now/again.
              </div>
              <input
                type="checkbox"
                checked={checkedItems.c || false}
                onChange={() => handleCheckboxChange('c')}
                className="ml-4 w-5 h-5 border-2 border-gray-400"
              />
            </div>
          </div>

          {/* Instruction d */}
          <div className="bg-white p-4 rounded border border-gray-400">
            <div className="flex items-center justify-between">
              <div className="text-black flex-1">
                <span className="font-bold">d.</span> <span className="font-bold">(Patient medications as requested and Alert)</span> 
                Remind her/him to do what her/his doctor has instructed for these situations.
              </div>
              <input
                type="checkbox"
                checked={checkedItems.d || false}
                onChange={() => handleCheckboxChange('d')}
                className="ml-4 w-5 h-5 border-2 border-gray-400"
              />
            </div>
          </div>

          {/* Instruction e */}
          <div className="bg-white p-4 rounded border border-gray-400">
            <div className="flex items-center justify-between">
              <div className="text-black flex-1">
                <span className="font-bold">e.</span> <span className="font-bold">(Special equipment/instructions not yet used)</span> 
                Use those instructions now.
              </div>
              <input
                type="checkbox"
                checked={checkedItems.e || false}
                onChange={() => handleCheckboxChange('e')}
                className="ml-4 w-5 h-5 border-2 border-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Diagnostic Tool Information - Special Box */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <h4 className="text-blue-800 font-bold mb-3">Diagnostic Tool Information:</h4>
          <div className="text-blue-800">
            <span className="font-bold">*</span> Utilize the Aspirin Diagnostic & Instruction Tool - if authorized by local Medical Control and the chest pain/discomfort 
            <span className="font-bold">(Heart Attack Symptoms)</span> patient is alert, ≥ 16 years old, and has no reported STROKE symptoms.
          </div>
        </div>

          
        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleGoBack}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            onClick={() => {
              if (checkedItems.a || checkedItems.b || checkedItems.c || checkedItems.d || checkedItems.e) {
                // If only instruction a is checked, user must choose either X-CARD or Follow up
                if (checkedItems.a && !checkedItems.b && !checkedItems.c && !checkedItems.d && !checkedItems.e) {
                  if (!selectedButtons['pdi-xcard'] && !selectedButtons['pdi-followup']) {
                    alert('Please select either X-CARD or Follow up option for instruction a');
                    return;
                  }
                  // If X-CARD was selected, show exit modal immediately
                  if (selectedButtons['pdi-xcard']) {
                    setShowExitModal(true);
                    return;
                  }
                }
                // If Follow up was selected, go to CPR
                if (selectedButtons['pdi-followup']) {
                  setCurrentCprStep('1');
                  setCurrentPage('cpr');
                  return;
                }
                // If other instructions are checked without instruction a, proceed to CPR
                if (!checkedItems.a && (checkedItems.b || checkedItems.c || checkedItems.d || checkedItems.e)) {
                  setCurrentCprStep('1');
                  setCurrentPage('cpr');
                  return;
                }
                // Default case: if instruction a is not exclusively checked, go to CPR
                setCurrentCprStep('1');
                setCurrentPage('cpr');
              } else {
                alert('Please check at least one instruction above to proceed');
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Complete PDI
          </button>
        </div>
      </div>
    );
  };

  const renderDLS = () => {
    if (!dlsCallerType) {
      return (
        <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-black font-bold text-lg">DLS - Dispatch Life Support (X-Card)</h3>
          </div>
          
          <div className="bg-white p-4 rounded border border-gray-400 mb-4">
            <h4 className="text-black font-bold text-lg mb-4">Select Caller Type:</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleButtonClick('dls-1st-party', () => handleDlsCallerSelection('1st'))} 
                className={getButtonClass('dls-1st-party', "px-6 py-4 bg-blue-100 text-black border border-blue-400 rounded hover:bg-blue-200 text-center font-semibold")}
              >
                1st Party Caller
              </button>
              <button 
                onClick={() => handleButtonClick('dls-2nd-party', () => handleDlsCallerSelection('2nd'))} 
                className={getButtonClass('dls-2nd-party', "px-6 py-4 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200 text-center font-semibold")}
              >
                2nd Party Caller
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 1st Party Caller Flow
    if (dlsCallerType === '1st') {
      switch (dlsStage) {
        case 1:
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">1st Party Caller - Stage 1</h3>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">(<span className="text-blue-600 font-bold">Help is on the way.</span>)</p>
                <p className="text-black mb-2">From now on, <span className="font-bold">don't have anything to eat or drink</span>. It might make you sick or cause further problems.</p>
                <p className="text-black mb-2">(<span className="text-green-600 font-bold">MEDICAL</span>) Just <span className="font-bold">rest in the most comfortable position</span> for you.</p>
                <p className="text-black mb-2">(<span className="text-red-600 font-bold">TRAUMA</span>) <span className="font-bold">Don't move around</span> unless it's absolutely necessary. Just be still and wait for help to arrive.</p>
                <p className="text-gray-600 text-sm italic mb-4">*The "nothing to eat or drink" instruction above should be omitted for the alert diabetic.</p>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => handleButtonClick('dls-1st-s2', () => handleDlsNavigation(2))} 
                    className={getButtonClass('dls-1st-s2', "block w-full text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                  >
                    Stable - Routine Disconnect → 2
                  </button>
                  <button 
                    onClick={() => handleButtonClick('dls-1st-s3a', () => handleDlsNavigation(3))} 
                    className={getButtonClass('dls-1st-s3a', "block w-full text-left px-4 py-2 bg-yellow-100 text-black border border-yellow-400 rounded hover:bg-yellow-200")}
                  >
                    Stable but Stay on Line → 3
                  </button>
                  <button 
                    onClick={() => handleButtonClick('dls-1st-s3b', () => handleDlsNavigation(3))} 
                    className={getButtonClass('dls-1st-s3b', "block w-full text-left px-4 py-2 bg-red-100 text-black border border-red-400 rounded hover:bg-red-200")}
                  >
                    Unstable or Not alert → 3
                  </button>
                </div>
              </div>
            </div>
          );

        case 2:
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">2. Routine Disconnect (stable) - 1st Party</h3>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">(I'm going to give you some instructions before I let you go.)</p>
                <p className="text-black mb-2">(<span className="text-blue-600 font-bold">Appropriate</span>) Before the responders arrive, please:</p>
                <ul className="text-black ml-6 mb-4">
                  <li>• <span className="font-bold">Put away any pets.</span></li>
                  <li>• <span className="font-bold">Gather your medications.</span></li>
                  <li>• <span className="font-bold">Unlock the door.</span></li>
                  <li>• <span className="font-bold">Turn on the outside lights or vehicle hazard lights.</span></li>
                </ul>
                <p className="text-black mb-2">(<span className="text-red-600 font-bold">Disconnect</span>) If anything changes, <span className="font-bold">call us back immediately</span> for further instructions.</p>
                <p className="text-gray-600 text-sm italic mb-4">*Use caution when advising 1st party callers to do anything that would unduly exert themselves if their condition is traumatic, unstable, or worsening.</p>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => handleButtonClick('dls-1st-stay', () => handleDlsNavigation(3))} 
                    className={getButtonClass('dls-1st-stay', "block w-full text-left px-4 py-2 bg-yellow-100 text-black border border-yellow-400 rounded hover:bg-yellow-200")}
                  >
                    Stay on Line → 3
                  </button>
                  <button 
                onClick={() => {
                  handleButtonClick('dls-1st-end', () => {});
                  setShowCaseCompletionModal(true);
                  setShowDLS(false);
                }} 
                className={getButtonClass('dls-1st-end', "block w-full text-left px-4 py-2 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200")}
              >
                End → Case completed, confirm to save the case?
              </button>
                </div>
              </div>
            </div>
          );

        case 3:
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">3. Stay on Line - 1st Party</h3>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">I'll <span className="font-bold">stay on the line</span> with you until help arrives.</p>
                <p className="text-black mb-2">If anything changes or gets worse, <span className="font-bold">tell me immediately</span>.</p>
                <p className="text-black mb-4">Let me know when the <span className="text-blue-600 font-bold">paramedics arrive</span>.</p>
                
                <div className="space-y-2">
                  <button 
            onClick={() => {
              console.log('=== DLS END BUTTON CLICKED ===');
              console.log('Current state before changes:');
              console.log('- showCaseCompletionModal:', showCaseCompletionModal);
              console.log('- showDLS:', showDLS);
              console.log('- currentPage:', currentPage);
              
              handleButtonClick('dls-1st-end-s3', () => {});
              
              console.log('About to set showCaseCompletionModal to true');
              setShowCaseCompletionModal(true);
              
              console.log('About to set showDLS to false');
              setShowDLS(false);
              
              // Add a small delay to check if states actually changed
              setTimeout(() => {
                console.log('State after 100ms:');
                console.log('- showCaseCompletionModal should be true');
                console.log('- showDLS should be false');
              }, 100);
              
              console.log('=== END BUTTON CLICK COMPLETE ===');
            }}
        className={getButtonClass('dls-1st-end-s3', "block w-full text-left px-4 py-2 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200")}
        >
        End → Case completed, confirm to save the case?
        </button>
                </div>
              </div>
            </div>
          );
      }
    }

    // 2nd Party Caller Flow
    if (dlsCallerType === '2nd') {
      switch (dlsStage) {
        case 1:
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">2nd Party Caller - Stage 1</h3>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">(<span className="text-blue-600 font-bold">Reassure her/him that help is on the way.</span>)</p>
                <p className="text-black mb-2">From now on, <span className="font-bold">don't let her/him have anything to eat or drink</span>. It might make her/him sick or cause further problems.</p>
                <p className="text-black mb-2">(<span className="text-green-600 font-bold">MEDICAL</span>) Just <span className="font-bold">let her/him rest in the most comfortable position</span> and wait for help to arrive.</p>
                <p className="text-black mb-2">(<span className="text-red-600 font-bold">TRAUMA</span>) <span className="font-bold">Don't move her/him</span> unless it's absolutely necessary. Just tell her/him to be still and wait for help to arrive.</p>
                <p className="text-gray-600 text-sm italic mb-4">*The "nothing to eat or drink" instruction above should be omitted for the alert diabetic.</p>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => handleButtonClick('dls-2nd-s2', () => handleDlsNavigation(2))} 
                    className={getButtonClass('dls-2nd-s2', "block w-full text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                  >
                    Stable - Routine Disconnect → 2
                  </button>
                  <button 
                    onClick={() => handleButtonClick('dls-2nd-s3a', () => handleDlsNavigation(3))} 
                    className={getButtonClass('dls-2nd-s3a', "block w-full text-left px-4 py-2 bg-yellow-100 text-black border border-yellow-400 rounded hover:bg-yellow-200")}
                  >
                    Stable but Stay on Line → 3
                  </button>
                  <button 
                    onClick={() => handleButtonClick('dls-2nd-s3b', () => handleDlsNavigation(3))} 
                    className={getButtonClass('dls-2nd-s3b', "block w-full text-left px-4 py-2 bg-red-100 text-black border border-red-400 rounded hover:bg-red-200")}
                  >
                    Unstable or Not alert → 3
                  </button>
                </div>
              </div>
            </div>
          );

        case 2:
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">2. Routine Disconnect (stable) - 2nd Party</h3>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">I want you to <span className="font-bold">watch her/him very closely</span>. If s/he becomes less awake and vomits, quickly <span className="font-bold">turn her/him on her/his side</span>.</p>
                <p className="text-black mb-2">(<span className="text-blue-600 font-bold">Appropriate</span>) Before the responders arrive, please:</p>
                <ul className="text-black ml-6 mb-4">
                  <li>• <span className="font-bold">Put away any pets.</span></li>
                  <li>• <span className="font-bold">Gather her/his medications.</span></li>
                  <li>• <span className="font-bold">Unlock the door.</span></li>
                  <li>• <span className="font-bold">Turn on the outside lights or vehicle hazard lights.</span></li>
                  <li>• <span className="font-bold">Have someone flag/wave down the paramedics.</span></li>
                </ul>
                <p className="text-black mb-4">If s/he gets worse in any way (or has another seizure), <span className="font-bold">call us back immediately</span> for further instructions.</p>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => handleButtonClick('dls-2nd-stay', () => handleDlsNavigation(3))} 
                    className={getButtonClass('dls-2nd-stay', "block w-full text-left px-4 py-2 bg-yellow-100 text-black border border-yellow-400 rounded hover:bg-yellow-200")}
                  >
                    Stay on Line → 3
                  </button>
                  <button 
          onClick={() => {
            handleButtonClick('dls-2nd-end', () => {});
            setShowCaseCompletionModal(true);
            setShowDLS(false);
          }} 
          className={getButtonClass('dls-2nd-end', "block w-full text-left px-4 py-2 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200")}
        >
          End → Case completed, confirm to save the case?
        </button>
                </div>
              </div>
            </div>
          );

        case 3:
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">3. Stay on Line - 2nd Party</h3>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">I'll <span className="font-bold">stay on the line</span> with you until help arrives.</p>
                <p className="text-black mb-2">Continue to <span className="font-bold">watch her/him closely</span>. If anything changes or gets worse, <span className="font-bold">tell me immediately</span>.</p>
                <p className="text-black mb-4">Let me know when the <span className="text-blue-600 font-bold">paramedics arrive</span>.</p>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      handleButtonClick('dls-2nd-end-s3', () => {});
                      handleDlsEnd();
                    }} 
                    className={getButtonClass('dls-2nd-end-s3', "block w-full text-left px-4 py-2 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200")}
                  >
                    End → Case completed, confirm to save the case?
                  </button>
                </div>
              </div>
            </div>
          );
      }
    }

    return null;
  };

  const renderCprInstructions = () => {
    const renderCurrentStep = () => {
      switch (currentCprStep) {
        case '1': 
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 1: Phone to Patient</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">If there is a <strong>defibrillator (AED)</strong> available, send someone to <strong>get it now</strong>, and tell me when you have it.</p>
                <p className="text-black mb-2">• <strong>Are you right by her/him now?</strong></p>
                <p className="text-black mb-2">(No) <strong>Get the phone as close to her/him as possible</strong>. Don't hang up. Do it now and tell me when it's done. (If I'm not here, <strong>stay on the line</strong>.)</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => handleButtonClick('step1-yes', () => setCurrentCprStep('2'))} 
                  className={getButtonClass('step1-yes', "px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                >
                  Yes
                </button>
                <button 
                  onClick={() => handleButtonClick('step1-no', () => setCurrentCprStep('2'))} 
                  className={getButtonClass('step1-no', "px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                >
                  No
                </button>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '2':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 2: Position Patient</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2"><strong>Listen carefully.</strong></p>
                <p className="text-black mb-2">(<strong>Not breathing</strong>) Lay her/him <strong>flat on her/his back</strong> on the floor/ground and <strong>remove any pillows</strong>.</p>
                <p className="text-black mb-2">(<strong>Breathing</strong>) Lay her/him <strong>flat on her/his back</strong> and <strong>remove any pillows</strong>.</p>
                <p className="text-black mb-2">(<strong>3rd TRIMESTER</strong>) Lay her on her <strong>left side</strong> (on the floor/ground if not breathing) and <strong>wedge a pillow behind her lower back</strong>.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => handleButtonClick('step2-not-breathing', () => setCurrentCprStep('4'))} 
                  className={getButtonClass('step2-not-breathing', "px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                >
                  Not Breathing/AGONAL/UNCERTAIN
                </button>
                <button 
                  onClick={() => handleButtonClick('step2-breathing', () => setCurrentCprStep('3'))} 
                  className={getButtonClass('step2-breathing', "px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                >
                  Breathing
                </button>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '3':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 3: Check Breathing</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">Now place your hand on her/his <strong>forehead</strong>, your other hand <strong>under her/his neck</strong>, then <strong>tilt the head back</strong>.</p>
                <p className="text-black mb-2">Put your <strong>ear next to her/his mouth</strong>. Can you <strong>feel or hear any breathing</strong>?</p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <button onClick={() => setCurrentCprStep('4')} className="px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">No</button>
                <button onClick={() => setCurrentCprStep('4')} className="px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">UNCERTAIN/Just a little</button>
                <button onClick={() => setCurrentCprStep('17')} className="px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">Yes</button>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '4':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 4: Pathway Director</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-4 font-bold">Select the most appropriate pathway below: (tick box)</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setCurrentCprStep('5')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Allergic reaction * Ventilations 1st
                  </button>
                  <button onClick={() => setCurrentCprStep('5')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Asthma/COPD * Ventilations 1st
                  </button>
                  <button onClick={() => setCurrentCprStep('5')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Drowning * Ventilations 1st
                  </button>
                  <button onClick={() => setCurrentCprStep('5')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Hanging * Ventilations 1st
                  </button>
                  <button onClick={() => setCurrentCprStep('5')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Lightning strike * Ventilations 1st
                  </button>
                  <button onClick={() => setCurrentCprStep('5')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Overdose/Poisoning * Ventilations 1st
                  </button>
                  <button onClick={() => setCurrentCprStep('5')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Severe trauma * Ventilations 1st
                  </button>
                  <button onClick={() => setCurrentCprStep('5')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Strangulation * Ventilations 1st
                  </button>
                  <button onClick={() => setCurrentCprStep('5')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Suffocation * Ventilations 1st
                  </button>
                  <button onClick={() => setCurrentCprStep('5')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Toxic inhalation * Ventilations 1st
                  </button>
                  <button onClick={() => setCurrentCprStep('6')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200 col-span-2">
                    Any other problems (if none of the above apply) * compression only/compression 1st
                  </button>
                  <button onClick={() => setCurrentCprStep('6')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200 col-span-2">
                    <strong>Unconscious choking</strong>
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '5':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 5: Start Mouth-to-Mouth</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">I am going to tell you how to give <strong>Mouth-to-Mouth</strong></p>

                {!showStep5Dialog ? (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleButtonClick('step5-yes-continue', handleStep5ContinueDialog)} 
                      className={getButtonClass('step5-yes-continue', "text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                    >
                      Yes - continue dialog
                    </button>
                    <button 
                      onClick={() => handleButtonClick('step5-no-mouth', handleStep5NoMouthToMouth)} 
                      className={getButtonClass('step5-no-mouth', "text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-300 rounded">
                      <p className="text-black text-sm">(Place your hand on her/his <strong>forehead</strong>, your other hand <strong>under her/his neck</strong>, then <strong>tilt the head back</strong>.) Now <strong>pinch her/his nose closed</strong> and completely <strong>cover her/his mouth with your mouth</strong>, then blow <strong>2 regular breaths</strong> into the lungs, about <strong>1 second each</strong>. The chest should <strong>rise with each breath</strong>. Did you feel the air going ?</p>
                    </div>

                    {step5DialogStage === 'yesno' && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleButtonClick('step5-dialog-yes', () => handleStep5YesNo('yes'))} 
                          className={getButtonClass('step5-dialog-yes', "text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => handleButtonClick('step5-dialog-no', () => handleStep5YesNo('no'))} 
                          className={getButtonClass('step5-dialog-no', "text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                        >
                          No
                        </button>
                      </div>
                    )}

                    {step5DialogStage === 'yes-options' && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleButtonClick('step5-yes-1st', () => setCurrentCprStep('6'))} 
                          className={getButtonClass('step5-yes-1st', "text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                        >
                          Yes - 1st cycle of CPR
                        </button>
                        <button 
                          onClick={() => handleButtonClick('step5-yes-continuing', () => setCurrentCprStep('9'))} 
                          className={getButtonClass('step5-yes-continuing', "text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                        >
                          Yes - Continuing CPR
                        </button>
                      </div>
                    )}

                    {step5DialogStage === 'no-options' && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleButtonClick('step5-no-ventilation', () => setCurrentCprStep('13'))} 
                          className={getButtonClass('step5-no-ventilation', "text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                        >
                          No - Ventilation first
                        </button>
                        <button 
                          onClick={() => handleButtonClick('step5-no-compression', () => setCurrentCprStep('10'))} 
                          className={getButtonClass('step5-no-compression', "text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200")}
                        >
                          No - Compression first
                        </button>
                        <button 
                          onClick={() => handleButtonClick('step5-no-choking', () => setCurrentCprStep('9'))} 
                          className={getButtonClass('step5-no-choking', "text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200 col-span-2")}
                        >
                          No - Unconscious choking
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '6':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 6: CPR Landmarks</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">(<strong>Not 3rd TRIMESTER</strong>) (Make sure s/he is <strong>flat on her/his back on the floor/ground</strong>.) Place the <strong>heel of your hand on the breastbone</strong> (in the center of the chest), <strong>right between the nipples</strong>. Put your other hand on top of that hand.</p>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => setCurrentCprStep('7')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Ventilation first
                  </button>
                  <button onClick={() => setCurrentCprStep('11')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Compression only
                  </button>
                  <button onClick={() => setCurrentCprStep('11')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Compression first
                  </button>
                  <button onClick={() => setCurrentCprStep('2')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Unconscious choking
                  </button>
                  <button onClick={() => setCurrentCprStep('11')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200 col-span-2">
                    Ventilation first & refused mouth-to-mouth
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '7':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 7: CPR Ventilations 1st/UC</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">CPR (Compressions 1st/Refused M-T-M) <strong>Pump the chest hard and fast</strong>, at least <strong>twice per second</strong> and <strong>2 inches (5 cm) deep</strong>.</p>
                <p className="text-black mb-2"><strong>Let the chest come all the way up</strong> between pumps. Tell me when you're done.</p>
                <p className="text-black mb-2">(Previous airway blockage) <strong>Check in his or her mouth</strong> for an object and <strong>remove anything you find</strong>.</p>
                <p className="text-black mb-2">Do you understand me so far?</p>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => setCurrentCprStep('8')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Yes
                  </button>
                  <button onClick={() => setCurrentCprStep('5')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Yes - unconscious choking
                  </button>
                  <button onClick={() => alert('Clarify/reassure and repeat instructions')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200 col-span-2">
                    No - clarify / reassure
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '8':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 8: Continue CPR plus Mouth-to-Mouth</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">With your hand <strong>under her/his neck</strong>, <strong>pinch her/his nose closed</strong> and <strong>tilt her/his head back</strong> again.</p>
                <p className="text-black mb-2">Give <strong>2 more regular breaths</strong>, then <strong>pump the chest 30 more times</strong>.</p>
                <p className="text-black mb-2">Make sure the <strong>heel of your hand is on the breastbone</strong> (in the center of the chest), <strong>right between the nipples</strong>.</p>
                <p className="text-black mb-2">Do you understand?</p>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => setCurrentCprStep('9')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    Yes
                  </button>
                  <button onClick={() => alert('Clarify/reassure and repeat instructions')} className="text-left px-4 py-2 bg-gray-100 text-black border border-gray-400 rounded hover:bg-gray-200">
                    No - clarify / reassure
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '9':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 9: Continue CPR</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">From now on, give him or her:</p>
                <p className="text-black mb-2">Ventilation first or unconscious choking: 2 breaths then 30 pumps, 2 breaths then 30 pumps</p>
                <p className="text-black mb-2">Compression first: 100 pumps then 2 breaths, 100 pumps then 2 breaths</p>
                
                <div className="mt-4 space-y-2">
                  <button onClick={() => setCurrentCprStep('10')} className="block w-full text-left px-4 py-2 bg-red-100 border border-red-400 rounded hover:bg-red-200 text-black">
                    Compression only / refused / unsuccessful mouth to mouth 
                  </button>
                  <button onClick={() => setCurrentCprStep('10')} className="block w-full text-left px-4 py-2 bg-green-100 border border-green-400 rounded hover:bg-green-200 text-black">
                    Ventilation first / Unconscious choking / compression first 
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '10':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 10: Reassure/Continue CPR</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">Keep doing it (the compressions) over and over, don't give up. This will keep her/him going until the paramedics (EMTs) arrive.</p>
                <p className="text-black mb-2">Tell me when they're right with her/him, or if anything changes.</p>
                <p className="text-black mb-2">(Choking or Refused M-T-M) Check in her/his mouth for an object every few minutes. Remove anything you find.</p>
                
                <div className="mt-4 space-y-2">
                  <button onClick={handleCaseExit} className="block w-full text-left px-4 py-2 bg-purple-100 border border-purple-400 rounded hover:bg-purple-200 text-black">
                    Arrival 
                  </button>
                  <button onClick={() => setCurrentCprStep('18')} className="block w-full text-left px-4 py-2 bg-green-100 border border-green-400 rounded hover:bg-green-200 text-black">
                    Started breathing 
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '11':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 11: CPR (compression first / refused mouth-to-mouth)</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">Pump the chest hard and fast, at least twice per second and 2 inches (5 cm) deep.</p>
                <p className="text-black mb-2">(Multiple rescuers) Tell me when they start pumping.</p>
                <p className="text-black mb-2">(Single rescuer) Let the chest come all the way up between pumps. We're going to do this (600 times or) until help can take over. Count out loud so I can count with you.</p>
                <p className="text-black mb-2">* Time the compression</p>
                
                <div className="mt-4 space-y-2">
                  <button onClick={() => setCurrentCprStep('12')} className="block w-full text-left px-4 py-2 bg-blue-100 border border-blue-400 rounded hover:bg-blue-200 text-black">
                    Multiple rescuers 
                  </button>
                  <button onClick={() => setCurrentCprStep('10')} className="block w-full text-left px-4 py-2 bg-red-100 border border-red-400 rounded hover:bg-red-200 text-black">
                    Compression only / refused mouth to mouth 
                  </button>
                  <button onClick={() => setCurrentCprStep('18')} className="block w-full text-left px-4 py-2 bg-green-100 border border-green-400 rounded hover:bg-green-200 text-black">
                    Started breathing 
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '12':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 12: CPR (Multiple rescuers)</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">Tell them to push down hard and make sure the chest comes all the way up between pumps. We're going to do this (600 times or) until help can take over. Count out loud so I can count with you.</p>
                <p className="text-black mb-2">*time the compressions</p>
                <p className="text-black mb-2">* prepare the caller to very quickly switch places with the rescuer after 200 compressions or if fatigued.</p>
                
                <div className="mt-4 space-y-2">
                  <button onClick={() => setCurrentCprStep('10')} className="block w-full text-left px-4 py-2 bg-red-100 text-black border border-red-400 rounded hover:bg-red-200">
                    Compression only / refused mouth to mouth 
                  </button>
                  <button onClick={() => setCurrentCprStep('18')} className="block w-full text-left px-4 py-2 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200">
                    Started breathing 
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '13':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 13: Change head tilt / mouth-to-mouth</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              {/* Modified block with <br /> */}
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">
                  Tilt her/his head back (more) and pinch her/his nose closed.
                </p>
                <p className="text-black mb-2">
                  Completely cover her/his mouth with your mouth and blow 2 regular breaths into the lungs, about 1 second each. The chest should rise with each breath.
                  <br />
                  Did you feel the air going in and out?
                </p>

                <div className="mt-4 space-y-2">
                  <button onClick={() => setCurrentCprStep('6')} className="block w-full text-left px-4 py-2 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200">
                    1st cycle of CPR 
                  </button>
                  <button onClick={() => setCurrentCprStep('9')} className="block w-full text-left px-4 py-2 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200">
                    Continuing CPR 
                  </button>
                  <button onClick={() => setCurrentCprStep('14')} className="block w-full text-left px-4 py-2 bg-blue-100 text-black border border-blue-400 rounded hover:bg-blue-200">
                    Continue mouth-to-mouth 
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );


        case '14':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 14: Continue mouth-to-mouth</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">Okay, now give her/him 1 breath every 5 seconds.</p>
                <p className="text-black mb-2">If anything changes, tell me immediately. I'll stay on the line until help arrives.</p>
                <p className="text-black mb-2">Tell me when the paramedics (EMTs) are right with her/him.</p>
                
                <div className="mt-4 space-y-2">
                  <button onClick={handleCaseExit} className="block w-full text-left px-4 py-2 bg-purple-100 text-black border border-purple-400 rounded hover:bg-purple-200">
                    Arrival 
                  </button>
                  <button onClick={() => setCurrentCprStep('16')} className="block w-full text-left px-4 py-2 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200">
                    Breathing normally 
                  </button>
                  <button onClick={() => setCurrentCprStep('6')} className="block w-full text-left px-4 py-2 bg-red-100 text-black border border-red-400 rounded hover:bg-red-200">
                    Start CPR (ventilation first) 
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '15':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 15: Clear airway</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">Turn her/his head to the side and clean out her/his mouth and nose.</p>
                <p className="text-black mb-2">(It's okay to have a little fluid remaining.)</p>
                <p className="text-black mb-2">(You must blow through the remaining fluid.)</p>
                
                <div className="mt-4">
                  <button onClick={() => setCurrentCprStep('15a')} className="block w-full text-left px-4 py-2 bg-blue-100 text-black border border-blue-400 rounded hover:bg-blue-200">
                    Continue
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '15a':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 15a: Breathing Status</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <div className="mt-6">
                  <h4 className="font-bold text-lg mb-2 text-black"> </h4>
                  <div className="space-y-2">
                    <button onClick={() => setCurrentCprStep('16')} className="block w-full text-left px-4 py-2 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200">
                      Effective 
                    </button>
                    {!showAgonalOptions ? (
                      <button onClick={() => setShowAgonalOptions(true)} className="block w-full text-left px-4 py-2 bg-orange-100 text-black border border-orange-400 rounded hover:bg-orange-200">
                        Agonal/Ineffective/Uncertain
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <button onClick={() => setCurrentCprStep('4')} className="block w-full text-left px-4 py-2 bg-orange-100 text-black border border-orange-400 rounded hover:bg-orange-200">
                          Agonal/Ineffective/Uncertain → before CPR 
                        </button>
                        <button onClick={() => setCurrentCprStep('9')} className="block w-full text-left px-4 py-2 bg-red-100 text-black border border-red-400 rounded hover:bg-red-200">
                          Agonal/Ineffective/Uncertain → continuing CPR
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '16':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 16: Maintain and monitor</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">Stay right with her/him, make sure her/his head is tilted back, and check breathing often.</p>
                <p className="text-black mb-2">If s/he vomits, turn her/him on her/his side and clean out her/his mouth and nose.</p>
                <p className="text-black mb-2">I'll stay on the line until help arrives. Tell me when the paramedics (EMTs) are right with her/him, or if anything changes.</p>
                
                <div className="mt-4 space-y-2">
                  <button onClick={() => setCurrentCprStep('15a')} className="block w-full text-left px-4 py-2 bg-red-100 text-black border border-red-400 rounded hover:bg-red-200">
                    Stopped breathing now → 15a
                  </button>
                  <button onClick={() => setCurrentCprStep('15a')} className="block w-full text-left px-4 py-2 bg-orange-100 text-black border border-orange-400 rounded hover:bg-orange-200">
                    Agonal / Ineffective / Uncertain → 15a
                  </button>
                  <button onClick={handleCaseExit} className="block w-full text-left px-4 py-2 bg-purple-100 text-black border border-purple-400 rounded hover:bg-purple-200">
                    Arrival
                  </button>
                  <button onClick={() => setCurrentCprStep('17')} className="block w-full text-left px-4 py-2 bg-blue-100 text-black border border-blue-400 rounded hover:bg-blue-200">
                    Abnormal breathing 
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '17':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 17: Breathing Evaluation</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">(Look at her/him very closely. Tell me exactly what you see and hear her/him doing.)</p>
                <p className="text-black mb-2">*Determine now if the patient is breathing effectively. If any question exists, go to Determining AGONAL BREATHING.</p>
                
                <div className="mt-4 space-y-2">
                  <button onClick={() => setCurrentCprStep('16')} className="block w-full text-left px-4 py-2 bg-green-100 text-black border border-green-400 rounded hover:bg-green-200">
                    Effective 
                  </button>
                  <button onClick={() => setCurrentCprStep('18')} className="block w-full text-left px-4 py-2 bg-orange-100 text-black border border-orange-400 rounded hover:bg-orange-200">
                    Questionable 
                  </button>
                  <button onClick={() => setCurrentCprStep('15a')} className="block w-full text-left px-4 py-2 bg-red-100 text-black border border-red-400 rounded hover:bg-red-200">
                    Agonal or Ineffective 
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        case '18':
          return (
            <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black font-bold text-lg">Step 18: Determining AGONAL BREATHING</h3>
                {autoSaved && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-400 mb-4">
                <p className="text-black mb-2">(Read verbatim) Okay, I want you to say "now" every single time s/he takes a breath in, starting immediately.</p>
                <p className="text-black mb-2">*8 seconds interval = AGONAL</p>
                <p className="text-black mb-2">*A time between breaths of 8 seconds or more is considered INEFFECTIVE BREATHING. Check a maximum of four breaths (three intervals tested).</p>
                
                <div className="mt-4">
                  <button onClick={() => setCurrentCprStep('15a')} className="block w-full text-left px-4 py-2 bg-red-100 text-black border border-red-400 rounded hover:bg-red-200">
                    Continue → 15a
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handleCprGoBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          );

        default:
          return renderPdiPage();
      }
    };

       return (
          <div className="max-w-4xl mx-auto p-4">
            {renderCurrentStep()}
            {showExitModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                  <h3 className="text-lg font-bold mb-4 text-black">Case Exit Confirmation</h3>
                  <p className="text-gray-700 mb-6">
                    Confirm case exit? This will proceed to DLS (Dispatch Life Support).
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowExitModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmCaseExit}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Confirm Exit
                    </button>
                  </div>
                </div>
              </div>
            )}



            {/* Confirm Save & Return to Dashboard Modal */}
            {showConfirmSummaryModal && (
              <div 
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75" 
                style={{ zIndex: 99999 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div 
                  className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 border-4 border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold mb-4 text-black text-center">Save & Return to Dashboard</h3>
                  <p className="text-gray-700 mb-6 text-center">
                    Are you sure you want to save this case and return to the dashboard?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        console.log('Yes Save & Return button clicked!');
                        handleSaveAndReturn();
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
                    >
                      Yes, Save & Return
                    </button>
                    <button
                      onClick={() => {
                        console.log('Cancel button clicked!');
                        setShowConfirmSummaryModal(false);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
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

  return (
    <div className="flex flex-col h-screen">
      <EntryNavigation
        username="SUPERVISOR"
        fullName="John Supervisor"
        caseNumber="2000005541"
        onLogout={handleLogout}
        onCloseCase={handleCloseCase}
        onChangeCaseNumber={handleChangeCaseNumber}
        onPrintCase={handlePrintCase}
      >
        {/* Subpart Navigation - Properly aligned under Entry tab */}
        <div className="bg-[#C0C0C0]">
          <div className="max-w-7xl mx-auto">
            <div className="flex w-full">
              {/* Create sections matching main nav proportions */}
              <div className="flex-1 flex">
                <button
                  onClick={() => {
                    setCurrentSubpart('case-entry');
                    setCurrentPage('entry');
                  }}
                  className={`flex-1 py-2 ${
                    currentPage === 'entry' && currentSubpart === 'case-entry'
                      ? 'bg-white text-black font-medium'
                      : 'text-black hover:bg-gray-300 transition'
                  } border-r border-gray-500`}
                >
                  Case Entry
                </button>
                <button
                  onClick={() => {
                    setCurrentSubpart('additional-info');
                    setCurrentPage('entry');
                  }}
                  className={`flex-1 py-2 ${
                    currentPage === 'entry' && currentSubpart === 'additional-info'
                      ? 'bg-white text-black font-medium'
                      : 'text-black hover:bg-gray-300 transition'
                  } border-r border-gray-500`}
                >
                  Additional Info
                </button>
              </div>
              {/* KQ Section */}
              <div className="flex-1">
                <button
                  onClick={() => setCurrentPage('kq')}
                  className={`w-full py-2 ${
                    currentPage === 'kq'
                      ? 'bg-white text-black font-medium'
                      : 'text-black hover:bg-gray-300 transition'
                  } border-r border-gray-500`}
                >
                  KQ
                </button>
              </div>
              {/* PDI Section */}
              <div className="flex-1">
                <button
                  onClick={() => setCurrentPage('pdi')}
                  className={`w-full py-2 ${
                    currentPage === 'pdi' || currentPage === 'cpr'
                      ? 'bg-white text-black font-medium'
                      : 'text-black hover:bg-gray-300 transition'
                  } border-r border-gray-500`}
                >
                  PDI/CEI
                </button>
              </div>
              {/* DLS Section */}
              <div className="flex-1">
                <button
                  onClick={() => {
                    setCurrentPage('dls');
                    setShowDLS(true);
                  }}
                  className={`w-full py-2 ${
                    currentPage === 'dls' || showDLS
                      ? 'bg-white text-black font-medium'
                      : 'text-black hover:bg-gray-300 transition'
                  } border-r border-gray-500`}
                >
                  DLS
                </button>
              </div>
              {/* Summary Section */}
              <div className="flex-1">
                <button
                  onClick={() => {
                    setCurrentPage('summary');
                    setShowSummaryModal(false); // Don't show modal when tab is clicked
                  }}
                  className={`w-full py-2 ${
                    currentPage === 'summary'
                      ? 'bg-white text-black font-medium'
                      : 'text-black hover:bg-gray-300 transition'
                  }`}
                >
                  Summary
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-[#E8E8E8]">
          <div className="max-w-4xl mx-auto p-4">
            {currentPage === 'summary' ? (
              renderSummaryPage()
            ) : currentPage === 'dls' || showDLS ? (
              renderDLS()
            ) : currentPage === 'cpr' ? (
              renderCprInstructions()
            ) : currentPage === 'pdi' ? (
              renderPdiPage()
            ) : currentPage === 'kq' ? (
              renderKqQuestion()
            ) : currentSubpart === 'case-entry' ? (
              <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
                <div className="space-y-6">
                  {/* Case Entry Form */}
                  <div className="grid grid-cols-[200px,1fr] gap-x-4 gap-y-3 items-center">
                <div className="text-black font-medium">The location is:</div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      name="location"
                      className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full pr-8"
                    />
                    {isLocationValid && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={validateLocation}
                    className="px-3 py-1 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition h-8"
                  >
                    Validate
                  </button>
                  {showMap && (
                    <div className="fixed right-4 top-[200px] w-[400px] h-[300px] bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="flex justify-between items-center p-2 border-b border-gray-200">
                        <div className="text-sm font-medium">Location Map</div>
                        <button 
                          onClick={() => setShowMap(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-2 h-[calc(100%-40px)]">
                        <div 
                          ref={mapRef} 
                          className="w-full h-full rounded"
                          style={{ minHeight: '260px' }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-black font-medium">The phone number is:</div>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                  className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                />

                <div className="text-black font-medium">Okey, tell me exactly what happened.</div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.problem}
                        onChange={(e) => {
                          handleChange(e);
                          // Mark field as interacted with
                          setFieldInteractions(prev => ({ ...prev, problem: true }));
                        }}
                        name="problem"
                        list="problem-suggestions"
                        className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                      />
                    </div>
                    {fieldInteractions.problem && formData.problem.toLowerCase().match(/breath(ing)?/) && (
                      <div className="bg-blue-50 border border-blue-300 rounded p-3 ml-2 w-[300px] relative">
                        <button 
                          onClick={() => {
                            setFieldInteractions(prev => ({ ...prev, problem: false }));
                          }}
                          className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <p className="text-sm text-blue-900 font-medium mb-2">If choking, verify: "<span className="font-bold">Is s/he breathing</span> or <span className="font-bold">coughing</span> at all?" (You go check and tell me what you find.)</p>
                        <p className="text-sm text-blue-900">Then tell the caller: "<span className="font-bold">Do not slap</span> her/him on the back."</p>
                        <p className="text-sm text-blue-900 mt-2">For <span className="font-bold">NOT BREATHING</span> or <span className="font-bold">INEFFECTIVE/AGONAL BREATHING</span>, code as <span className="font-bold">ECHO</span> on <span className="font-bold">Protocols 2, 6, 9, 11, 15, 31</span> only dispatch, give PDIs, and <span className="font-bold">return to</span> question sequence.</p>
                      </div>
                    )}
                  </div>
                  <datalist id="problem-suggestions">
                    <option value="Hanging (now)" />
                    <option value="Underwater" />
                    <option value="Verified COMPLETE obstruction (choking)" />
                    <option value="Strangulation" />
                    <option value="Suffocation" />
                    <option value="Sinking vehicle – Caller inside" />
                    <option value="Person on fire" />
                  </datalist>

                <div className="text-black font-medium">Are you with the patient now?</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <select
                      value={formData.withPatient}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldInteractions(prev => ({ ...prev, withPatient: true }));
                      }}
                      name="withPatient"
                      className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="First (1st) party">First (1st) party</option>
                      <option value="Forth (4th) party">Forth (4th) party</option>
                    </select>
                  </div>
                  {fieldInteractions.withPatient && (
                    <div className="bg-blue-50 border border-blue-300 rounded p-3 ml-2 w-[300px] relative">
                      <button 
                        onClick={() => {
                          setFieldInteractions(prev => ({ ...prev, withPatient: false }));
                        }}
                        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <p className="text-sm text-blue-900">
                        Ask only if <span className="font-bold">not</span> obvious.
                      </p>
                      <p className="text-sm text-blue-900">
                        <span className="font-bold">4th party</span> = referring agency such as police, airport, or other professional comm. center.
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-black font-medium">The number of people hurt or sick:</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={formData.numHurt}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldInteractions(prev => ({ ...prev, numHurt: true }));
                      }}
                      name="numHurt"
                      className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                    />
                  </div>
                  {fieldInteractions.numHurt && (
                    <div className="bg-blue-50 border border-blue-300 rounded p-3 ml-2 w-[300px] relative">
                      <button 
                        onClick={() => {
                          setFieldInteractions(prev => ({ ...prev, numHurt: false }));
                        }}
                        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <p className="text-sm text-blue-900">
                        The <span className="font-bold">number</span> of people <span className="font-bold">injured</span> or <span className="font-bold">sick</span>. More than one <span className="font-bold">serious</span> patient will trigger a <span className="font-bold">DELTA</span> response on Protocols <span className="font-bold">4, 7, 8, 14, 15, 20, 22, 27, 29, 32</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-black font-medium">How old is the patient?</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.age}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldInteractions(prev => ({ ...prev, age: true }));
                      }}
                      name="age"
                      className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                    />
                  </div>
                  {fieldInteractions.age && (
                    <div className="bg-blue-50 border border-blue-300 rounded p-3 ml-2 w-[300px] relative">
                      <button 
                        onClick={() => {
                          setFieldInteractions(prev => ({ ...prev, age: false }));
                        }}
                        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <p className="text-sm text-blue-900">
                        The <span className="font-bold">closest age</span> (even if approximate) <span className="font-bold">must</span> be entered.
                      </p>
                      <p className="text-sm text-blue-900 mt-2">
                        (<span className="font-bold">Unsure</span>) Tell me <span className="font-bold">approximately</span>, then
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-black font-medium">The patient's gender is:</div>
                <select
                  value={formData.gender}
                  onChange={handleChange}
                  name="gender"
                  className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <div className="text-black font-medium">Is patient awake (conscious)?</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <select
                      value={formData.conscious}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldInteractions(prev => ({ ...prev, conscious: true }));
                      }}
                      name="conscious"
                      className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                    >
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>
                  {fieldInteractions.conscious && (
                    <div className="bg-blue-50 border border-blue-300 rounded p-3 ml-2 w-[300px] relative">
                      <button 
                        onClick={() => {
                          setFieldInteractions(prev => ({ ...prev, conscious: false }));
                        }}
                        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <p className="text-sm text-blue-900">
                        If <span className="font-bold">consciousness is unknown</span>, immediately <span className="font-bold">verify</span> whether the <span className="font-bold">patient is breathing</span>.
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-black font-medium">Is patient breathing?</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <select
                      value={formData.breathing}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldInteractions(prev => ({ ...prev, breathing: true }));
                      }}
                      name="breathing"
                      className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                    >
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Uncertain (2nd party)">Uncertain (2nd party)</option>
                      <option value="Unknown (3rd/4th party)">Unknown (3rd/4th party)</option>
                      <option value="INEFFECTIVE/AGONAL">INEFFECTIVE/AGONAL</option>
                    </select>
                  </div>
                  {fieldInteractions.breathing && (
                    <div className="bg-blue-50 border border-blue-300 rounded p-3 ml-2 w-[300px] relative">
                      <button 
                        onClick={() => {
                          setFieldInteractions(prev => ({ ...prev, breathing: false }));
                        }}
                        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <p className="text-sm text-blue-900">
                        <span className="font-bold">Hasn't checked</span>: Ask, "You go check and tell me what you find."
                      </p>
                      <p className="text-sm text-blue-900 mt-2">
                        <span className="font-bold">Uncertain</span>: a 2nd party caller who is unsure. <span className="font-bold">Unknown</span>: a 3rd or 4th party caller who doesn't know. Select <span className="font-bold">INEFFECTIVE</span> when unconscious and breathing is irregular or very slow, or <span className="font-bold">AGONAL</span> when the time between breaths is 10 seconds or more.
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-black font-medium">Chief Complaint is:</div>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={formData.chiefComplaint}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        chiefComplaint: value
                      }));
                      
                      const searchTerm = value.toLowerCase();
                      
                      const filtered = protocols.filter(protocol => {
                        // Check if input contains numbers
                        if (/\d/.test(value)) {
                          // Match any protocol ID that contains the numbers from input
                          return protocol.id.includes(value.match(/\d+/)?.[0] || '');
                        }
                        // If no numbers, search by text
                        return protocol.name.toLowerCase().includes(searchTerm);
                      });

                      // Sort results to show exact ID matches first
                      filtered.sort((a, b) => {
                        if (a.id === value) return -1;
                        if (b.id === value) return 1;
                        return parseInt(a.id) - parseInt(b.id);
                      });
                      
                      setFilteredProtocols(filtered);
                    }}
                    name="chiefComplaint"
                    className="border border-gray-400 px-2 py-1 h-8 bg-white text-black w-full"
                    placeholder="Type a number or search protocols..."
                    autoComplete="off"
                  />
                  {formData.chiefComplaint && filteredProtocols.length > 0 && (
                    <div 
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
                    >
                      {filteredProtocols.map(protocol => (
                        <div
                          key={protocol.id}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-black"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              chiefComplaint: `${protocol.id} - ${protocol.name}`
                            }));
                            setFilteredProtocols([]);
                          }}
                        >
                          {protocol.id} - {protocol.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
                </div>
                {/* Confirm and Continue Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setCurrentSubpart('additional-info')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Confirm & Continue →
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#D3D3D3] rounded shadow-sm p-4">
                <div className="space-y-6">
                  {/* Additional Information Form */}
                  <div className="flex flex-col gap-6">
                    <div className="text-black text-left text-lg">
                      No additional question.
                    </div>
                  </div>
                  
                  {/* Back and Continue Buttons for Additional Info */}
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => {
                        setCurrentSubpart('case-entry');
                        // Auto save logic would be here
                      }}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Case Entry
                    </button>
                    <button
                      onClick={handleAdditionalInfoContinue}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Confirm & Continue →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </EntryNavigation>

      {/* Dispatch Confirmation Modal */}
{showDispatchConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Dispatch Determination</h2>
        <button 
          onClick={() => setShowDispatchConfirm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* KQ Answers Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-black mb-4">Key Questions Summary</h3>
        <div className="bg-gray-50 p-4 rounded border">
          <div className="grid grid-cols-2 gap-4 text-sm text-black">
            <div><strong className="text-black">1. Completely alert:</strong> {getKqSummary('question1', kqAnswers.question1)}</div>
            <div><strong className="text-black">2. Difficulty speaking:</strong> {getKqSummary('question2', kqAnswers.question2)}</div>
            <div><strong className="text-black">3. Changing color:</strong> {getKqSummary('question3', kqAnswers.question3)}</div>
            <div><strong className="text-black">4. Clammy/cold sweats:</strong> {getKqSummary('question4', kqAnswers.question4)}</div>
            <div><strong className="text-black">5. Asthma/lung problems:</strong> {getKqSummary('question5', kqAnswers.question5)}</div>
            <div><strong className="text-black">6. Special equipment:</strong> {getKqSummary('question6', kqAnswers.question6)}</div>
          </div>
        </div>
      </div>

        {/* Determinants Table */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-black mb-4">Determinants</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-400 p-2 text-left text-black">Level</th>
                        <th className="border border-gray-400 p-2 text-left text-black">Determinant</th>
                        <th className="border border-gray-400 p-2 text-center text-black">Code</th>
                        <th className="border border-gray-400 p-2 text-center text-black">Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr 
                        className={`cursor-pointer hover:bg-purple-100 ${selectedDeterminant === '6-E-1' ? 'bg-purple-300 border-4 border-purple-600' : 'bg-purple-50'}`}
                        onClick={() => setSelectedDeterminant('6-E-1')}
                      >
                        <td className="border border-gray-400 p-2">
                          <div className="w-8 h-8 bg-purple-200 text-purple-700 rounded flex items-center justify-center font-bold">E</div>
                        </td>
                        <td className="border border-gray-400 p-2 text-black">1 INEFFECTIVE BREATHING</td>
                        <td className="border border-gray-400 p-2 text-center font-bold text-black">6-E-1</td>
                        <td className="border border-gray-400 p-2 text-center text-black">FR/BLS/ALS Hot</td>
                      </tr>
                      <tr 
                        className={`cursor-pointer hover:bg-red-100 ${selectedDeterminant === '6-D-1' ? 'bg-red-300 border-4 border-red-600' : 'bg-red-50'}`}
                        onClick={() => setSelectedDeterminant('6-D-1')}
                      >
                        <td className="border border-gray-400 p-2">
                          <div className="w-8 h-8 bg-red-200 text-red-700 rounded flex items-center justify-center font-bold">D</div>
                        </td>
                        <td className="border border-gray-400 p-2 text-black">1 Not alert</td>
                        <td className="border border-gray-400 p-2 text-center font-bold text-black">6-D-1</td>
                        <td className="border border-gray-400 p-2 text-center text-black">BLS/ALS Hot</td>
                      </tr>
                      <tr 
                        className={`cursor-pointer hover:bg-red-100 ${selectedDeterminant === '6-D-2' ? 'bg-red-300 border-4 border-red-600' : 'bg-red-50'}`}
                        onClick={() => setSelectedDeterminant('6-D-2')}
                      >
                        <td className="border border-gray-400 p-2">
                          <div className="w-8 h-8 bg-red-200 text-red-700 rounded flex items-center justify-center font-bold">D</div>
                        </td>
                        <td className="border border-gray-400 p-2 font-bold text-black">2 DIFFICULTY SPEAKING BETWEEN BREATHS</td>
                        <td className="border border-gray-400 p-2 text-center font-bold text-black">6-D-2</td>
                        <td className="border border-gray-400 p-2 text-center text-black">BLS/ALS Hot</td>
                      </tr>
                      <tr 
                        className={`cursor-pointer hover:bg-red-100 ${selectedDeterminant === '6-D-3' ? 'bg-red-300 border-4 border-red-600' : 'bg-red-50'}`}
                        onClick={() => setSelectedDeterminant('6-D-3')}
                      >
                        <td className="border border-gray-400 p-2">
                          <div className="w-8 h-8 bg-red-200 text-red-700 rounded flex items-center justify-center font-bold">D</div>
                        </td>
                        <td className="border border-gray-400 p-2 font-bold text-black">3 CHANGING COLOR</td>
                        <td className="border border-gray-400 p-2 text-center font-bold text-black">6-D-3</td>
                        <td className="border border-gray-400 p-2 text-center text-black">BLS/ALS Hot</td>
                      </tr>
                      <tr 
                        className={`cursor-pointer hover:bg-red-100 ${selectedDeterminant === '6-D-4' ? 'bg-red-300 border-4 border-red-600' : 'bg-red-50'}`}
                        onClick={() => setSelectedDeterminant('6-D-4')}
                      >
                        <td className="border border-gray-400 p-2">
                          <div className="w-8 h-8 bg-red-200 text-red-700 rounded flex items-center justify-center font-bold">D</div>
                        </td>
                        <td className="border border-gray-400 p-2 text-black">4 Clammy</td>
                        <td className="border border-gray-400 p-2 text-center font-bold text-black">6-D-4</td>
                        <td className="border border-gray-400 p-2 text-center text-black">BLS/ALS Hot</td>
                      </tr>
                      <tr 
                        className={`cursor-pointer hover:bg-yellow-100 ${selectedDeterminant === '6-C-1' ? 'bg-yellow-300 border-4 border-yellow-600' : 'bg-yellow-50'}`}
                        onClick={() => setSelectedDeterminant('6-C-1')}
                      >
                        <td className="border border-gray-400 p-2">
                          <div className="w-8 h-8 bg-yellow-200 text-yellow-700 rounded flex items-center justify-center font-bold">C</div>
                        </td>
                        <td className="border border-gray-400 p-2 text-black">1 Abnormal breathing</td>
                        <td className="border border-gray-400 p-2 text-center font-bold text-black">6-C-1</td>
                        <td className="border border-gray-400 p-2 text-center text-black">BLS/ALS Cold</td>
                      </tr>
                      <tr 
                        className={`cursor-pointer hover:bg-yellow-100 ${selectedDeterminant === '6-C-2' ? 'bg-yellow-300 border-4 border-yellow-600' : 'bg-yellow-50'}`}
                        onClick={() => setSelectedDeterminant('6-C-2')}
                      >
                        <td className="border border-gray-400 p-2">
                          <div className="w-8 h-8 bg-yellow-200 text-yellow-700 rounded flex items-center justify-center font-bold">C</div>
                        </td>
                        <td className="border border-gray-400 p-2 text-black">2 Tracheostomy (no obvious distress)</td>
                        <td className="border border-gray-400 p-2 text-center font-bold text-black">6-C-2</td>
                        <td className="border border-gray-400 p-2 text-center text-black">BLS/ALS Cold</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {selectedDeterminant && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-300 rounded">
                    <h4 className="font-bold text-black">Selected Determinant: {selectedDeterminant}</h4>
                    <p className="text-black mt-2">This determinant will be used for dispatch priority.</p>
                  </div>
                )}
              </div>

              {/* Dispatch Actions */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowDispatchConfirm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDispatchConfirm(false);
                    setShowAmbulanceSelection(true); // Show ambulance selection instead of direct dispatch
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold text-lg"
                >
                  CONTINUE TO AMBULANCE SELECTION
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ambulance Selection Modal */}
        {showAmbulanceSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Ambulance Selection</h2>
                <button 
                  onClick={() => setShowAmbulanceSelection(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-center text-gray-600 mb-6">
                Select {parseInt(formData.numHurt) || 0} ambulance(s) for {parseInt(formData.numHurt) || 0} hurt/sick person(s)
              </div>

              {ambulanceError && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {ambulanceError}
                </div>
              )}

              <div className="mb-6">
                <div className="grid grid-cols-5 gap-3">
                  {ambulances.map((ambulance) => (
                    <div
                      key={ambulance.id}
                      className={getAmbulanceClass(ambulance.id)}
                      onClick={() => handleAmbulanceToggle(ambulance.id)}
                    >
                      <div>
                        <div className="text-sm font-bold">{ambulance.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Color Status Legend */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded mr-2"></div>
                    <span className="text-black font-medium">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-200 border-2 border-blue-600 rounded mr-2"></div>
                    <span className="text-black font-medium">Preparing to depart</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-600 rounded mr-2"></div>
                    <span className="text-black font-medium">En route</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-200 border-2 border-purple-600 rounded mr-2"></div>
                    <span className="text-black font-medium">Arrived</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-200 border-2 border-red-600 rounded mr-2"></div>
                    <span className="text-black font-medium">Unavailable</span>
                  </div>
                </div>
              </div>

              {/* Ambulance Dispatch Confirmation */}
              <div className="bg-gray-50 p-4 rounded border mb-6">
                <h3 className="text-lg font-bold text-black mb-4">Ambulance dispatch confirmation</h3>
                <div className="grid grid-cols-2 gap-4 text-black">
                  <div><strong>Total dispatch ambulance:</strong> {selectedAmbulances.length} (auto selection)</div>
                  <div><strong>Determinant code:</strong> {selectedDeterminant}</div>
                  <div><strong>Number of hurt or sick:</strong> {parseInt(formData.numHurt) || 0} </div>
                  <div><strong>Location:</strong> {formData.location || 'Not specified'}</div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 p-4 rounded border mb-6">
                <h3 className="text-lg font-bold text-black mb-3">Additional Info:</h3>
                <div className="text-black space-y-2">
                  <p><strong className="text-blue-800">One</strong> ambulance is dispatched <strong className="text-blue-800">per patient</strong>, because:</p>
                  <ul className="ml-4 space-y-1">
                    <li>• Each ambulance has <strong className="text-blue-800">one stretcher</strong> & treatment area.</li>
                    <li>• Paramedics can safely manage <strong className="text-blue-800">one critical patient at a time</strong>.</li>
                    <li>• Medical documentation (<strong className="text-blue-800">ePCR</strong>, hospital report) is <strong className="text-blue-800">one per patient</strong>.</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowAmbulanceSelection(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAmbulanceConfirm}
                  disabled={parseInt(formData.numHurt) === 0 || selectedAmbulances.length !== parseInt(formData.numHurt)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Confirm & Dispatch Ambulances
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ambulance Dispatch Confirmation Modal */}
      {showAmbulanceConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border-2 border-black">
            <h2 className="text-xl font-bold mb-4 text-black">Confirm Ambulance Dispatch</h2>
            <div className="space-y-3 mb-6 text-black">
              <div>
                <span className="font-medium">Determinant: </span>
                {selectedDeterminant}
              </div>
              <div>
                <span className="font-medium">Number of patients: </span>
                {parseInt(formData.numHurt) || 0}
              </div>
              <div>
                <span className="font-medium">Selected ambulances:</span>
                <ul className="mt-2">
                  {selectedAmbulances.map(amb => (
                    <li key={amb} className="ml-4">• {amb}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowAmbulanceConfirm(false)} 
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAmbulanceDispatch}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                CONFIRM DISPATCH
              </button>
            </div>
          </div>
        </div>
      )}
        {/* Dispatching Indicator - MOVED OUTSIDE THE MODAL */}
        {isDispatching && (
          <div className="fixed top-4 left-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-[60]">
            <div className="flex items-center">
              <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full mr-3"></div>
              <div>
                <div className="font-bold animate-pulse">DISPATCHING...</div>
                <div className="text-sm">{selectedDeterminant}</div>
                <div className="text-xs">Ambulances: {selectedAmbulances.join(', ')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Static Dispatch Complete Indicator */}
        {dispatchComplete && !isDispatching && (
          <div className="fixed top-4 left-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-[60]">
            <div className="flex items-center">
              <div className="h-6 w-6 mr-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-bold">DISPATCHED</div>
                <div className="text-sm">{selectedDeterminant}</div>
                <div className="text-xs">Ambulances: {selectedAmbulances.join(', ')}</div>
              </div>
            </div>
          </div>
        )}



        {/* Case Completion to Timeline Summary Modal */}
        {showCaseCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4 text-black">Case Completion</h3>
              <p className="text-gray-700 mb-6">
                <span className="font-bold text-green-600">Case completed!</span>
                <br /><br />
                Confirm to view the timeline summary?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    console.log('❌ Cancel clicked');
                    setShowCaseCompletionModal(false);
                    setShowDLS(true);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCaseCompletion}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
                >
                  View Timeline Summary
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Save & Return to Dashboard Modal */}
        {showConfirmSummaryModal && (
          <div 
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center" 
            style={{ zIndex: 999999 }}
          >
            <div 
              className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-black text-center">Save & Return to Dashboard</h3>
              <p className="text-gray-700 mb-6 text-center">
                Are you sure you want to save this case and return to the dashboard?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleSaveAndReturn}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Yes, Save & Return
                </button>
                <button
                  onClick={() => setShowConfirmSummaryModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}