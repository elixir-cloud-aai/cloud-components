'use client';

// eslint-disable-next-line import/no-unresolved
import 'elixir-ui';
import * as React from 'react';

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace JSX {
    // eslint-disable-next-line no-unused-vars
    interface IntrinsicElements {
      'fast-welcome': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export default function Home() {
  return <fast-welcome></fast-welcome>;
}
