import React from 'react';
import { ECCClientGa4ghTrsTools } from '@elixir-cloud/trs/react';
import PreviewLayout from '@/components/common/PreviewLayout';
import { endpoints } from '@/utils/endpoints';

export default function ToolsPreview() {
  return (
    <PreviewLayout>
      <ECCClientGa4ghTrsTools baseUrl={endpoints.trs} />
    </PreviewLayout>
  );
}
