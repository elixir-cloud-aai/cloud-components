import React from 'react';
import { EccUtilsDesignCard } from '@elixir-cloud/design/react';

interface PreviewLayoutProps {
  children: React.ReactNode;
}

const PreviewLayout: React.FC<PreviewLayoutProps> = ({ children }) => {
  return <EccUtilsDesignCard className='part:shadow-inner'>{children}</EccUtilsDesignCard>;
};

export default PreviewLayout;
