# ELIXIR Cloud Components

Elixir Cloud Components is lightweight, fast, and reusable web-components developed by Elixir Cloud and AAI Community for managing and accessing various services.

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[badge-all-contributors-image]: https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square&color=%23F6DA80%20

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![License][badge-license-image]][badge-license-url]
[![All Contributors][badge-all-contributors-image]][contributors]
[![Chat][badge-chat-image]][badge-chat-url]

## Introduction

This repository follows the monorepo architecture (using [TurboRepo](https://turbo.build/repo)) that follows the common convention of having having top-level `apps/` and `packages/` directories. 
The apps folder should contain workspaces for launchable apps, such as a [Next.js](https://nextjs.org/) or [Svelte](https://svelte.dev/) app.
The packages folder should contain workspaces for packages used by either an app or another package.

Workspaces are the building blocks of your monorepo. Each app and package you add to your monorepo will be inside its own workspace. 

### Packages

| Name      | Description                                                                                                                                | Version   | Status      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ----------- |
| elixir-ui | This package serves as an abstraction layer for other packages, providing a streamlined approach for extracting common design token logic. | [0.0.1]() | In progress |

### Apps

| Name          | Description                                                                                                            | Deployment |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------- |
| example-usage | This application serves as a comprehensive guide for users on how to utilize the packages available in the sample app. | [NA]()     |

## Getting Started

To get started with this project, follow these steps:

> Note: All of the following commands should be executed on all the packages & apps. In case you want to execute the script on any one particular app/package, you can define the [workspace tag](https://turbo.build/repo/docs/handbook/package-installation#addingremovingupgrading-packages) along with any of the below commands ([refer to point 6](#point-6)).

1. Install the dependencies involved by running the following command:

   ```
   npm install
   ```

2. Run the development server by running the following command:
   
   ```
   npm run dev
   ```

This will start the development server on your local machine and allow you to start working on the project.

3. If you want to start a new package run:

   ```
   npm run new
   ```
4. Run linter by the following command:
   
   ```
   npm run lint
   ```

5. Run all test using the following command.

   ```
   npm run test
   ``` 
> Note: Since packages have interdependency, you need to run `dev` script atleast once before running `lint` and `test` scripts globally.

<a id="point-6"></a>

>Above commands are global commands, they run for the entire monorepo which includes all the packages, apps and docs etc but these commands can be coupled with `-w` or `-workspace` flag to run them on a specific repo/workspace inside this monorepo.
6. To run test script on the package `elixir-ui`, use the following command:
    
   ```
   npm run test -w=elixir-ui
   ```

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
