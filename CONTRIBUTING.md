# Contributing

Thanks for your interest in ELIXIR Cloud Components! Bug reports, feature
requests, discussions, documentation and code are all welcome. The project
follows the [contributor guide of ELIXIR
On-Cloud](https://elixir-cloud-aai.github.io/contribute/); this file only
describes what is specific to this repository.

- Follow our [code of
  conduct](https://github.com/elixir-cloud-aai/.github/blob/main/CODE_OF_CONDUCT.md).
- Work on [issues](https://github.com/elixir-cloud-aai/cloud-components/issues):
  open or find one and agree on the approach before you change code.

## Pull requests

1. Branch off `dev`, the default branch (e.g. `feat/<topic>` or
   `fix/<topic>`), and open a pull request against `dev` that references the
   issue it closes (e.g. `Closes #123`, as in the pull request template).
   `main` points at the latest release; nobody pushes to it except to
   fast-forward it after a release.
2. Title the pull request as a [Conventional
   Commit](https://www.conventionalcommits.org/):
   `<type>[(<scope>)][!]: <description>`, where the description starts in
   lower case and has at most 50 characters (the `PR title` check enforces
   this). Pull requests are squash-merged, so the title becomes the commit
   message on `dev`.
3. Keep the checks green: `CI passed` sums up linting, tests (Node.js 22 and
   24) and the other CI jobs. Run `npm run lint`, `npm run build` and
   `npm test` (and `node --test scripts/release.test.js` after changes to
   `scripts/release.js`) locally before you push.
4. Add or update tests and the documentation (`apps/documentation`) for
   changed behaviour.
5. The code owners (see `.github/CODEOWNERS`) are requested for review
   automatically. A maintainer merges once the pull request is approved.

Changesets are not used; versions are set in the version bump pull
request of each release (see "Releases").

Pull requests prepared with AI agents follow the same rules. They are opened
as drafts, and a named person is responsible for them and answers review
comments.

## Releases

All public packages in `packages/` (those without `"private": true` in
their `package.json`) share the version of the root `package.json` and are
released together (currently `2.0.0-alpha.N`, until 2.0.0).
`@elixir-cloud/ro-crate` and the deprecated `@elixir-cloud/tes` are private
and not released.

The `Release` workflow (`.github/workflows/release.yml`) runs on tags
`v<version>`. It pushes nothing to any branch; it checks that all versions
equal the tag's version and that the tag is on `dev`, lints, builds the
packages from the tag, stages them on npm with
[trusted publishing](https://docs.npmjs.com/trusted-publishers) (OpenID
Connect, with provenance) and creates a GitHub release for the tag, with
generated notes (a prerelease for versions such as `2.0.0-alpha.49`).
Staged versions become public only when a maintainer approves them on
npmjs.com.

To release `<version>` (e.g. `2.0.0-alpha.49`), maintainers:

1. **Bump the version** in a pull request to `dev` (title
   `chore: release <version>`): run `node scripts/release.js set <version>`,
   which sets the version of the root and of all released packages and
   updates `package-lock.json`, commit the changes and merge the pull request
   once CI has passed.
2. **Tag** the merge commit on `dev` and push the tag:
   `git tag -s v<version> -m v<version> <commit>`, then
   `git push origin v<version>`. Tags are immutable: check the commit first.
3. **Approve the `npm` environment**: the job `Release packages` of the
   `Release` run waits for a required reviewer of the GitHub environment
   `npm` (Actions → the run → "Review deployments").
4. **Approve the staged versions on npm**: the job stages each package with
   `npm stage publish` and lists them in the run's summary. An npm
   maintainer approves each one, with two-factor authentication, on the
   package's page on npmjs.com or with `npm stage list <package>` and
   `npm stage approve <stage-id>`. The dist-tag is `latest` for releases
   and for prereleases of a major version without a release yet (the
   `2.0.0-alpha.N` series, until 2.0.0 is out; there is no tag
   `v2.<minor>.<patch>` yet). Once a major version is released, its
   prereleases get their identifier as dist-tag (`rc` for `2.1.0-rc.1`).
   The dist-tag of a staged version can't be changed.
5. **Fast-forward `main`** to the tag:
   `git push origin v<version>^{commit}:refs/heads/main` (only fast-forwards;
   the ruleset of `main` lets only admins update it).

A version on npm, staged or public, can't be published again, and tags
can't be moved. If a release fails before staging, fix the cause in a pull
request and release a new version. If staging fails for some packages,
don't approve any staged version yet: re-run the failed jobs of the run.
Packages already on npm are skipped, and versions staged by the earlier
attempt count as staged. If a package can't be staged at all, reject the
staged versions (`npm stage reject <stage-id>`) and release a new version.

### Documentation versions

The documentation is built on [Read the
Docs](https://cloud-components.readthedocs.io/) (configuration:
`.readthedocs.yaml`); its page "Versions"
(`apps/documentation/pages/docs/versions.mdx`) explains the versions to
users. `latest` is built from `dev`. Two
automation rules of the Read the Docs project activate each new tag `v*`
and set it as the default version, so that the newest prerelease is the
default until 2.0.0 is out. `stable` (the newest tag without a prerelease
suffix, built by Read the Docs) stays inactive until then.

When 2.0.0 is released, a maintainer of the Read the Docs project:

1. deletes the automation rule that sets new tags `v*` as the default
   version (the rule that activates them stays);
2. activates `stable` and sets it as the default version (Settings →
   "Default version");
3. enables the notification on non-stable versions (Settings → Addons →
   Notifications), so that pages of `latest` and of older versions point
   readers to `stable`.
