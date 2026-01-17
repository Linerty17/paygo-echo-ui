
import React from 'react';

interface ServiceIconProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ icon, label, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center space-y-1 cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
        <div className="text-2xl">
          {icon}
        </div>
      </div>
      <span className="text-xs text-foreground font-medium text-center">{label}</span>
    </div>
  );
};

export default ServiceIcon;
