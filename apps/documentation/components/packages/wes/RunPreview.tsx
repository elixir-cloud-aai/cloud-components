import React from 'react';
import { ECCClientGa4ghWesRun } from '@elixir-cloud/wes/react';
import { RestWesProvider } from '@elixir-cloud/wes/providers';
import PreviewLayout from '@/components/common/PreviewLayout';

export default function RunPreview() {
  const provider = new RestWesProvider(
    'https://weskit.anuragxd.com/ga4gh/wes/v1'
  );

  return (
    <PreviewLayout>
      <ECCClientGa4ghWesRun 
        provider={provider}
        runId="b855ca2a-4af8-45a1-a964-910dc02c6bba"
      />
    </PreviewLayout>
  );
} 