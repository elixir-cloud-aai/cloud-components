import React from 'react';
import { ECCClientGa4ghTrsTools } from '@elixir-cloud/trs/react';
import { RestTrsProvider } from '@elixir-cloud/trs/providers';
import PreviewLayout from '@/components/common/PreviewLayout';

export default function ToolsPreview() {
  const provider = new RestTrsProvider(
    'https://trs-filer.anuragxd.com/ga4gh/trs/v2'
  );

  return (
    <PreviewLayout>
      <ECCClientGa4ghTrsTools 
        provider={provider}
      />
    </PreviewLayout>
  );
} 