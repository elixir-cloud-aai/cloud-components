import React from 'react';
import { ECCClientGa4ghWesRun } from '@elixir-cloud/wes/react';
import { RestWesProvider } from '@elixir-cloud/wes/providers';
import MissingEndpoint from '@/components/common/MissingEndpoint';
import PreviewLayout from '@/components/common/PreviewLayout';
import { endpoints, sampleIds } from '@/utils/endpoints';

export default function RunPreview() {
  if (!endpoints.wes) {
    return <MissingEndpoint service='WES' variable='NEXT_PUBLIC_WES_URL' />;
  }

  const provider = new RestWesProvider(endpoints.wes);

  return (
    <PreviewLayout>
      <ECCClientGa4ghWesRun 
        provider={provider}
        runId={sampleIds.wesRun}
      />
    </PreviewLayout>
  );
} 