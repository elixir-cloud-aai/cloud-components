import React from 'react';
import { ECCClientGa4ghServiceRegistryServices } from '@elixir-cloud/service-registry/react';
import PreviewLayout from '@/components/common/PreviewLayout';
import { endpoints } from '@/utils/endpoints';

export default function ServicesPreview() {
  const handleServiceSelected = (event: any) => {
    console.log('Service selected:', event.detail.serviceId);
    // Navigate to service details or perform other actions
  };

  const handleServicesChanged = (event: any) => {
    console.log('Services data updated:', event.detail.services);
  };

  return (
    <PreviewLayout>
      <ECCClientGa4ghServiceRegistryServices
        baseUrl={endpoints.serviceRegistry}
        search={true}
        filter={true}
        onEccServiceSelected={handleServiceSelected}
        onEccServicesChanged={handleServicesChanged}
      />
    </PreviewLayout>
  );
} 