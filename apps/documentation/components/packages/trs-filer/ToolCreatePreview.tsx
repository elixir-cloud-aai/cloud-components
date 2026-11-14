import React from 'react';
import { ECCClientElixirTrsToolCreate } from '@elixir-cloud/trs-filer/react';
import MissingEndpoint from '@/components/common/MissingEndpoint';
import PreviewLayout from '@/components/common/PreviewLayout';
import { endpoints } from '@/utils/endpoints';

export default function ToolCreatePreview() {
  if (!endpoints.trsFiler) {
    return <MissingEndpoint service='TRS-Filer' variable='NEXT_PUBLIC_TRS_FILER_URL' />;
  }

  return (
    <PreviewLayout>
      <ECCClientElixirTrsToolCreate baseUrl={endpoints.trsFiler} />
    </PreviewLayout>
  );
}
