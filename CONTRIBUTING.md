# Contributing

Thanks for your interest in Cloud Components! Bug reports, feature
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
   `<type>[(<scope>)][!]: <description>`, at most 50 characters in total,
   where the description doesn't start with a capitalised word and has no
   trailing period (the CI job `PR title` checks this, also after you edit
   the title). Pull requests are squash-merged, so the title becomes the
   commit message on `dev`.
3. Keep the checks green: `CI passed` sums up the PR title, linting, tests
   (Node.js 22 and 24) and the other CI jobs. Run `npm run lint`,
   `npm run build` and `npm test` (and
   `node --test scripts/release.test.js` after changes to
   `scripts/release.js`) locally before you push. CI runs the tests with
   coverage (`npm run test -- -- --coverage`, which passes `--coverage`
   through npm and turbo to the test runner; Chromium only; each package's
   report is in its `coverage/` folder) and reports it to
   [Codecov](https://app.codecov.io/gh/elixir-cloud-aai/cloud-components);
   coverage of the packages with tests must not drop by more than 1 %
   (`codecov.yml`).
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
`v<version>` and pushes nothing to any branch. Its jobs:

- `prepare` ("Prepare release") holds all checks: the versions of the root,
  the released packages and `CITATION.cff` equal the tag's version, the
  release date in `CITATION.cff` is not in the future (UTC), the tag is on
  `dev`, the `CI` workflow passed for a push of the tagged commit (if CI
  hasn't finished yet or failed, re-run the release once it passed), and the
  linters pass. The other jobs need it.
- `npm` ("Release packages") builds the packages from the tag and stages
  them on npm with
  [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OpenID
  Connect, with provenance), once the `npm` environment is approved. Staged
  versions become public only when a maintainer approves them on
  npmjs.com.
- `publish` ("Publish release") creates the GitHub release for the tag,
  with generated notes (a prerelease for versions such as
  `2.0.0-alpha.49`).

To release `<version>` (e.g. `2.0.0-alpha.49`), maintainers:

1. **Bump the version** in a pull request to `dev` (title
   `chore: release <version>`): run `node scripts/release.js set <version>`,
   which sets the version of the root and of all released packages, updates
   `package-lock.json`, and sets `version` and `date-released` (today, UTC;
   or `--date YYYY-MM-DD`, not in the future) in `CITATION.cff`. Commit the
   changes and merge the pull request once CI has passed.
2. **Tag** the merge commit on `dev` once CI has passed for it (the run for
   the push to `dev`), and push the tag:
   `git tag -s v<version> -m v<version> <commit>`, then
   `git push origin v<version>`. Tags are immutable: check the commit first,
   e.g. with `node scripts/release.js check <version>` on it, which runs the
   version checks of the release workflow.
3. **Approve the `npm` environment**: the job "Release packages" of the
   `Release` run waits for a required reviewer of the GitHub environment
   `npm` (Actions → the run → "Review deployments").
4. **Approve the staged versions on npm**: the job stages each package with
   `npm stage publish` and lists them in the run's summary. An npm
   maintainer approves each one, with two-factor authentication, on the
   package's page on npmjs.com or with `npm stage list <package>` and
   `npm stage approve <stage-id>`. The dist-tag is `latest` for releases
   and `next` for prereleases (e.g. `2.1.0-rc.1` or `3.0.0-alpha.1`), so
   that `latest` holds the newest release and `next` the prerelease
   published last. Until 2.0.0 (or a later release) is tagged, i.e. there
   is a tag `v2.<minor>.<patch>` or later, prereleases of 2.x (the
   `2.0.0-alpha.N` series) get `latest` instead; any such tag ends this,
   even if its release failed. A release of an older major (a backport)
   also gets `latest`, which then moves back to that older version.
   `node scripts/release.js dist-tag <version>` prints the dist-tag. The
   dist-tag of a staged version can't be changed, and approving it moves
   the dist-tag to it: approve or reject all staged versions before you
   tag the next version, so that an older version can't take `latest` or
   `next` back.
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

### Citation metadata

Cloud Components are cited with the metadata in `CITATION.cff`
([Citation File Format](https://citation-file-format.github.io/)), which
GitHub ("Cite this repository") and Zenodo use; Zenodo archives each GitHub
release with the file of the tagged commit. Its authors are the people who
committed at least 100 lines (lines added) to `main`, the release branch,
not counting bots, lock files and images. They are ordered by lines, then by
commits; equal contributors are listed alphabetically by family name and
marked with an asterisk (*). Affiliations come from public ORCID records
only. To add or correct your entry (e.g. your name, [ORCID
iD](https://orcid.org/) or affiliation), open a pull request that changes
only your entry; don't add e-mail addresses. CI validates the file
(`cffconvert --validate`). `node scripts/release.js set <version>` sets its
`version` and `date-released` for each release, and the release workflow
fails if they don't match the release (see "Releases").

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
