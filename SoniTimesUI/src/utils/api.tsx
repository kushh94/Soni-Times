import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5f14f8f9`;

// Check if Supabase is properly configured
const isSupabaseConfigured = projectId !== 'demo-project' && publicAnonKey !== 'demo-key';

interface Product {
  id: number;
  image: string;
  brand?: string;
  model?: string;
  datePosted: string;
  price?: string;
  category: 'wrist-watch' | 'wall-clock';
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// Helper function to make API requests
const makeRequest = async <T = any>(
  endpoint: string, 
  options: RequestInit = {},
  requiresAuth = false
): Promise<ApiResponse<T>> => {
  // Check if Supabase is configured
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, using fallback mode');
    return {
      success: false,
      error: 'Supabase not configured. Please connect to Supabase to enable cloud features.',
    };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (requiresAuth) {
      const token = localStorage.getItem('supabase_auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = `Bearer ${publicAnonKey}`;
      }
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }

    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`API request failed [${response.status}]:`, data);
      return {
        success: false,
        error: data.error || `Request failed with status ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    // Check if it's a network error that might indicate the server isn't running
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Unable to connect to the server. The Supabase Edge Function may not be deployed yet.',
      };
    }
    return {
      success: false,
      error: `Network error: ${error}`,
    };
  }
};

// API functions

export const api = {
  // Get all products
  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    console.log('Fetching products from cloud...');
    const result = await makeRequest<Product[]>('/products');
    
    // If the request fails due to configuration issues, let the calling code handle fallback
    return result;
  },

  // Add a new product (admin only)
  addProduct: async (productData: {
    brand?: string;
    model?: string;
    price?: string;
    category: 'wrist-watch' | 'wall-clock';
    image: string;
  }): Promise<ApiResponse<Product>> => {
    console.log('Adding product to cloud...', productData);
    return makeRequest<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }, true);
  },

  // Delete a product (admin only)
  deleteProduct: async (productId: number): Promise<ApiResponse> => {
    console.log('Deleting product from cloud...', productId);
    return makeRequest(`/products/${productId}`, {
      method: 'DELETE',
    }, true);
  },

  // Upload product image (admin only)
  uploadImage: async (imageFile: File): Promise<ApiResponse<{ imageUrl: string; fileName: string }>> => {
    console.log('Uploading image to cloud...', imageFile.name);
    
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = localStorage.getItem('supabase_auth_token') || publicAnonKey;
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error(`Image upload failed [${response.status}]:`, data);
        return {
          success: false,
          error: data.error || `Upload failed with status ${response.status}`,
        };
      }

      return data;
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: `Image upload network error: ${error}`,
      };
    }
  },

  // Admin signup
  signupAdmin: async (credentials: {
    email: string;
    password: string;
    name?: string;
  }): Promise<ApiResponse> => {
    console.log('Creating admin account...', credentials.email);
    return makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Health check
  healthCheck: async (): Promise<ApiResponse> => {
    return makeRequest('/health');
  },
};