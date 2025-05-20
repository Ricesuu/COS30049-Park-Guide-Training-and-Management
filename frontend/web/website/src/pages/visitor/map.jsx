import React, { useEffect } from "react";
import NavigationBar from "../../components/visitor/NavigationBar";
import Footer from "../../components/visitor/Footer";
import { motion } from "framer-motion";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
  useEffect(() => {
    // Initialize the map
    const map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 0.5,
    });    const bounds = [
      [0, 0],
      [2529, 4873],
    ];    // Add the image overlay
    L.imageOverlay('/images/map.jpg', bounds).addTo(map);
    map.fitBounds(bounds);    // Add markers with popups
    const markers = [
      { 
        pos: [1066, 224], 
        title: "Regional Office", 
        desc: "The main administrative center for park management and visitor services",
        img: "/images/locations/regional-office.jpg"
      },
      { 
        pos: [690, 600], 
        title: "Mixed Planting Garden", 
        desc: "A diverse collection of local and exotic plant species arranged in themed sections",
        img: "/images/locations/mixed-planting.jpg"
      },      { 
        pos: [996, 315], 
        title: "Nephentes Garden", 
        desc: "Home to various species of carnivorous pitcher plants native to Borneo",
        img: "/images/locations/nephentes.JPG"
      },      { 
        pos: [1056, 450], 
        title: "Wild Orchids Garden", 
        desc: "Showcasing Borneo's stunning variety of native orchid species",
        img: "/images/locations/orchids.JPG"
      },
      { 
        pos: [1700, 1100], 
        title: "Arboretum", 
        desc: "A living collection of trees, featuring specimens important to orangutan habitats",
        img: "/images/locations/arboretum.jpg"
      },
      { 
        pos: [1160, 1037], 
        title: "Ethobotanical Garden", 
        desc: "Displays traditional medicinal and cultural plants of Sarawak",
        img: "/images/locations/ethnobotanical.jpg"      },
      { 
        pos: [800, 1120], 
        title: "Ferns & Aroids Garden", 
        desc: "Features diverse species of ferns and aroids found in Borneo's rainforests",
        img: "/images/locations/ferns.JPG"
      },
      { 
        pos: [1050, 1450], 
        title: "Bamboo & Fiscus Garden", 
        desc: "Collection of bamboo species and Ficus trees important to local wildlife",
        img: "/images/locations/bamboo.jpg"
      },
      { 
        pos: [560, 2250], 
        title: "Wild Fruits Garden", 
        desc: "Showcases fruit trees that support local wildlife populations",
        img: "/images/locations/fruits.jpg"
      },
    ];

    // Add all markers to the map with images in popups
    markers.forEach(({ pos, title, desc, img }) => {
      L.marker(pos)
        .bindPopup(`
          <div style="max-width: 300px;">
            <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">${title}</h3>
            <img src="${img}" alt="${title}" style="width: 100%; height: 200px; object-fit: cover; margin: 8px 0; border-radius: 4px;">
            <p style="font-size: 14px;">${desc}</p>
          </div>
        `, {
          maxWidth: 320
        })
        .addTo(map);
    });

    // Cleanup function
    return () => {
      map.remove();
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-white text-gray-800"
    >
      <NavigationBar />
      <div className="w-full h-22 bg-emerald-900"></div>
      <section className="pt-20 py-32 bg-gray-100 w-full min-h-[90vh]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center">
            <h3 className="text-green-600 uppercase tracking-wide text-lg font-semibold mb-2">Map</h3>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Semenggoh Wildlife Reserve</h1>
            <p className="text-gray-600 text-lg mb-8 text-center max-w-3xl">
              Discover the beauty of our wildlife reserve through our interactive map.
            </p>
            <div id="map" className="w-full h-[600px] rounded-lg overflow-hidden shadow-xl relative" style={{ zIndex: 0 }}></div>
          </div>
        </div>
      </section>
      <Footer />
    </motion.div>
  );
};

export default MapPage;
