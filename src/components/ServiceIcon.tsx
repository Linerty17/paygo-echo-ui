
import React from 'react';

interface ServiceIconProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ icon, label, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center space-y-2 cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow duration-200">
        <div className="text-3xl">
          {icon}
        </div>
      </div>
      <span className="text-sm text-gray-700 font-medium text-center">{label}</span>
    </div>
  );
};

export default ServiceIcon;
