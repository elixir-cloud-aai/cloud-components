import React from 'react';
import { ECCClientGa4ghTrsTools } from '@elixir-cloud/trs/react';
import PreviewLayout from '@/components/common/PreviewLayout';
import { endpoints } from '@/utils/endpoints';

export default function ToolsPreview() {
  // `baseUrl` rather than `provider`: the component reads `provider` only on
  // its first update, which runs before React sets it on the server-rendered
  // element, but it reloads when `baseUrl` changes
  return (
    <PreviewLayout>
      <ECCClientGa4ghTrsTools baseUrl={endpoints.trs} />
    </PreviewLayout>
  );
}
