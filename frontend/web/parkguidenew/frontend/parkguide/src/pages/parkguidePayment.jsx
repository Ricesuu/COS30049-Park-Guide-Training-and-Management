import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/sidebar';

const ParkguidePayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const certTitle = queryParams.get('cert');
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
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
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
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

  const handlePayment = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing with a timeout
    setTimeout(() => {
      setIsProcessing(false);
      
      // After successful payment, navigate to the quiz
      navigate(`/quiz?cert=${certTitle}`);
    }, 2000);
  };

  // Certificate price is based on a simple algorithm using the cert title
  const certNumber = certTitle ? parseInt(certTitle.replace(/[^0-9]/g, '')) : 1;
  const certPrice = certNumber * 25; // Each cert costs $25 × its number

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="payment-main-content">
        <div className="payment-container">
          <h2 className="payment-title">Payment for {certTitle}</h2>
            <div className="payment-summary">
            <h3>Order Summary</h3>
            <div className="payment-item">
              <span>{certTitle} Certificate</span>
              <span>RM{certPrice.toFixed(2)}</span>
            </div>
            <div className="payment-total">
              <span>Total</span>
              <span>RM{certPrice.toFixed(2)}</span>
            </div>
          </div>
          
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
              <button type="submit" className="pay-button" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay RM${certPrice.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParkguidePayment;