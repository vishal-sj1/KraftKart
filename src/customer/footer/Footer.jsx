import React from "react";
import { Link } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";

const Footer = () => {
  return (
    <footer className="bg-[#333333] text-[#D1D5DB]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#FFF8E7]">KraftKart</h2>
            <p className="text-[#4fb6b6]">
              Unleash your creativity with custom designs. Transform your ideas
              into unique products that tell your story.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">  
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#008080] hover:text-[#FFD166] transition-colors" aria-label="Follow us on Instagram">
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#008080] hover:text-[#FFD166] transition-colors" aria-label="Follow us on Facebook">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#008080] hover:text-[#FFD166] transition-colors" aria-label="Follow us on Twitter">
                <XIcon className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#008080] hover:text-[#FFD166] transition-colors" aria-label="Follow us on LinkedIn">
                <LinkedInIcon className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFF8E7] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-[#FFD166] hover:text-[#FFFFFF] transition-colors">About Us</Link></li>
              <li><Link to="/products" className="text-[#FFD166] hover:text-[#FFFFFF] transition-colors">Products</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFF8E7] mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/shipping" className="text-[#FFD166] hover:text-[#FFFFFF] transition-colors">Shipping Information</Link></li>
              <li><Link to="/returns" className="text-[#FFD166] hover:text-[#FFFFFF] transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide" className="text-[#FFD166] hover:text-[#FFFFFF] transition-colors">Size Guide</Link></li>
              <li><Link to="/privacy-policy" className="text-[#FFD166] hover:text-[#FFFFFF] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[#FFD166] hover:text-[#FFFFFF] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFF8E7] mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-center sm:justify-start space-x-3">
                <EmailIcon className="h-5 w-5 text-[#FFD166]" />
                <a href="mailto:support@kraftkart.com" className="text-[#FFD166] hover:text-[#FFFFFF] transition-colors">support@kraftkart.com</a>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-3">
                <CallIcon className="h-5 w-5 text-[#FFD166]" />
                <a href="tel:+919322212711" className="text-[#FFD166] hover:text-[#FFFFFF] transition-colors">(91) 9322212711</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#B3E0DC]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-center">
          <div className="text-lg text-[#4fb6b6]">© {new Date().getFullYear()} KraftKart. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;