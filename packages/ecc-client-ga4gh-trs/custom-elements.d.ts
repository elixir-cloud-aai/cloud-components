// custom-elements.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    /**
     *  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> allows setting standard HTML attributes on the element
     */

    "custom-tooltip": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      /* no attributes */
    };

    "custom-copy": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      "value": string;
    };

    "custom-tabs": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      /* will add custom attributes for custom-tabs later */
    };

    "ecc-client-ga4gh-trs": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      /* no attributes */
    };
  }
}
