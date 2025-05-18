import React from "react";
import { motion } from "framer-motion";
import LoginForm from "../../components/auth/LoginForm";
import ImageCarousel from "../../components/auth/ImageCarousel";

import hornbill from "../../assets/hornbill.jpg";
import hawksbillTurtle from "../../assets/hawksbill_turtle.jpg";
import orangUtan from "../../assets/orang_utan.jpeg";

export default function LoginPage() {
  const carouselImages = [
    { src: hornbill, alt: "Hornbill" },
    { src: hawksbillTurtle, alt: "Hawksbill Turtle" },
    { src: orangUtan, alt: "Orangutan" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="flex flex-col-reverse md:flex-row gap-6 min-h-screen justify-center p-15 bg-gray-400"
    >
      <div className="relative w-full md:max-w-md h-auto py-10 px-4 md:px-10 rounded-lg shadow-lg shadow-black/20 md:pb-20 flex flex-col justify-between bg-white">
        <LoginForm />
      </div>

      <div className="w-full md:max-w-md h-[50vh] md:h-auto rounded-lg overflow-hidden shadow-md flex-shrink-0">
        <ImageCarousel images={carouselImages} />
      </div>
    </motion.div>
  );
}
