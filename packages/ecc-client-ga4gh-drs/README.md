# @elixir-cloud/drs

A web component for interacting with GA4GH Data Repository Service (DRS) API.

## Installation

```bash
npm install @elixir-cloud/drs
```

## Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      type="module"
      src="node_modules/@elixir-cloud/drs/dist/index.js"
    ></script>
  </head>
  <body>
    <ecc-client-ga4gh-drs-objects
      baseUrl="https://drs-filer-test.rahtiapp.fi/ga4gh/drs/v1"
    ></ecc-client-ga4gh-drs-objects>
  </body>
</html>
```

## Development

```bash
# Install dependencies
npm install

# Build the component
npm run build

# Run the demo
npm run demo

# Run tests
npm test
```

## License

Apache-2.0
