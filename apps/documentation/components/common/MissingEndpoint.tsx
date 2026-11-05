import React from 'react';
import Link from 'next/link';
import { Callout } from 'nextra/components';

interface MissingEndpointProps {
  // Name of the service, e.g. "WES"
  service: string;
  // Build-time variable that sets the endpoint, e.g. "NEXT_PUBLIC_WES_URL"
  variable: string;
}

// Shown in place of a live preview when there is no endpoint to call
const MissingEndpoint: React.FC<MissingEndpointProps> = ({ service, variable }) => (
  <Callout type='info'>
    There is no public {service} demo instance that works without a login, so this preview is not
    live. To try the component, build the documentation with <code>{variable}</code> set to your own{' '}
    {service} endpoint (see <Link href='/docs/contributing#live-previews'>Live previews</Link>), or
    use the code in the other tabs.
  </Callout>
);

export default MissingEndpoint;
