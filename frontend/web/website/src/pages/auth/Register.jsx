import React from "react";
import { motion } from "framer-motion";

import RegisterForm from "../../components/auth/RegisterForm";
import ImageCarousel from "../../components/ImageCarousel";

import rafflesia from "../../assets/rafflesia.jpg";
import pitcherPlant from "../../assets/pitcher_plant.jpg";
import orchid from "../../assets/orchid.jpg";

export default function RegisterPage() {
  const carouselImages = [
    { src: rafflesia, alt: "Rafflesia" },
    { src: pitcherPlant, alt: "Pitcher Plant" },
    { src: orchid, alt: "Orchid" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="flex flex-col md:flex-row gap-6 min-h-screen justify-center p-6 bg-gray-400"
    >
      {/* Image Carousel */}
      <div className="w-full md:max-w-md h-[50vh] md:h-auto rounded-lg overflow-hidden shadow-md">
        <ImageCarousel images={carouselImages} />
      </div>

      {/* Form Section */}
      <div className="w-full bg-white md:max-w-md rounded-xl shadow-lg p-6 md:p-10">
        <RegisterForm />
      </div>
    </motion.div>
  );
}
