import React from 'react';

interface PreviewLayoutProps {
  children: React.ReactNode;
}

const PreviewLayout: React.FC<PreviewLayoutProps> = ({ children }) => {
  return (
    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-inner">
      {children}
    </div>
  );
};

export default PreviewLayout; 