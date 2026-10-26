# Contributing

Thanks for your interest in ELIXIR Cloud Components! Bug reports, feature
requests, discussions, documentation and code are all welcome. The project
follows the [contributor guide of ELIXIR
On-Cloud](https://elixir-cloud-aai.github.io/contribute/); this file only
describes what is specific to this repository.

- Follow our [code of conduct](CODE_OF_CONDUCT.md).
- Work on [issues](https://github.com/elixir-cloud-aai/cloud-components/issues):
  open or find one and agree on the approach before you change code.

## Pull requests

1. Branch off `main` (e.g. `feat/<topic>` or `fix/<topic>`) and open a pull
   request against `main` that references the issue it closes (e.g.
   `Fixes #123`, as in the pull request template). Maintainers may also push
   small changes to `main` directly.
2. Title the pull request as a [Conventional
   Commit](https://www.conventionalcommits.org/):
   `<type>[(<scope>)][!]: <description>`, where the description starts in
   lower case and has at most 50 characters (the `PR title` check enforces
   this). Pull requests are squash-merged, so the title becomes the commit
   message on `main`.
3. Keep the checks green: `CI passed` sums up linting, tests (Node.js 22 and
   24) and the other CI jobs. Run `npm run lint`, `npm run build` and
   `npm test` locally before you push.
4. Add or update tests and the documentation (`apps/documentation`) for
   changed behaviour.
5. The code owners (see `.github/CODEOWNERS`) are requested for review
   automatically. A maintainer merges once the pull request is approved.

Changesets are not used: don't add files to `.changeset/`.

Pull requests prepared with AI agents follow the same rules. They are opened
as drafts, and a named person is responsible for them and answers review
comments.

## Releases

All published packages share one version and are released together
(currently `2.0.0-alpha.N`, until 2.0.0). `@elixir-cloud/tes`,
`@elixir-cloud/ro-crate` and `@elixir-cloud/eslint-config` are frozen: the
release doesn't change their versions, so they aren't published again.

To release, a maintainer pushes a tag `v<version>` (e.g. `v2.0.0-alpha.49`)
on `main`. The `Release` workflow (`.github/workflows/release.yml`) then:

1. lints the code;
2. sets the version of the root and of all released packages to the tag's
   version, commits `bump: v<version>` and pushes it to `main` (with the
   repository's deploy key);
3. builds the packages from `main` and publishes those whose version is not
   on npm yet, with `changeset publish`, under the dist-tag `latest`; npm
   authenticates the workflow by [trusted
   publishing](https://docs.npmjs.com/trusted-publishers) (OpenID Connect)
   and adds provenance (an npm token remains as a fallback until the first
   release with trusted publishing has worked, see #471);
4. creates a GitHub release for the tag, with generated notes (a prerelease
   for versions such as `2.0.0-alpha.49`).

A version published on npm can't be published again. If a release fails
after the bump was pushed, fix the cause and release a new version; never
move or re-push a tag.
