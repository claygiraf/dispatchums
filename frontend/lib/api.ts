// API configuration for Dispatchums backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const API_V1 = `${API_BASE_URL}/api/v1`;

// Types matching the backend models
export interface CaseData {
  id?: number;
  case_number?: string;
  location: string;
  phone_number: string;
  contact_name?: string;
  language?: string;
  protocol_id?: string;
  protocol_name?: string;
  problem_description?: string;
  chief_complaint?: string;
  patient_age?: string;
  patient_gender?: string;
  is_conscious?: boolean;
  is_breathing?: boolean;
  with_patient?: string;
  num_hurt?: number;
  hazards?: string;
  weapons?: string;
  notes?: string;
  status?: string;
  dispatcher_name?: string;
  dispatcher_id?: string;
  dispatcher_unit?: string;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
}

export interface KQResponses {
  question1?: string;
  question2?: string;
  question2a?: string;
  question2i?: string;
  question3?: string;
  question3a?: string;
  question4?: string;
  question5?: string;
  question5a?: string;
  question5i?: string;
  question6?: string;
  question6a?: string;
}

export interface DispatchRequest {
  case_id: number;
  determinant_code: string;
  dispatch_priority: string;
  dispatched_units: string[];
  kq_responses?: KQResponses;
}

// API functions
export const api = {
  // Case management
  async createCase(caseData: Omit<CaseData, 'id' | 'case_number' | 'created_at' | 'updated_at'>): Promise<CaseData> {
    const response = await fetch(`${API_V1}/cases/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caseData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create case: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getCases(skip: number = 0, limit: number = 100, status?: string): Promise<CaseData[]> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    
    if (status) {
      params.append('status', status);
    }
    
    const response = await fetch(`${API_V1}/cases/?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cases: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getCase(caseId: number): Promise<CaseData> {
    const response = await fetch(`${API_V1}/cases/${caseId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch case: ${response.statusText}`);
    }
    
    return response.json();
  },

  async updateCase(caseId: number, caseData: Partial<CaseData>): Promise<CaseData> {
    const response = await fetch(`${API_V1}/cases/${caseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caseData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update case: ${response.statusText}`);
    }
    
    return response.json();
  },

  async deleteCase(caseId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_V1}/cases/${caseId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete case: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Key Questions
  async updateKQResponses(caseId: number, kqResponses: KQResponses): Promise<{ message: string; case_id: number }> {
    const response = await fetch(`${API_V1}/cases/${caseId}/kq-responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kqResponses),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update KQ responses: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getKQResponses(caseId: number): Promise<{ case_id: number; kq_responses: KQResponses }> {
    const response = await fetch(`${API_V1}/cases/${caseId}/kq-responses`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch KQ responses: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Dispatch
  async dispatchCase(dispatchRequest: DispatchRequest): Promise<{
    message: string;
    case_id: number;
    determinant_code: string;
    dispatch_priority: string;
    dispatched_units: string[];
  }> {
    const response = await fetch(`${API_V1}/cases/${dispatchRequest.case_id}/dispatch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dispatchRequest),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to dispatch case: ${response.statusText}`);
    }
    
    return response.json();
  },

  async completeCase(caseId: number): Promise<{ message: string; completed_at: string }> {
    const response = await fetch(`${API_V1}/cases/${caseId}/complete`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to complete case: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Search functions
  async searchCasesByLocation(location: string): Promise<CaseData[]> {
    const response = await fetch(`${API_V1}/cases/search/by-location?location=${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to search cases: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getCasesByStatus(status: string): Promise<CaseData[]> {
    const response = await fetch(`${API_V1}/cases/search/by-status?status=${encodeURIComponent(status)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get cases by status: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getCasesByProtocol(protocolId: string): Promise<CaseData[]> {
    const response = await fetch(`${API_V1}/cases/protocols/${encodeURIComponent(protocolId)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get cases by protocol: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Authentication endpoints
  async register(userData: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
    unit: string; // Required field
    role?: string;
  }): Promise<{
    id: number;
    username: string;
    email: string;
    full_name?: string;
    dispatcher_id?: string;
    unit?: string;
    role: string;
    is_active: boolean;
    created_at: string;
  }> {
    const response = await fetch(`${API_V1}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Registration failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  async login(credentials: {
    username: string;
    password: string;
  }): Promise<{
    access_token: string;
    token_type: string;
    user: any;
  }> {
    const response = await fetch(`${API_V1}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Login failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  async getCurrentUser(token: string): Promise<any> {
    const response = await fetch(`${API_V1}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.statusText}`);
    }
    
    return response.json();
  },

  async logout(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_V1}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Logout failed: ${response.statusText}`);
    }
    
    return response.json();
  }
};

export default api;