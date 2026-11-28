import React from 'react';
import { ECCClientGa4ghServiceRegistryServiceInfo } from '@elixir-cloud/service-registry/react';
import PreviewLayout from '@/components/common/PreviewLayout';
import { endpoints } from '@/utils/endpoints';

export default function ServiceInfoPreview() {
  const handleServiceInfoChanged = (event: any) => {
    console.log('Service info updated:', event.detail.serviceInfo);
  };

  return (
    <PreviewLayout>
      <ECCClientGa4ghServiceRegistryServiceInfo
        baseUrl={endpoints.serviceRegistry}
        onEccServiceInfoChanged={handleServiceInfoChanged}
      />
    </PreviewLayout>
  );
}
