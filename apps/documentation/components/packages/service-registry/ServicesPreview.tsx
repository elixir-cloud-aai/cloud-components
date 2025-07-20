import React from 'react';
import { ECCClientGa4ghServiceRegistryServices } from '@elixir-cloud/service-registry/react';
import { RestServiceRegistryProvider } from '@elixir-cloud/service-registry/providers';
import PreviewLayout from '@/components/common/PreviewLayout';

export default function ServicesPreview() {
  const provider = new RestServiceRegistryProvider(
    'https://cloud-registry.anuragxd.com/ga4gh/registry/v1'
  );

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
        provider={provider}
        search={true}
        filter={true}
        onEccServiceSelected={handleServiceSelected}
        onEccServicesChanged={handleServicesChanged}
      />
    </PreviewLayout>
  );
} 