<a href="https://elixir-on.cloud/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="images/logo_elixir_on_cloud_night.png">
    <img src="images/logo_elixir_on_cloud.png" alt="ELIXIR On-Cloud">
  </picture>
</a>

# Cloud Components

[![License][badge-license]][badge-url-license]
[![Build_status][badge-build-status]][badge-url-build-status]
[![Docs][badge-docs]][badge-url-docs]
[![GitHub_tag][badge-github-tag]][badge-url-github-tag]
[![npm_release][badge-npm]][badge-url-npm]

Web components for front ends of [GA4GH](https://www.ga4gh.org/) APIs and
the services built on them, brought to you by [ELIXIR
On-Cloud](https://elixir-on.cloud/). Built with [Lit](https://lit.dev/) and
TypeScript, they work in any web framework or in plain HTML, and come with
React wrappers and providers that connect them to your API endpoints. They
are published as npm packages:

| Package | Components for |
| --- | --- |
| `@elixir-cloud/design` | The design system and utility components that the other packages use |
| `@elixir-cloud/service-registry` | The GA4GH Service Registry API |
| `@elixir-cloud/cloud-registry` | Cloud Registry, a GA4GH Service Registry with service management |
| `@elixir-cloud/trs` | The GA4GH Tool Registry Service (TRS) API |
| `@elixir-cloud/trs-filer` | TRS-Filer, a GA4GH TRS implementation with tool management |
| `@elixir-cloud/wes` | The GA4GH Workflow Execution Service (WES) API |
| `@elixir-cloud/drs` | The GA4GH Data Repository Service (DRS) API |
| `@elixir-cloud/drs-filer` | DRS-Filer, a GA4GH DRS implementation with object management |

**Read the [documentation][docs]** for the installation, the components and
providers of each package, customisation and the versions.

## Quick start

Install the package for your API with `npm`, e.g., for the GA4GH Service
Registry API:

```bash
npm install @elixir-cloud/service-registry
```

Then import it in your app to register its components, and give them a
provider for your API endpoint:

```javascript
import "@elixir-cloud/service-registry";
import { RestServiceRegistryProvider } from "@elixir-cloud/service-registry/providers";

const services = document.createElement("ecc-client-ga4gh-service-registry-services");
services.provider = new RestServiceRegistryProvider(
  "https://registry.example.com/ga4gh/registry/v1",
);
document.body.append(services);
```

See [Installation][docs-installation] for React, loading the components from a
CDN and the other packages.

## Development

With [Node.js](https://nodejs.org/) 22 or later installed, clone the
repository, install the dependencies and start the design package, which all
other packages need:

```bash
git clone https://github.com/elixir-cloud-aai/cloud-components.git
cd cloud-components
npm install
npm run dev --workspace=@elixir-cloud/design
```

The design package keeps running; start the package you work on in a second
terminal:

```bash
npm run dev --workspace=@elixir-cloud/<package>
```

`npm run lint`, `npm run build` and `npm test` run the checks of CI; the
documentation app is in [`apps/documentation/`](apps/documentation/).

## Citation

If you use Cloud Components, please cite them with the metadata in
[`CITATION.cff`](CITATION.cff): on GitHub, "Cite this repository" in the
sidebar of the repository formats it as APA or BibTeX.

## Contributing

Contributions are welcome! See [`CONTRIBUTING.md`](CONTRIBUTING.md) for pull
requests and releases, the organisation's contributor guide and our code of
conduct.

[badge-build-status]: <https://github.com/elixir-cloud-aai/cloud-components/actions/workflows/ci.yml/badge.svg?branch=dev>
[badge-docs]: <https://img.shields.io/readthedocs/cloud-components>
[badge-github-tag]: <https://img.shields.io/github/v/tag/elixir-cloud-aai/cloud-components?color=C39BD3>
[badge-license]: <https://img.shields.io/badge/license-Apache%202.0-blue.svg>
[badge-npm]: <https://img.shields.io/npm/v/@elixir-cloud/design?color=C39BD3>
[badge-url-build-status]: <https://github.com/elixir-cloud-aai/cloud-components/actions/workflows/ci.yml?query=branch%3Adev>
[badge-url-docs]: <https://cloud-components.readthedocs.io/en/latest/>
[badge-url-github-tag]: <https://github.com/elixir-cloud-aai/cloud-components/releases>
[badge-url-license]: <https://www.apache.org/licenses/LICENSE-2.0>
[badge-url-npm]: <https://www.npmjs.com/package/@elixir-cloud/design>
[docs]: <https://cloud-components.readthedocs.io/en/latest/>
[docs-installation]: <https://cloud-components.readthedocs.io/en/latest/docs/installation/>
