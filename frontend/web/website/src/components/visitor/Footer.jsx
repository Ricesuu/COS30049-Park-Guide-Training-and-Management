/***********************************************************************
 * FOOTER COMPONENT
 * Site-wide footer with:
 * - Company contact information
 * - Navigation links to main pages
 * - Social media links
 * - Legal information and copyright notice
 ***********************************************************************/
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-800 text-white py-10 pb-6 w-full">
      <div className="w-full px-8">
        <div className="flex flex-col md:flex-row justify-between max-w-[1600px] mx-auto">
          {/******************************************************************
           * COMPANY INFORMATION SECTION
           * Displays logo, contact email, phone, and address
           ******************************************************************/}
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-3 inline-block border-b-2 border-green-500 pb-1">
              SFC
            </h3>{" "}
            <div className="space-y-3 mt-3">
              <p className="flex items-center hover:text-green-400 transition-colors cursor-pointer text-base">
                <FaEnvelope className="w-6 h-6 mr-3 text-green-400" />
                info@parkguide.com
              </p>
              <p className="flex items-center hover:text-green-400 transition-colors cursor-pointer text-base">
                <FaPhone className="w-6 h-6 mr-3 text-green-400" />
                +1 (123) 456-7890
              </p>
              <p className="flex items-center hover:text-green-400 transition-colors cursor-pointer text-base">
                <FaMapMarkerAlt className="w-6 h-6 mr-3 text-green-400" />
                123 Nature Park Ave
              </p>
            </div>
          </div>
          {/* Right Side Content */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-48">
            {/******************************************************************
             * NAVIGATION LINKS SECTION
             * Quick links to main pages of the site
             ******************************************************************/}
            <div>
              <h3 className="text-xl font-semibold mb-3 inline-block border-b-2 border-green-500 pb-1">
                Navigation
              </h3>
              <ul className="space-y-2 mt-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors flex items-center text-base"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => navigate("/visitor/about")}
                    className="hover:text-green-400 transition-colors flex items-center text-base"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => navigate("/visitor/info")}
                    className="hover:text-green-400 transition-colors flex items-center text-base"
                  >
                    Info
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => navigate("/visitor/map")}
                    className="hover:text-green-400 transition-colors flex items-center text-base"
                  >
                    Map
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => navigate("/visitor/feedback")}
                    className="hover:text-green-400 transition-colors flex items-center text-base"
                  >
                    Feedback
                  </a>
                </li>
              </ul>
            </div>
            {/******************************************************************
             * SOCIAL AND LEGAL SECTION
             * Social media links and legal information
             ******************************************************************/}
            <div>
              <h3 className="text-xl font-semibold mb-3 inline-block border-b-2 border-green-500 pb-1">
                Social Links
              </h3>{" "}
              <div className="flex space-x-4 mt-3">
                <a
                  href="#"
                  className="bg-gray-700 p-2.5 rounded-full hover:bg-green-600 transition-colors"
                >
                  <FaInstagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="bg-gray-700 p-2.5 rounded-full hover:bg-green-600 transition-colors"
                >
                  <FaFacebookF className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="bg-gray-700 p-2.5 rounded-full hover:bg-green-600 transition-colors"
                >
                  <FaTwitter className="w-5 h-5 text-white" />
                </a>
              </div>
              {/* Legal Links */}
              <div className="mt-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-base block mb-2"
                >
                  Terms and Conditions
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors text-base block"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
        {/******************************************************************
         * COPYRIGHT SECTION
         * Copyright notice with dynamically updated year
         ******************************************************************/}
        <div className="border-t border-gray-700 w-full max-w-screen mt-8 pt-5 pb-2 text-center text-gray-400 text-base">
          <p className="my-1">
            &copy; {new Date().getFullYear()} Park Guide Training and
            Management. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
