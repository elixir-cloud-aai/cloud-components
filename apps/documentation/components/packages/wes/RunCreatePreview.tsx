import React from 'react';
import { ECCClientGa4ghWesRunCreate } from '@elixir-cloud/wes/react';
import { RestWesProvider } from '@elixir-cloud/wes/providers';
import MissingEndpoint from '@/components/common/MissingEndpoint';
import PreviewLayout from '@/components/common/PreviewLayout';
import { endpoints } from '@/utils/endpoints';

export default function RunCreatePreview() {
  if (!endpoints.wes) {
    return <MissingEndpoint service='WES' variable='NEXT_PUBLIC_WES_URL' />;
  }

  const provider = new RestWesProvider(endpoints.wes);

  return (
    <PreviewLayout>
      <ECCClientGa4ghWesRunCreate 
        provider={provider}
      />
    </PreviewLayout>
  );
} 