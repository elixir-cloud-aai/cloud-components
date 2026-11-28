import React from 'react';
import { ECCClientGa4ghWesRunOutput } from '@elixir-cloud/wes/react';
import PreviewLayout from '@/components/common/PreviewLayout';
import {
  exampleOutputProvider,
  outputSchemas,
  outputs,
} from '@/components/packages/wes/runOutputExample';

const allowedSchemes = ['drs', 'https', 's3'];

export default function RunOutputPreview() {
  return (
    <PreviewLayout>
      <div className='flex flex-col gap-6'>
        {Object.keys(outputSchemas).map((name) => (
          <ECCClientGa4ghWesRunOutput
            key={name}
            name={name}
            schema={outputSchemas[name]}
            value={outputs[name]}
            provider={exampleOutputProvider}
            allowedSchemes={allowedSchemes}
          />
        ))}
      </div>
    </PreviewLayout>
  );
}
