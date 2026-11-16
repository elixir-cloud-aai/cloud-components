import React from 'react';
import { ECCClientGa4ghServiceRegistryService } from '@elixir-cloud/service-registry/react';
import PreviewLayout from '@/components/common/PreviewLayout';
import { endpoints, sampleIds } from '@/utils/endpoints';

export default function ServicePreview() {
  const handleServiceChanged = (event: any) => {
    console.log('Service data updated:', event.detail.service);
  };

  return (
    <PreviewLayout>
      <ECCClientGa4ghServiceRegistryService
        baseUrl={endpoints.serviceRegistry}
        serviceId={sampleIds.service}
        onEccServiceChanged={handleServiceChanged}
      />
    </PreviewLayout>
  );
}
