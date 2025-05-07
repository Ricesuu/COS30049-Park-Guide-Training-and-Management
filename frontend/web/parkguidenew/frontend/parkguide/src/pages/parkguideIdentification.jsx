import React, { useState, useRef } from 'react';
import Sidebar from '../components/sidebar';
import '../styles.css';

// Import plant images
import phalaenopsisImg from '/images/phalaenopsis.jpg';
import dendrobiumImg from '/images/dendrobium.jpg';
import cattleyaImg from '/images/cattleya.jpg';

const ParkguideIdentification = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identificationResult, setIdentificationResult] = useState(null);
  const fileInputRef = useRef(null);

  // Sample orchid data for simulated identification
  const orchidDatabase = [
    {
      id: 1,
      name: 'Phalaenopsis',
      scientificName: 'Phalaenopsis amabilis',
      image: phalaenopsisImg,
      description: 'Phalaenopsis, commonly known as moth orchids, are popular ornamental plants. They have long-lasting flowers that come in a variety of colors including white, pink, and purple. In Borneo, these orchids can be found growing on trees in the rainforest canopy.',
      characteristics: [
        'Flowers arranged in a graceful arch',
        'Broad, fleshy leaves',
        'Aerial roots that grow outside the pot',
        'Flowers can last for several months',
        'Usually has 2-3 leaves at a time'
      ]
    },
    {
      id: 2,
      name: 'Dendrobium',
      scientificName: 'Dendrobium crumenatum',
      image: dendrobiumImg,
      description: 'Dendrobium orchids are known as "Pigeon Orchids" due to their white flowers resembling flying birds. They bloom synchronously about 9 days after a temperature drop (usually after heavy rain), creating spectacular displays in the forest.',
      characteristics: [
        'Tall, reed-like pseudobulbs',
        'Multiple flowers along the stem',
        'Flowers typically last only 1-3 days',
        'Often fragrant blooms',
        'Can have multiple flowering stems'
      ]
    },
    {
      id: 3,
      name: 'Cattleya',
      scientificName: 'Cattleya eldorado',
      image: cattleyaImg,
      description: 'Cattleya orchids are known for their large, showy flowers with intense fragrance. They display vibrant colors including purple, pink, and white, often with contrasting lip patterns. These epiphytic orchids have pseudobulbs that store water and nutrients.',
      characteristics: [
        'Large, colorful flowers with frilled lips',
        'Thick, fleshy pseudobulbs',
        'Strong, pleasant fragrance',
        'Typically one or two large blooms per stem',
        'Thick, leathery leaves'
      ]
    }
  ];

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      setIdentificationResult(null); // Reset any previous results
    }
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
        setIdentificationResult(null); // Reset any previous results
      }
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Reset the form
  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setIdentificationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Simulate plant identification process
  const identifyPlant = () => {
    if (!selectedImage) return;
    
    setIsIdentifying(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Random identification logic - in a real app, this would call a machine learning API
      const isOrchid = Math.random() > 0.3; // 70% chance it's identified as an orchid
      
      if (isOrchid) {
        // Select a random orchid from our database
        const randomIndex = Math.floor(Math.random() * orchidDatabase.length);
        const identifiedOrchid = orchidDatabase[randomIndex];
        
        // Generate a random confidence between 75% and 98%
        const confidence = Math.floor(Math.random() * (98 - 75) + 75);
        
        setIdentificationResult({
          isOrchid: true,
          confidence: confidence,
          orchid: identifiedOrchid
        });
      } else {
        // Not identified as an orchid
        setIdentificationResult({
          isOrchid: false
        });
      }
      
      setIsIdentifying(false);
    }, 2000); // 2 second delay to simulate processing
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="identification-main-content">
        <h1 className="identification-title">Plant Identification</h1>
        
        <p className="identification-introduction">
          Upload a photo of a plant to identify if it's an orchid and which species it might be. 
          Our system can recognize various orchid species commonly found in Borneo's rainforests.
        </p>
        
        <div className="identification-container">
          <div className="upload-section">
            <h2 className="upload-title">Upload Plant Image</h2>
            
            <div 
              className={`upload-area ${previewUrl ? 'with-preview' : ''}`}
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Plant preview" className="image-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <p>Click or drag and drop an image here</p>
                  <p>Supported formats: JPG, PNG</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                className="file-input" 
                accept="image/*" 
                onChange={handleFileSelect}
              />
            </div>
            
            <div className="identification-actions">
              <button 
                className="identify-button" 
                onClick={identifyPlant}
                disabled={!selectedImage || isIdentifying}
              >
                {isIdentifying ? 'Identifying...' : 'Identify Plant'}
              </button>
              <button 
                className="reset-button" 
                onClick={handleReset}
                disabled={!selectedImage || isIdentifying}
              >
                Reset
              </button>
            </div>
          </div>
          
          {identificationResult && (
            <div className="result-section">
              <h2 className="result-title">Identification Results</h2>
              
              {identificationResult.isOrchid ? (
                <div className="orchid-result">
                  <div className="result-header">
                    <div className="result-confidence">
                      <span className="confidence-label">Confidence Level</span>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-level" 
                          style={{ width: `${identificationResult.confidence}%` }}
                        ></div>
                      </div>
                      <span className="confidence-percentage">{identificationResult.confidence}%</span>
                    </div>
                    
                    <div className="orchid-identification">
                      <h3 className="orchid-name">{identificationResult.orchid.name}</h3>
                      <p className="orchid-scientific-name">{identificationResult.orchid.scientificName}</p>
                    </div>
                  </div>
                  
                  <div className="identification-details">
                    <div className="orchid-image-container">
                      <img 
                        src={identificationResult.orchid.image} 
                        alt={identificationResult.orchid.name} 
                        className="identified-orchid-image" 
                      />
                    </div>
                    
                    <div className="orchid-info">
                      <p className="orchid-description">
                        {identificationResult.orchid.description}
                      </p>
                      
                      <div className="orchid-characteristics">
                        <h4 className="characteristics-title">Key Characteristics</h4>
                        <ul className="characteristics-list">
                          {identificationResult.orchid.characteristics.map((characteristic, index) => (
                            <li key={index} className="characteristic-item">{characteristic}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="non-orchid-result">
                  <div className="non-orchid-icon">🌿</div>
                  <h3 className="non-orchid-title">Not an Orchid</h3>
                  <p className="non-orchid-message">
                    The uploaded image does not appear to be an orchid species that our system recognizes.
                  </p>
                  <p className="try-again-message">
                    You can try uploading a different image or check if the plant is clearly visible in the photo.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="identification-tips">
          <h3 className="tips-title">Tips for Better Identification</h3>
          <ul className="tips-list">
            <li className="tip-item">Ensure the plant is well-lit and in focus</li>
            <li className="tip-item">Include the flowers if possible, as they are key identification features</li>
            <li className="tip-item">Take photos from multiple angles for more accurate results</li>
            <li className="tip-item">Avoid shadows or glare on the plant</li>
            <li className="tip-item">If possible, include the entire plant in the frame</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParkguideIdentification;