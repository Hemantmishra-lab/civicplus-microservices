import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { FaFilePdf, FaWhatsapp, FaInstagram, FaRobot } from 'react-icons/fa';

import jsPDF from 'jspdf';

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const generateAndDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add content to the PDF
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("CivicPlus Platform Brochure", 20, 30);
      
      doc.setFontSize(16);
      doc.setTextColor(60, 60, 60);
      doc.text("Bridging the Gap Between Citizens & Government", 20, 45);
      
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      
      const content = [
        "What is CivicPlus?",
        "CivicPlus is a modern Smart City Complaint Management platform designed to create seamless",
        "communication between citizens and government authorities.",
        "",
        "Key Features:",
        "- Real-time Issue Tracking",
        "- Geo-tagged Complaints",
        "- Automated Department Routing",
        "- Transparent Status Updates",
        "- Community Forums & Polls",
        "",
        "Our Mission:",
        "To empower citizens and streamline municipal workflows, building smarter and more",
        "responsive cities for the future.",
        "",
        "Contact Us:",
        "WhatsApp: +91 6206034538",
        "Instagram: @civic.plus"
      ];
      
      let y = 60;
      content.forEach(line => {
        if (line.startsWith("What is") || line.startsWith("Key Features") || line.startsWith("Our Mission") || line.startsWith("Contact Us")) {
          doc.setFont(undefined, 'bold');
          doc.setTextColor(40, 40, 40);
        } else {
          doc.setFont(undefined, 'normal');
          doc.setTextColor(80, 80, 80);
        }
        
        doc.text(line, 20, y);
        y += 8;
      });
      
      // Save the PDF
      doc.save("CivicPlus_Brochure.pdf");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate the brochure. Please try again later.");
    }
  };

  const links = [
    {
      onClick: generateAndDownloadPDF,
      icon: <FaFilePdf size={20} />,
      label: "Download Brochure",
      delay: "0s"
    },
    {
      href: "https://wa.me/916206034538",
      icon: <FaWhatsapp size={20} />,
      label: "WhatsApp",
      delay: "0.05s"
    },
    {
      href: "https://www.instagram.com/civic.plus/",
      icon: <FaInstagram size={20} />,
      label: "Instagram",
      delay: "0.1s"
    },
    {
      onClick: () => console.log("Chatbot opened"),
      icon: <FaRobot size={20} />,
      label: "Chatbot",
      delay: "0.15s"
    }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-4">
      {/* Expanded Menu */}
      <div 
        className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${
          isOpen ? 'scale-100 opacity-100 visible' : 'scale-75 opacity-0 invisible'
        }`}
      >
        {links.reverse().map((link, index) => (
          link.href ? (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg text-slate-700 dark:text-slate-200 hover:scale-110 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              style={{ transitionDelay: isOpen ? link.delay : '0s' }}
              title={link.label}
            >
              {link.icon}
            </a>
          ) : (
            <button
              key={index}
              onClick={link.onClick}
              className="flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg text-slate-700 dark:text-slate-200 hover:scale-110 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              style={{ transitionDelay: isOpen ? link.delay : '0s' }}
              title={link.label}
            >
              {link.icon}
            </button>
          )
        ))}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-14 h-14 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all"
        style={{
          background: 'linear-gradient(135deg, #4fb3b3, #e5a753)',
        }}
        aria-label="Toggle navigation menu"
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={28} className="text-white" />}
        </div>
      </button>
    </div>
  );
}
