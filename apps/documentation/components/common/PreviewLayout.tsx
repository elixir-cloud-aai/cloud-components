import React from 'react';

interface PreviewLayoutProps {
  children: React.ReactNode;
}

const PreviewLayout: React.FC<PreviewLayoutProps> = ({ children }) => {
  return (
    <div className="p-4 border rounded-lg shadow-inner">
      {children}
    </div>
  );
};

export default PreviewLayout; 