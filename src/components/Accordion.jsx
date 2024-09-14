import React, { useState } from 'react';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi'; // Import icons from react-icons

const Accordion = ({ ky, title, children, darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-zinc-800 border-zinc-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`}>
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleAccordion}>
        <h3 className="text-xl font-semibold">{title}</h3>
        <span>
          {isOpen ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
        </span>
      </div>
      {isOpen && (
        <div key={ky} className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
