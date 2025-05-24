import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/park_guide/sidebar';
import "../../ParkGuideStyle.css";
import "../../PlantInfoStyle.css";

// Import plant images for proper loading in Vite
import phalaenopsisImg from '/images/phalaenopsis.jpg';
import dendrobiumImg from '/images/dendrobium.jpg';
import cattleyaImg from '/images/cattleya.jpg';
import semenggohImg from '/images/Semenggoh.jpg';
import firstaidImg from '/images/firstaid.jpg';

const ParkguidePlantInfo = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Plant data
  const plants = [
    {
      id: 1,
      name: 'Phalaenopsis',
      scientificName: 'Phalaenopsis amabilis',
      image: phalaenopsisImg,
      family: 'Orchidaceae',
      nativeRegion: 'Borneo, Indonesia, Philippines',
      habitat: 'Tropical rainforests, typically growing on tree branches',
      description: 'Phalaenopsis, commonly known as moth orchids, are popular ornamental plants. They have long-lasting flowers that come in a variety of colors including white, pink, and purple. In Borneo, these orchids can be found growing on trees in the rainforest canopy, where they receive filtered light and high humidity.',
      conservation: 'Vulnerable - Wild populations are declining due to habitat loss and over-collection.',
      medicinalUses: 'In traditional medicine, various parts of the plant have been used to treat inflammation, coughs, and fever.',
      culturalSignificance: 'Considered a symbol of elegance and beauty in many Asian cultures. Used in various ceremonies and as decorative elements in important events.'
    },
    {
      id: 2,
      name: 'Dendrobium',
      scientificName: 'Dendrobium crumenatum',
      image: dendrobiumImg,
      family: 'Orchidaceae',
      nativeRegion: 'Borneo, Malaysia, Singapore, Indonesia',
      habitat: 'Tropical lowland and montane forests',
      description: 'Dendrobium orchids are known as "Pigeon Orchids" due to their white flowers resembling flying birds. They bloom synchronously about 9 days after a temperature drop (usually after heavy rain), creating spectacular displays in the forest. Their flowers are fragrant but only last for a single day.',
      conservation: 'Near Threatened - Populations are decreasing due to deforestation.',
      medicinalUses: 'Stems are used in traditional Chinese medicine to treat fevers and enhance the immune system.',
      culturalSignificance: 'Their synchronized blooming is considered an auspicious sign in some indigenous communities of Borneo.'
    },
    {
      id: 3,
      name: 'Cattleya',
      scientificName: 'Cattleya eldorado',
      image: cattleyaImg,
      family: 'Orchidaceae',
      nativeRegion: 'Borneo and surrounding islands',
      habitat: 'Tropical rainforests, usually growing on tree trunks and branches',
      description: 'Cattleya orchids are known for their large, showy flowers with intense fragrance. They display vibrant colors including purple, pink, and white, often with contrasting lip patterns. These epiphytic orchids have pseudobulbs that store water and nutrients, allowing them to survive in the canopy where water can be scarce.',
      conservation: 'Endangered - Wild populations have decreased significantly due to habitat destruction and illegal collection.',
      medicinalUses: 'Extracts from leaves have been studied for potential anti-inflammatory properties.',
      culturalSignificance: 'Known as the "Queen of Orchids" and considered a symbol of luxury. Used in traditional ceremonies and as status symbols by indigenous communities.'
    },
    {
      id: 4,
      name: 'Rafflesia',
      scientificName: 'Rafflesia arnoldii',
      image: semenggohImg, // Using imported image
      family: 'Rafflesiaceae',
      nativeRegion: 'Borneo and Sumatra',
      habitat: 'Tropical rainforests, parasitic on Tetrastigma vines',
      description: 'Rafflesia produces the largest individual flower in the world, reaching up to 3 feet in diameter. Known as the "corpse flower," it emits a strong odor similar to rotting meat to attract carrion flies for pollination. The plant has no visible stems, leaves, or roots as it\'s a parasitic plant that grows inside its host vine.',
      conservation: 'Critically Endangered - Extremely rare and threatened by habitat loss.',
      medicinalUses: 'In traditional medicine, buds are used to assist in childbirth recovery and to treat fever.',
      culturalSignificance: 'Considered a biological wonder and national pride. Many myths and folklore surround this spectacular flower throughout Southeast Asia.'
    },
    {
      id: 5,
      name: 'Nepenthes',
      scientificName: 'Nepenthes rajah',
      image: firstaidImg, // Using imported image
      family: 'Nepenthaceae',
      nativeRegion: 'Mount Kinabalu, Borneo',
      habitat: 'Montane forest, typically in mossy areas with high humidity',
      description: 'Nepenthes rajah is one of the largest pitcher plants in the world, capable of holding up to 3.5 liters of liquid in its trap. The pitchers are modified leaves that form insect-trapping structures filled with digestive enzymes. This carnivorous plant supplements its nutrient intake by capturing and digesting insects and small vertebrates.',
      conservation: 'Endangered - Limited distribution and vulnerable to climate change.',
      medicinalUses: 'The pitcher fluid has been used in traditional medicine to treat eye inflammation and digestive issues.',
      culturalSignificance: 'Featured in many indigenous stories as a symbol of adaptation and resilience. Used as containers by forest dwellers.'
    }
  ];

  // Function to open plant details
  const openPlantDetails = (plant) => {
    setSelectedPlant(plant);
  };

  // Function to close plant details
  const closePlantDetails = () => {
    setSelectedPlant(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main-content">
        <div className="page-title-card">
          <h1>Plant Information</h1>
          <p>Learn about the diverse plant species found in our parks and their significance.</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading plant information...</div>
        ) : (
          <div className="plant-grid">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="plant-card"
                onClick={() => openPlantDetails(plant)}
              >
                <div className="plant-image-container">
                  <img src={plant.image} alt={plant.name} className="plant-image" />
                </div>
                <div className="plant-content">
                  <h3 className="plant-name">{plant.name}</h3>
                  <p className="scientific-name">{plant.scientificName}</p>
                  <p className="plant-info">{plant.habitat}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedPlant && (
          <div className="modal-overlay" onClick={closePlantDetails}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={closePlantDetails}>×</button>
              <h2 className="modal-title">{selectedPlant.name}</h2>
              <div className="modal-content">
                <div>
                  <img src={selectedPlant.image} alt={selectedPlant.name} className="modal-image" />
                </div>
                <div className="modal-info">
                  <div className="info-section">
                    <h3>Scientific Name</h3>
                    <p>{selectedPlant.scientificName}</p>
                  </div>
                  <div className="info-section">
                    <h3>Family</h3>
                    <p>{selectedPlant.family}</p>
                  </div>
                  <div className="info-section">
                    <h3>Native Region</h3>
                    <p>{selectedPlant.nativeRegion}</p>
                  </div>
                  <div className="info-section">
                    <h3>Habitat</h3>
                    <p>{selectedPlant.habitat}</p>
                  </div>
                  <div className="info-section">
                    <h3>Description</h3>
                    <p>{selectedPlant.description}</p>
                  </div>
                  <div className="info-section">
                    <h3>Conservation Status</h3>
                    <p>{selectedPlant.conservation}</p>
                  </div>
                  <div className="info-section">
                    <h3>Medicinal Uses</h3>
                    <p>{selectedPlant.medicinalUses}</p>
                  </div>
                  <div className="info-section">
                    <h3>Cultural Significance</h3>
                    <p>{selectedPlant.culturalSignificance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkguidePlantInfo;