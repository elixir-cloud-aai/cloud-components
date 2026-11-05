import React from 'react';
import { ECCClientGa4ghTrsTool } from '@elixir-cloud/trs/react';
import { RestTrsProvider } from '@elixir-cloud/trs/providers';
import PreviewLayout from '@/components/common/PreviewLayout';
import { endpoints, sampleIds } from '@/utils/endpoints';

export default function ToolPreview() {
  const provider = new RestTrsProvider(endpoints.trs);

  return (
    <PreviewLayout>
      <ECCClientGa4ghTrsTool 
        provider={provider}
        toolId={sampleIds.trsTool}
      />
    </PreviewLayout>
  );
} 