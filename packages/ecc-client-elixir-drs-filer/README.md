# @elixir-cloud/drs-filer

A web component for interacting with Elixir DRS Filer API.

## Installation

```bash
npm install @elixir-cloud/drs-filer
```

## Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      type="module"
      src="node_modules/@elixir-cloud/drs-filer/dist/index.js"
    ></script>
  </head>
  <body>
    <ecc-client-elixir-drs-filer-object-create
      baseUrl="https://drs-filer-test.rahtiapp.fi/ga4gh/drs/v1"
    ></ecc-client-elixir-drs-filer-object-create>
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
