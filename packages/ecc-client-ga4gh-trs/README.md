# @elixir-cloud/trs

A web component for interacting with GA4GH Tool Registry Service (TRS) API.

## Installation

```bash
npm install @elixir-cloud/trs
```

## Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      type="module"
      src="node_modules/@elixir-cloud/trs/dist/index.js"
    ></script>
  </head>
  <body>
    <ecc-client-ga4gh-trs
      baseUrl="https://trs-filer-test.rahtiapp.fi/ga4gh/trs/v2"
    ></ecc-client-ga4gh-trs>
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
