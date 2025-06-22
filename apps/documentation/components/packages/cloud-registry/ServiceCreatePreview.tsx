import React from 'react';
import { ECCClientElixirCloudRegistryServiceCreate } from '@elixir-cloud/cloud-registry/react';
import { RestCloudRegistryProvider } from '@elixir-cloud/cloud-registry/providers';
import PreviewLayout from '@/components/common/PreviewLayout';

export default function ServiceCreatePreview() {
  const provider = new RestCloudRegistryProvider(
    'https://cloud-registry.anuragxd.com/ga4gh/registry/v1'
  );

  const handleServiceCreated = (event: any) => {
    console.log('Service created successfully:', event.detail);
    alert(`Service created with ID: ${event.detail.serviceId}`);
  };

  const handleServiceCreateFailed = (event: any) => {
    console.error('Service creation failed:', event.detail.error);
    alert(`Error: ${event.detail.error}`);
  };

  const handleValidationFailed = (event: any) => {
    console.error('Validation failed:', event.detail.error);
    alert(`Validation Error: ${event.detail.error}`);
  };

  return (
    <PreviewLayout>
      <ECCClientElixirCloudRegistryServiceCreate 
        provider={provider}
        onEccServiceCreated={handleServiceCreated}
        onEccServiceCreateFailed={handleServiceCreateFailed}
        onEccServiceCreateValidationFailed={handleValidationFailed}
      />
    </PreviewLayout>
  );
} 