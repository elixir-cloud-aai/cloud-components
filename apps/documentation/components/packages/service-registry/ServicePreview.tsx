import React from 'react';
import { ECCClientGa4ghServiceRegistryService } from '@elixir-cloud/service-registry/react';
import { RestServiceRegistryProvider } from '@elixir-cloud/service-registry/providers';
import PreviewLayout from '@/components/common/PreviewLayout';

export default function ServicePreview() {
  const provider = new RestServiceRegistryProvider(
    'https://cloud-registry.anuragxd.com/ga4gh/registry/v1'
  );

  const handleServiceChanged = (event: any) => {
    console.log('Service data updated:', event.detail.service);
  };

  return (
    <PreviewLayout>
      <ECCClientGa4ghServiceRegistryService 
        provider={provider}
        serviceId="JOMGD2"
        onEccServiceChanged={handleServiceChanged}
      />
    </PreviewLayout>
  );
}
