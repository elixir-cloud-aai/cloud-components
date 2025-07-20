# ELIXIR Cloud Components

ELIXIR Cloud Components (ECC) are lightweight, fast and reusable Web Components for operationalizing various [ELIXIR Cloud & AAI](https://elixir-cloud.dcc.sib.swiss/) and [GA4GH](https://ga4gh.org/) [Cloud](https://www.ga4gh.org/work_stream/cloud/) services.

[![License][badge-license-image]][badge-license-url]
[![Chat][badge-chat-image]][badge-chat-url]

## Documentation

For comprehensive guides, API references, and examples, visit our documentation:

**[https://cloud-components.2.rahtiapp.fi/](https://cloud-components.2.rahtiapp.fi/)**

## Quick Start for Developers

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/elixir-cloud-aai/cloud-components.git
   cd cloud-components
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development:**
   ```bash
   # Run the design package first (required by all other packages)
   npm run dev --workspace=@elixir-cloud/design

   # In another terminal, run a specific package:
   npm run dev --workspace=@elixir-cloud/<package-name>
   ```

### Available Packages

| Package | Description |
|---------|-------------|
| `@elixir-cloud/design` | Design system and utility components |
| `@elixir-cloud/service-registry` | GA4GH Service Registry components |
| `@elixir-cloud/cloud-registry` | ELIXIR Cloud Registry components |
| `@elixir-cloud/trs` | GA4GH Tool Registry Service components |
| `@elixir-cloud/trs-filer` | TRS-Filer service components |
| `@elixir-cloud/wes` | GA4GH Workflow Execution Service components |

## Development Commands

```bash
# Install dependencies
npm install

# Run specific package in development mode
npm run dev --workspace=@elixir-cloud/<package-name>

# Build all packages
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Architecture

ECC is built on modern web standards:

- **Web Components**: Platform-agnostic, framework-independent components
- **TypeScript**: Type-safe development with excellent IDE support
- **Lit**: Efficient web component library for building reactive UIs
- **Vite**: Fast build tool and development server
- **Monorepo**: Organized workspace with shared dependencies and tooling

## Contributing

This project is a community effort and lives off _your_ contributions, be it in
the form of bug reports, feature requests, discussions, fixes or any other form
of contribution!

Please refer to the guidelines available at [`CONTRIBUTING.md`][contributing] if
you are interested in contributing.

## Code of Conduct

Please mind the code of conduct described in
[`CODE_OF_CONDUCT.md`][code-of-conduct] for all interactions with the community.
Please be nice to one another! :)

If you experience any unacceptable behavior by any member of the community,
please refer to the contact method specified in
[`CODE_OF_CONDUCT.md`][code-of-conduct] to report the incident to the community
leaders.

## Versioning

The project adopts the [semantic versioning](https://semver.org/) scheme for versioning.
Currently the service is in a pre-release stage, so changes to the API,
including breaking changes, may occur at any time without further notice.

## License

This project is distributed under the [Apache License 2.0][badge-license-url], a
copy of which is also available in [`LICENSE`][license].

## Contact

The project is maintained by [ELIXIR Cloud & AAI][elixir-cloud-aai], a Driver
Project of the [Global Alliance for Genomics and Health (GA4GH)][ga4gh], under
the umbrella of the [ELIXIR][elixir] [Compute Platform][elixir-compute].

To get in touch with use, please use one of the following routes:

- For filing bug reports, feature requests or other code-related issues, please
  make use of the project's [issue tracker](https://github.com/elixir-cloud-aai/cloud-components/issues).
- For private/personal issues, more involved communication, or if you would
  like to join our team as a regular contributor, you can either join our
  [chat board][badge-chat-url] or [email] the community
  leaders.

---

[![logo-elixir][logo-elixir]][elixir]
[![logo-elixir-cloud-aai][logo-elixir-cloud-aai]][elixir-cloud-aai]

[badge-license-image]: https://img.shields.io/badge/license-Apache%202.0-blue.svg
[badge-license-url]: http://www.apache.org/licenses/LICENSE-2.0
[badge-chat-image]: https://img.shields.io/static/v1?label=chat&message=Slack&color=ff6994
[badge-chat-url]: https://join.slack.com/t/elixir-cloud/shared_invite/enQtNzA3NTQ5Mzg2NjQ3LTZjZGI1OGQ5ZTRiOTRkY2ExMGUxNmQyODAxMDdjM2EyZDQ1YWM0ZGFjOTJhNzg5NjE0YmJiZTZhZDVhOWE4MWM
[email]: mailto:alexander.kanitz@alumni.ethz.ch
[code-of-conduct]: CODE_OF_CONDUCT.md
[contributing]: https://elixir-cloud-aai.github.io/guides/guide-contributor/
[contributors]: CONTRIBUTORS.md
[elixir]: https://elixir-europe.org/
[elixir-cloud-aai]: https://elixir-cloud.dcc.sib.swiss/
[elixir-compute]: https://elixir-europe.org/platforms/compute
[ga4gh]: https://ga4gh.org/
[license]: LICENSE
[logo-elixir]: images/logo-elixir.svg
[logo-elixir-cloud-aai]: images/logo-elixir-cloud-aai.svg
