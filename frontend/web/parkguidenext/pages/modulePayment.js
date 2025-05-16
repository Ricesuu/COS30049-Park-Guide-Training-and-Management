import { useRouter, useSearchParams } from 'next/router';
import { useState, useEffect } from 'react';
import { API_URL } from '../constants/constants';

const ModulePayment = () => {
    const router = useRouter();
    const { moduleId, moduleName, price, returnTo } = router.query;
    
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        receiptImage: null
    });
    
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [preview, setPreview] = useState(null);
    
    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error for this field when user changes input
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };
    
    // Function to handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                receiptImage: file
            });
            
            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Function to validate the form
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
            newErrors.expiryDate = 'Invalid format (MM/YY)';
        }
        
        if (!formData.cvv.trim()) {
            newErrors.cvv = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(formData.cvv)) {
            newErrors.cvv = 'CVV must be 3 or 4 digits';
        }
        
        if (!formData.receiptImage) {
            newErrors.receiptImage = 'Please upload a receipt image';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsProcessing(true);
        
        try {
            // Create form data for submission
            const submitData = new FormData();
            submitData.append('moduleId', moduleId);
            submitData.append('paymentPurpose', `Module Purchase: ${moduleName}`);
            submitData.append('paymentMethod', 'credit_card');
            submitData.append('amountPaid', price);
            submitData.append('receipt', formData.receiptImage);
            
            // Get auth token
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('User not authenticated');
            }
              // Send payment to server
            const response = await fetch(`${API_URL}/api/payment-transactions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });
            
            if (!response.ok) {
                throw new Error('Failed to process payment');
            }
            
            // Show success message
            alert('Payment submitted successfully! Please wait for admin approval.');
            
            // Redirect back to the specified return page
            router.push(returnTo || '/parkguideTraining');
            
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment processing failed: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };
    
    // If query params haven't loaded yet, show loading
    if (!moduleId || !moduleName || !price) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="sidebar flex flex-col justify-start items-center w-72 p-5 bg-gray-200">
                <img src="/images/SFC_LOGO_small.jpg" alt="SFC Logo" className="w-1/2 mb-6" />
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => router.push('/parkguideDashboard')}>
                    Dashboard
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => router.push('/parkguideTraining')}>
                    Training Module
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => router.push('/parkguideCert')}>
                    Certification & Licensing
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => router.push('/parkguideIdentifier')}>
                    Identifier
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => router.push('/parkguideMonitoring')}>
                    Monitoring
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => router.push('/parkguidePerformance')}>
                    Performance
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => router.push('/parkguidePlantInfo')}>
                    Plant Info
                </button>
                <button className="btn w-4/5 bg-red-500 text-white text-center py-2 mb-3 rounded shadow" onClick={() => router.push('/logout')}>
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-grow p-8">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-6">Module Payment</h1>
                    
                    <div className="bg-gray-100 p-4 rounded-lg mb-6">
                        <h2 className="text-lg font-semibold mb-2">Payment Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Module:</span>
                            <span className="font-medium">{moduleName}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Price:</span>
                            <span className="font-medium">${parseFloat(price).toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Cardholder Name</label>
                            <input 
                                type="text" 
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="John Smith"
                            />
                            {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Card Number</label>
                            <input 
                                type="text" 
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                            />
                            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                        </div>
                        
                        <div className="flex justify-between mb-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 mb-1">Expiry Date</label>
                                <input 
                                    type="text" 
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="MM/YY"
                                    maxLength="5"
                                />
                                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                            </div>
                            
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 mb-1">CVV</label>
                                <input 
                                    type="password" 
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="123"
                                    maxLength="4"
                                />
                                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-1">Upload Receipt Image</label>
                            <div className={`border-2 border-dashed p-4 rounded text-center ${errors.receiptImage ? 'border-red-500' : 'border-gray-300'}`}>
                                <input 
                                    type="file" 
                                    name="receiptImage"
                                    onChange={handleImageUpload}
                                    accept="image/jpeg, image/png"
                                    className="hidden"
                                    id="receipt-upload"
                                />
                                <label htmlFor="receipt-upload" className="cursor-pointer text-blue-500 hover:text-blue-700">
                                    Click to upload receipt image
                                </label>
                                {preview && (
                                    <div className="mt-3">
                                        <img src={preview} alt="Receipt preview" className="max-w-xs mx-auto max-h-40 object-contain" />
                                    </div>
                                )}
                            </div>
                            {errors.receiptImage && <p className="text-red-500 text-sm mt-1">{errors.receiptImage}</p>}
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : `Pay $${parseFloat(price).toFixed(2)}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModulePayment;
