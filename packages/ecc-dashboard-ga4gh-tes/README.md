# ecc-dashboard-ga4gh-tes Components

Web Components for TES 

## Introduction

This package contains Custom Webcomponents for [TES] APIs. For developments setup follow the instruction given below .

### Components

| Component              | Issue  | Status             |
|------------------------|--------|--------------------|
|                        |        |                    |

## Getting Started

To get started with this project, follow these steps:

## Installation

```bash
npm install
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm dev 
```

To run a local development server that serves the basic demo located in `demo/index.html`

## Contributing

This project is a community effort and lives off _your_ contributions, be it in
the form of bug reports, feature requests, discussions, fixes or any other form
of contribution!

Please refer to the guidelines available at [`CONTRIBUTING.md`][contributing] if
you are interested in contributing.

## Contributors

We believe that any contribution should be duly acknowledged. Therefore, we
implement the [All Contributors Specification][all-contributors] and encourage
you to comment on any issue or PR you contributed to with a request to the
[@all-contributors bot][all-contributors-bot] of the form `@all-contributors
please add @<YOUR_GITHUB_HANDLE for TYPE_1, TYPE_2, ...`, where `TYPE_1` etc.
refer to [contribution types supported by the All Contributors
Specification][all-contributors-types].

Information about contributors, including information about the specific they
have made to the project, are listed in [`CONTRIBUTORS.md`][contributors].

## Code of Conduct

Please mind the code of conduct described in
[`CODE_OF_CONDUCT.md`][code-of-conduct] for all interactions with the community.
Please be nice to one another! :)

If you experience any unacceptable behavior by any member of the community,
please refer to the contact method specified in
[`CODE_OF_CONDUCT.md`][code-of-conduct] to report the incident to the community
leaders.

## Versioning

The project adopts the [semantic versioning][res-semver] scheme for versioning.
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
  make use of the project's [issue tracker][issues].
- For more general discussions or questions on usage, please use the
  organization's [discussion forum][forum]. If the issue is related to this
  project, please indicate its name in your message body.
- For private/personal issues, more involved communication, or if you would
  like to join our team as a regular contributor, you can either join our
  [chat board][badge-chat-url] or send an [email][email] to the community
  leaders.

[![logo-elixir][logo-elixir]][elixir]
[![logo-elixir-cloud-aai][logo-elixir-cloud-aai]][elixir-cloud-aai]

> Note: This repo is created using the template ecc-dashboard-ga4gh-tes-wes.

[TES]: https://github.com/ga4gh/task-execution-schemas 
[all-contributors]: https://allcontributors.org/docs/en/specification
[all-contributors-bot]: https://allcontributors.org/docs/en/bot/overview
[all-contributors-types]: https://allcontributors.org/docs/en/emoji-key
[badge-license-image]: https://img.shields.io/badge/license-Apache%202.0-blue.svg
[badge-license-url]: http://www.apache.org/licenses/LICENSE-2.0
[badge-chat-image]: https://img.shields.io/static/v1?label=chat&message=Slack&color=ff6994
[badge-chat-url]: https://join.slack.com/t/elixir-cloud/shared_invite/enQtNzA3NTQ5Mzg2NjQ3LTZjZGI1OGQ5ZTRiOTRkY2ExMGUxNmQyODAxMDdjM2EyZDQ1YWM0ZGFjOTJhNzg5NjE0YmJiZTZhZDVhOWE4MWM
[email]: alexander.kanitz@alumni.ethz.ch
[code-of-conduct]: CODE_OF_CONDUCT.md
[contributing]: CONTRIBUTING.md
[contributors]: CONTRIBUTORS.md
[elixir]: https://elixir-europe.org/
[elixir-cloud-aai]: https://elixir-cloud.dcc.sib.swiss/
[elixir-compute]: https://elixir-europe.org/platforms/compute
[ga4gh]: https://ga4gh.org/
[license]: LICENSE
[logo-elixir]: images/logo-elixir.svg
[logo-elixir-cloud-aai]: images/logo-elixir-cloud-aai.svg
