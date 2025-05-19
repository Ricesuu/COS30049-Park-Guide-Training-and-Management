import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../../ParkGuideStyle.css";
import "./ModulePurchase.css";
import { auth } from '../../Firebase';

const ModulePurchase = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [module, setModule] = useState(null);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Add window resize listener for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          console.error('User not authenticated');
          setError('User not authenticated. Please log in again.');
          setLoading(false);
          return;
        }
        
        const token = await user.getIdToken();
        
        let statusResponse;
        try {
          statusResponse = await fetch(`/api/training-modules/${moduleId}/purchase-status`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!statusResponse.ok) {
            const errorData = await statusResponse.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to fetch module purchase status: ${statusResponse.status} ${statusResponse.statusText}`);
          }
        } catch (fetchError) {
          console.error('Network error checking purchase status:', fetchError);
          throw new Error(`Network error: ${fetchError.message}`);
        }
        
        let statusData;
        try {
          statusData = await statusResponse.json();
          console.log('Module purchase status:', statusData);
        } catch (parseError) {
          console.error('Error parsing purchase status response:', parseError);
          throw new Error('Failed to read purchase status data');
        }
        
        setPurchaseStatus(statusData.status);
        
        if (statusData.module) {
          setModule(statusData.module);
        } else if (statusData.purchase?.module) {
          setModule(statusData.purchase.module);
        } else {
          try {
            const moduleResponse = await fetch(`/api/training-modules/${moduleId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (!moduleResponse.ok) {
              const errorData = await moduleResponse.json().catch(() => ({}));
              throw new Error(errorData.error || `Failed to fetch module details: ${moduleResponse.status} ${moduleResponse.statusText}`);
            }
            
            const moduleData = await moduleResponse.json();
            setModule(moduleData);
          } catch (moduleError) {
            console.error('Error fetching module details:', moduleError);
            throw new Error(`Could not load module information: ${moduleError.message}`);
          }
        }
        
      } catch (err) {
        console.error('Error fetching module data:', err);
        setError(err.message || 'An unknown error occurred while loading module information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModuleDetails();
  }, [moduleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for credit card number formatting
    if (name === 'cardNumber') {
      // Remove non-digits and format with spaces
      const digits = value.replace(/\D/g, '');
      const formattedValue = formatCreditCardNumber(digits);
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } 
    // Special handling for expiry date formatting (MM/YY)
    else if (name === 'expiryDate') {
      // Format expiry date as MM/YY
      const cleanValue = value.replace(/\D/g, '');
      let formattedValue = '';
      
      if (cleanValue.length <= 2) {
        formattedValue = cleanValue;
      } else {
        formattedValue = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
      }
      
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    }
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Helper function to format credit card number with spaces
  const formatCreditCardNumber = (value) => {
    const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
    const onlyNumbers = value.replace(/[^\d]/g, '');
    
    return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
      [$1, $2, $3, $4].filter(group => !!group).join(' ')
    );
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in format MM/YY';
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Show payment confirmation modal instead of processing immediately
    setShowConfirmation(true);
  };

  const handleConfirmedPayment = async () => {
    setShowConfirmation(false);
    setIsProcessing(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      const token = await user.getIdToken();
      
      if (module.price === 0 || module.price === '0' || module.price === '0.00') {
        let enrollResponse;
        try {
          enrollResponse = await fetch(`/api/training-modules/${moduleId}/enroll`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ moduleName: module.module_name || module.name })
          });
          
          if (!enrollResponse.ok) {
            const errorData = await enrollResponse.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to enroll in module: ${enrollResponse.status} ${enrollResponse.statusText}`);
          }
        } catch (fetchError) {
          console.error('Network error during enrollment:', fetchError);
          throw new Error(`Network error: ${fetchError.message}`);
        }
        
        let enrollData;
        try {
          enrollData = await enrollResponse.json();
          console.log('Enrollment successful:', enrollData);
        } catch (parseError) {
          console.error('Error parsing enrollment response:', parseError);
          throw new Error('Failed to process enrollment response');
        }
        
        setPurchaseStatus('active');
        
        // Generate transaction details for the receipt
        setTransactionDetails({
          transactionId: `FREE-${Date.now()}`,
          date: new Date().toLocaleString(),
          module: module.module_name || module.name,
          price: '0.00',
          status: 'Completed'
        });
        
        // Show receipt for free modules
        setShowReceipt(true);
      } else {
        // For paid modules, simulate payment processing
        setTimeout(() => {
          try {
            console.log('Payment processed successfully');
            
            // Generate transaction details for the receipt with appropriate details
            const transactionId = `TRX-${Date.now()}`;
            const transactionDate = new Date().toLocaleString();
            
            setTransactionDetails({
              transactionId: transactionId,
              date: transactionDate,
              module: module.module_name || module.name,
              price: parseFloat(module.price).toFixed(2),
              cardLast4: formData.cardNumber.slice(-4),
              status: 'Completed'
            });
            
            setPurchaseStatus('active');
            
            // Show receipt instead of navigating away immediately
            setShowReceipt(true);
          } catch (paymentError) {
            console.error('Payment processing error:', paymentError);
            throw new Error(`Payment processing failed: ${paymentError.message}`);
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      alert('Payment failed: ' + (err.message || 'Unknown error occurred'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    // Navigate back to training page
    navigate('/park_guide/training');
  };

  const handleConfirmationCancel = () => {
    setShowConfirmation(false);
  };
  const enrollInFreeModule = async () => {
    try {
      setIsProcessing(true);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      const token = await user.getIdToken();
      
      let enrollResponse;
      try {
        enrollResponse = await fetch(`/api/training-modules/${moduleId}/enroll`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ moduleName: module.module_name || module.name })
        });
        
        if (!enrollResponse.ok) {
          const errorData = await enrollResponse.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to enroll in module: ${enrollResponse.status} ${enrollResponse.statusText}`);
        }
      } catch (fetchError) {
        console.error('Network error during enrollment:', fetchError);
        throw new Error(`Network error: ${fetchError.message}`);
      }
      
      let enrollData;
      try {
        enrollData = await enrollResponse.json();
        console.log('Enrollment successful:', enrollData);
      } catch (parseError) {
        console.error('Error parsing enrollment response:', parseError);
        throw new Error('Failed to process enrollment response');
      }
      
      setPurchaseStatus('active');
      
      // Generate transaction details for the receipt
      setTransactionDetails({
        transactionId: `FREE-${Date.now()}`,
        date: new Date().toLocaleString(),
        module: module.module_name || module.name,
        price: '0.00',
        status: 'Completed'
      });
      
      // Show receipt instead of navigating away
      setShowReceipt(true);
    } catch (err) {
      console.error('Error enrolling in module:', err);
      alert('Enrollment failed: ' + (err.message || 'Unknown error occurred'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="payment-main-content">
      <div className="payment-container">
        <h2>Loading module information...</h2>
        <div className="loading-spinner"></div>
        <p className="loading-message">Please wait while we fetch your module details. This might take a few seconds.</p>
      </div>
    </div>;
  }

  if (error) {
    return <div className="payment-main-content">
      <div className="payment-container">
        <h2>Error</h2>
        <div className="error-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p className="error-message">{error}</p>
        </div>
        <div className="error-actions">
          <button 
            onClick={() => navigate('/park_guide/training')} 
            className="pay-button"
          >
            Back to Training
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="back-button"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>;
  }

  if (!module) {
    return <div className="payment-main-content">
      <div className="payment-container">
        <h2>Module Not Found</h2>
        <div className="error-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <p>The requested module could not be found. It may have been removed or you might not have access to it.</p>
        </div>
        <button 
          onClick={() => navigate('/park_guide/training')} 
          className="pay-button"
        >
          Back to Training
        </button>
      </div>
    </div>;
  }

  if (purchaseStatus === 'active') {
    return <div className="payment-main-content">
      <div className="payment-container">
        <h2>Module Already Purchased</h2>
        <p>You have already enrolled in {module.module_name || module.name}.</p>
        <div className="payment-summary">
          <h3>Module Details</h3>
          <div className="payment-item">
            <span>Name:</span>
            <span>{module.module_name || module.name}</span>
          </div>
          {module.description && (
            <div className="payment-item">
              <span>Description:</span>
              <span>{module.description}</span>
            </div>
          )}
        </div>
        <button 
          onClick={() => navigate('/park_guide/training')} 
          className="pay-button"
        >
          Go to My Modules
        </button>
      </div>
    </div>;
  }

  if (purchaseStatus === 'payment_pending') {
    return <div className="payment-main-content">
      <div className="payment-container">
        <h2>Payment Pending</h2>
        <p>Your payment for {module.module_name || module.name} is being processed. Please check back later.</p>
        <button 
          onClick={() => navigate('/park_guide/training')} 
          className="pay-button"
        >
          Back to Training
        </button>
      </div>
    </div>;
  }

  if (purchaseStatus === 'payment_rejected') {
    return <div className="payment-main-content">
      <div className="payment-container">
        <h2>Payment Rejected</h2>
        <p>Your previous payment for {module.module_name || module.name} was rejected. Please try again.</p>
        <button 
          onClick={() => setShowForm(true)} 
          className="pay-button"
        >
          Try Again
        </button>
      </div>
    </div>;
  }

  if (module.price === 0 || module.price === '0' || module.price === '0.00') {
    return <div className="payment-main-content">
      <div className="payment-container">
        <h2>Enroll in {module.module_name || module.name}</h2>
        <div className="status-badge free">FREE MODULE</div>
        <p>This is a free module. No payment is required.</p>
        
        <div className="payment-summary">
          <h3>Module Details</h3>
          <div className="payment-item">
            <span>Name:</span>
            <span>{module.module_name || module.name}</span>
          </div>
          {module.description && (
            <div className="payment-item">
              <span>Description:</span>
              <span>{module.description}</span>
            </div>
          )}
          <div className="payment-total">
            <span>Price:</span>
            <span>Free</span>
          </div>
        </div>
        
        <button 
          className="pay-button" 
          onClick={enrollInFreeModule}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="processing-spinner"></span>
              Processing...
            </>
          ) : 'Enroll Now'}
        </button>
        
        <button 
          onClick={() => navigate('/park_guide/training')} 
          className="back-button"
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Back to Training
        </button>
      </div>
    </div>;
  }

  return (
    <div className="payment-main-content">
      {/* Payment confirmation modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Confirm Payment</h3>
            <div className="confirmation-details">
              <p>You are about to pay for:</p>
              <h4>{module.module_name || module.name}</h4>
              <div className="payment-total confirm">
                <span>Total amount:</span>
                <span>${parseFloat(module.price).toFixed(2)}</span>
              </div>
              <p className="payment-method">
                Payment method: Credit card ending in {formData.cardNumber.slice(-4)}
              </p>
            </div>
            <div className="modal-actions">
              <button 
                className="confirm-button" 
                onClick={handleConfirmedPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="processing-spinner"></span>
                    Processing...
                  </>
                ) : 'Confirm Payment'}
              </button>
              <button 
                className="cancel-button" 
                onClick={handleConfirmationCancel}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Receipt modal */}
      {showReceipt && transactionDetails && (
        <div className="modal-overlay">
          <div className="modal-container receipt">
            <div className="receipt-header">
              <h3>Payment Receipt</h3>
              <div className="receipt-status success">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Payment Successful</span>
              </div>
            </div>
            
            <div className="receipt-body">
              <div className="receipt-item">
                <span>Transaction ID:</span>
                <span>{transactionDetails.transactionId}</span>
              </div>
              <div className="receipt-item">
                <span>Date:</span>
                <span>{transactionDetails.date}</span>
              </div>
              <div className="receipt-item">
                <span>Module:</span>
                <span>{transactionDetails.module}</span>
              </div>
              <div className="receipt-item">
                <span>Amount:</span>
                <span>${transactionDetails.price}</span>
              </div>
              {transactionDetails.cardLast4 && (
                <div className="receipt-item">
                  <span>Payment Method:</span>
                  <span>Credit Card (ending in {transactionDetails.cardLast4})</span>
                </div>
              )}
              <div className="receipt-item">
                <span>Status:</span>
                <span>{transactionDetails.status}</span>
              </div>
            </div>
            
            <div className="receipt-footer">
              <p>Thank you for your purchase. You can now access your module in your training dashboard.</p>
              <button 
                className="pay-button" 
                onClick={handleReceiptClose}
              >
                Go to My Modules
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`payment-container ${isMobileView ? 'mobile' : ''}`}>
        <h2 className="payment-title">Payment for {module.module_name || module.name}</h2>
        <div className="status-badge paid">PAID MODULE</div>
        
        <div className="payment-summary">
          <h3>Order Summary</h3>
          <div className="payment-item">
            <span>{module.module_name || module.name}</span>
            <span>${parseFloat(module.price).toFixed(2)}</span>
          </div>
          {module.description && (
            <div className="payment-item">
              <span>Description:</span>
              <span>{module.description}</span>
            </div>
          )}
          <div className="payment-total">
            <span>Total</span>
            <span>${parseFloat(module.price).toFixed(2)}</span>
          </div>
        </div>
        
        {showForm || purchaseStatus === 'not_purchased' ? (
          <form className="payment-form" onSubmit={handlePayment}>
            <h3>Payment Details</h3>
            
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="cardName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className={errors.cardName ? 'error' : ''}
                />
                {errors.cardName && <div className="error-message">{errors.cardName}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={errors.cardNumber ? 'error' : ''}
                />
                {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    className={errors.expiryDate ? 'error' : ''}
                  />
                  {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
                </div>
                
                <div className="form-group half">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="password"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="4"
                    className={errors.cvv ? 'error' : ''}
                  />
                  {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Billing Address</h3>
              
              <div className="form-group">
                <label htmlFor="addressLine1">Address</label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  className={errors.addressLine1 ? 'error' : ''}
                />
                {errors.addressLine1 && <div className="error-message">{errors.addressLine1}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Kuching"
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <div className="error-message">{errors.city}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Sarawak"
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <div className="error-message">{errors.state}</div>}
                </div>
                
                <div className="form-group half">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="93050"
                    className={errors.zipCode ? 'error' : ''}
                  />
                  {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                </div>
              </div>
            </div>
            
            <div className="secure-payment">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Secure payment processing</span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="pay-button" disabled={isProcessing} style={{ flex: 1 }}>
                {isProcessing ? (
                  <>
                    <span className="processing-spinner"></span>
                    Processing...
                  </>
                ) : `Pay $${parseFloat(module.price).toFixed(2)}`}
              </button>
              
              <button 
                type="button" 
                onClick={() => navigate('/park_guide/training')} 
                className="back-button"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => setShowForm(true)} 
              className="pay-button"
            >
              Proceed to Payment
            </button>
            
            <button 
              onClick={() => navigate('/park_guide/training')} 
              className="back-button"
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'block',
                width: '100%'
              }}
            >
              Back to Training
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulePurchase;