# ELIXIR Cloud Components

ELIXIR Cloud Components (ECC) are lightweight, fast and reusable Web Components for operationalizing various [ELIXIR Cloud & AAI](https://elixir-cloud.dcc.sib.swiss/) and [GA4GH](https://ga4gh.org/) [Cloud](https://www.ga4gh.org/work_stream/cloud/) services.

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[badge-all-contributors-image]: https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square&color=%23F6DA80%20

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![License][badge-license-image]][badge-license-url]
[![All Contributors][badge-all-contributors-image]][contributors]
[![Chat][badge-chat-image]][badge-chat-url]


### Packages

| Name                       | Description                                                                                            |
|----------------------------|--------------------------------------------------------------------------------------------------------|
| ecc-utils-design           | Encapsulation & Utility components to manage the headless yet constitent design accross ecc components |
| ecc-client-ga4gh-tes       | Collection of Web Components for interacting with TES (Task Execution Service)                         |
| ecc-client-ga4gh-wes       | Collection of Web Components for interacting with WES (Workflow Execution Service)                     |
| ecc-client-ga4gh-trs       | Collection of Web Components for interacting with TRS (Tool Registry Service)                          |
| ecc-client-ga4gh-trs-filer | Collection of Web Components for interacting with Elixir TRS Filer                                     |
| eslint-config              | Custom & common eslint configuration for elixir packages                                               |

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

[![logo-elixir][logo-elixir]][elixir]
[![logo-elixir-cloud-aai][logo-elixir-cloud-aai]][elixir-cloud-aai]

[all-contributors]: https://allcontributors.org/docs/en/specification
[all-contributors-bot]: https://allcontributors.org/docs/en/bot/overview
[all-contributors-types]: https://allcontributors.org/docs/en/emoji-key
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
