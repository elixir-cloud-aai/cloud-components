// custom-elements.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    /**
     *  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> allows setting standard HTML attributes on the element
     */
    "my-element": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      "my-attribute-name": string;
    };
  }
}
