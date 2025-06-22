import React from 'react';
import { ECCClientGa4ghWesRunCreate } from '@elixir-cloud/wes/react';
import { RestWesProvider } from '@elixir-cloud/wes/providers';
import PreviewLayout from '@/components/common/PreviewLayout';

export default function RunCreatePreview() {
  const provider = new RestWesProvider(
    'https://weskit.anuragxd.com/ga4gh/wes/v1'
  );

  return (
    <PreviewLayout>
      <ECCClientGa4ghWesRunCreate 
        provider={provider}
      />
    </PreviewLayout>
  );
} 