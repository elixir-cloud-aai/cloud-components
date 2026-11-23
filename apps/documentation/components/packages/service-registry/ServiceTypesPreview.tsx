import React from 'react';
import { ECCClientGa4ghServiceRegistryServiceTypes } from '@elixir-cloud/service-registry/react';
import PreviewLayout from '@/components/common/PreviewLayout';
import { endpoints } from '@/utils/endpoints';

export default function ServiceTypesPreview() {
  const handleServiceTypesChanged = (event: any) => {
    console.log('Service types updated:', event.detail.serviceTypes);
  };

  return (
    <PreviewLayout>
      <ECCClientGa4ghServiceRegistryServiceTypes
        baseUrl={endpoints.serviceRegistry}
        onEccServiceTypesChanged={handleServiceTypesChanged}
      />
    </PreviewLayout>
  );
}
