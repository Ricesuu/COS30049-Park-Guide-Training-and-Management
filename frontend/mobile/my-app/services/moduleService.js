import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { API_URL } from '../src/constants/constants';

// Construct API endpoint
const API_ENDPOINT = `${API_URL}/api`;

/**
 * Fetch modules purchased by the current user
 */
export const fetchUserModules = async () => {
  try {
    // Get user token from storage
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await axios.get(`${API_ENDPOINT}/training-modules/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user modules:', error);
    throw error;
  }
};

/**
 * Fetch all available modules for purchase
 */
export const fetchAvailableModules = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await axios.get(`${API_ENDPOINT}/training-modules/available`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        
      // Ensure all modules have price property
      const modules = response.data.map(module => ({
        ...module,
        price: module.price !== undefined ? parseFloat(module.price) : 0
      }));
      
      return modules;
    } catch (apiError) {
      console.warn('API error, falling back to mock data:', apiError);
      // Return mock data if API fails
      return [
        {
          id: '1',
          name: 'Park Flora Identification',
          description: 'Learn to identify common and rare plant species found in national parks.',
          price: 29.99,
          imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2',
          purchase_status: 'available'
        },
        {
          id: '2',
          name: 'Wildlife Conservation',
          description: 'Comprehensive guide to wildlife conservation techniques and best practices.',
          price: 39.99,
          imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d',
          purchase_status: 'available'
        },
        {
          id: '3',
          name: 'Advanced Visitor Management',
          description: 'Strategies for managing large visitor groups and enhancing their experience.',
          price: 49.99,
          imageUrl: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46',
          purchase_status: 'available'
        }
      ];
    }
  } catch (error) {
    console.error('Error fetching available modules:', error);
    throw error;
  }
};

/**
 * Purchase a module
 */
export const purchaseModule = async (moduleId, paymentDetails) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Create form data for the payment submission with receipt image
    const formData = new FormData();
    formData.append('moduleId', moduleId);
    formData.append('paymentPurpose', `Module Purchase: ${paymentDetails.moduleName}`);
    formData.append('paymentMethod', paymentDetails.paymentMethod);
    formData.append('amountPaid', paymentDetails.amount);
    
    // Add receipt image if provided
    if (paymentDetails.receiptImage) {
      const imageUri = paymentDetails.receiptImage.uri;
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('receipt', {
        uri: imageUri,
        name: filename,
        type,
      });
    }
      
    const response = await axios.post(
      `${API_ENDPOINT}/payment-transactions`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error purchasing module:', error);
    throw error;
  }
};

/**
 * Submit a comment for a module
 */
export const submitComment = async (moduleId, comment) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }
      const response = await axios.post(
      `${API_ENDPOINT}/training-modules/${moduleId}/comment`,
      { comment },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error submitting comment:', error);
    throw error;
  }
};

/**
 * Check if a module is accessible to the current user
 */
export const checkModuleAccess = async (moduleId) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(
      `${API_ENDPOINT}/training-modules/${moduleId}/access`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data.hasAccess;
  } catch (error) {
    console.error('Error checking module access:', error);
    return false; // Default to no access on error
  }
};

/**
 * Get purchase status for a module
 */
export const getModulePurchaseStatus = async (moduleId) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(
      `${API_ENDPOINT}/training-modules/${moduleId}/purchase-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data;  } catch (error) {
    console.error('Error getting module purchase status:', error);
    return { status: 'not_purchased' }; // Default status
  }
};

/**
 * Fetch quiz questions for a module
 */
export const fetchModuleQuiz = async (moduleId) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await axios.get(
      `${API_ENDPOINT}/training-modules/${moduleId}/quiz`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching module quiz:', error);
    throw error;
  }
};

/**
 * Submit quiz answers for a module
 */
export const submitQuizAnswers = async (moduleId, answers, attemptId) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await axios.post(
      `${API_ENDPOINT}/training-modules/${moduleId}/quiz`,
      { answers, attemptId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    throw error;
  }
};
