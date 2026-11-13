import React from 'react';
import { ECCClientGa4ghServiceRegistryService } from '@elixir-cloud/service-registry/react';
import PreviewLayout from '@/components/common/PreviewLayout';
import { endpoints, sampleIds } from '@/utils/endpoints';

export default function ServicePreview() {
  const handleServiceChanged = (event: any) => {
    console.log('Service data updated:', event.detail.service);
  };

  // `baseUrl` rather than `provider`: the component reads `provider` only on
  // its first update, which runs before React sets it on the server-rendered
  // element, but it reloads when `baseUrl` changes
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
