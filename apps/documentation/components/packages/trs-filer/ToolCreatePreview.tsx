import React from 'react';
import { ECCClientElixirTrsToolCreate } from '@elixir-cloud/trs-filer/react';
import { RestTrsFilerProvider } from '@elixir-cloud/trs-filer/providers';
import PreviewLayout from '@/components/common/PreviewLayout';

export default function ToolCreatePreview() {
  const provider = new RestTrsFilerProvider(
    'https://trs-filer.anuragxd.com/ga4gh/trs/v2'
  );

  return (
    <PreviewLayout>
      <ECCClientElixirTrsToolCreate 
        provider={provider}
      />
    </PreviewLayout>
  );
} 