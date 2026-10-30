#!/usr/bin/env node
// Release helper (see "Releases" in CONTRIBUTING.md). All public packages in
// `packages/*` (those without `"private": true`) share the version of the
// root `package.json` and are released together.
//
// Usage:
//   node scripts/release.js set <version> [--date YYYY-MM-DD]
//                                            set the version of the root and
//                                            of all released packages, and
//                                            the version and release date
//                                            (default: today, UTC) in
//                                            `CITATION.cff` (for the version
//                                            bump pull request)
//   node scripts/release.js check <version>  fail unless the root, all
//                                            released packages and
//                                            `CITATION.cff` have <version>
//                                            and the release date in
//                                            `CITATION.cff` is not in the
//                                            future (UTC)
//   node scripts/release.js packages        print the directories of the
//                                            released packages, one per line
//   node scripts/release.js dist-tag <version>
//                                            print the npm dist-tag for
//                                            <version>: `latest` for
//                                            releases and for the 2.x
//                                            prereleases until 2.0.0, else
//                                            `next` (needs the git tags)
//   node scripts/release.js pin <version>    set the `@elixir-cloud/*`
//                                            dependencies and peer
//                                            dependencies of the released
//                                            packages to <version> (in the
//                                            release workflow only, before
//                                            building; not committed)

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

// Semantic Versioning 2.0.0, without build metadata
const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?$/;

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const writeJson = (file, data) =>
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

const parseVersion = (version) => {
  const match = semverPattern.exec(version || "");
  if (!match) {
    throw new Error(`Not a version (e.g. 2.0.0-alpha.49): '${version}'`);
  }
  return {
    major: Number(match[1]),
    prerelease: match[4] ? match[4].split(".") : [],
  };
};

// Public packages in `packages/*`, sorted by directory
const releasedPackages = (base = root) => {
  const packagesDir = path.join(base, "packages");
  return fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join("packages", entry.name))
    .filter((dir) => fs.existsSync(path.join(base, dir, "package.json")))
    .map((dir) => ({
      dir,
      manifest: readJson(path.join(base, dir, "package.json")),
    }))
    .filter(({ manifest }) => !manifest.private)
    .sort((a, b) => a.dir.localeCompare(b.dir));
};

// Messages for the root and the released packages whose version isn't
// `version`
const versionMismatches = (version, base = root) => {
  parseVersion(version);
  const manifests = [
    { dir: ".", manifest: readJson(path.join(base, "package.json")) },
    ...releasedPackages(base),
  ];
  return manifests
    .filter(({ manifest }) => manifest.version !== version)
    .map(
      ({ dir, manifest }) =>
        `${manifest.name} (${dir}) has version ${manifest.version}, not ${version}`
    );
};

// Citation metadata (Citation File Format), which GitHub and Zenodo read;
// Zenodo archives each GitHub release with the file of the tagged commit,
// so its `version` and `date-released` are set in the version bump pull
// request and checked by the release workflow. Both are top-level keys
// with a plain or quoted single-line value (as `setCitation` writes them);
// the rest of the file is kept as is (CI validates the whole file)
const citationFile = "CITATION.cff";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

// Lines of a top-level key, in any form, and the supported form, whose
// group `value` is the value without quotes (not continued on the next
// line, as YAML continues plain values)
const anyKeyPattern = (name) => new RegExp(`^["']?${name}["']?[ \\t]*:`, "gm");
const keyPattern = (name) =>
  new RegExp(
    `^${name}:[ \\t]*(["']?)(?<value>[0-9A-Za-z._+-]+)\\1(?:[ \\t]+#.*)?[ \\t]*$(?!\\n[ \\t]+[^ \\t#\\n])`,
    "m"
  );

// The value of a top-level key, or `undefined` if it is missing; throws if
// it occurs more than once or has an unsupported form
const citationValue = (text, name) => {
  const lines = text.match(anyKeyPattern(name)) || [];
  if (lines.length > 1) {
    throw new Error(`${citationFile} has ${name} more than once`);
  }
  const match = keyPattern(name).exec(text);
  if (lines.length === 1 && !match) {
    throw new Error(
      `${citationFile} has an unsupported ${name}: use \`${name}: "<value>"\``
    );
  }
  return match ? match.groups.value : undefined;
};

// A date (YYYY-MM-DD) as a `Date` at midnight UTC, or `undefined` if it is
// none (e.g. 2026-02-30)
const parseDate = (value) => {
  if (!datePattern.test(value)) {
    return undefined;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? date
    : undefined;
};

// Today (UTC) as YYYY-MM-DD
const utcDate = (now = new Date()) => now.toISOString().slice(0, 10);

// Messages for what in `CITATION.cff` doesn't fit the release of `version`
// on the day `now` (UTC): its version and its release date, which must not
// be later
const citationErrors = (version, now = new Date(), base = root) => {
  parseVersion(version);
  const file = path.join(base, citationFile);
  if (!fs.existsSync(file)) {
    return [`${citationFile} is missing`];
  }
  const text = fs.readFileSync(file, "utf8");
  const errors = [];
  const check = (name, test) => {
    try {
      const value = citationValue(text, name);
      if (value === undefined) {
        errors.push(`${citationFile} has no ${name}`);
      } else {
        const error = test(value);
        if (error) {
          errors.push(`${citationFile} has ${name} ${value}, ${error}`);
        }
      }
    } catch (error) {
      errors.push(error.message);
    }
  };
  check("version", (value) =>
    value === version
      ? undefined
      : `not ${version} (run \`node scripts/release.js set ${version}\`)`
  );
  check("date-released", (value) => {
    if (!parseDate(value)) {
      return "which is not a date (YYYY-MM-DD)";
    }
    return value > utcDate(now) ? "which is in the future (UTC)" : undefined;
  });
  return errors;
};

// Sets `version` and `date-released` (YYYY-MM-DD) in `CITATION.cff`,
// appending the keys if they are missing
const setCitation = (version, date, base = root) => {
  parseVersion(version);
  if (!parseDate(date)) {
    throw new Error(`'${date}' is not a date (YYYY-MM-DD)`);
  }
  const file = path.join(base, citationFile);
  let text = fs.readFileSync(file, "utf8");
  [
    ["version", version],
    ["date-released", date],
  ].forEach(([name, value]) => {
    const line = `${name}: "${value}"`;
    if (citationValue(text, name) === undefined) {
      text = `${text.replace(/\n*$/, "")}\n${line}\n`;
    } else {
      text = text.replace(keyPattern(name), line);
    }
  });
  fs.writeFileSync(file, text);
};

// Prereleases of this major version are published as `latest` until its
// first release (the 2.0.0 alphas, published as `latest` before
// prereleases got `next`)
const latestPrereleaseMajor = 2;

// The dist-tag for `version`, given the repository's tags (e.g. `v1.0.1`):
// `latest` for releases, `next` for prereleases, so that `latest` holds the
// newest release. Exception: prereleases of `latestPrereleaseMajor` get
// `latest` while there is no release of it or a later major. Fails without
// any release tag (e.g. in a clone without tags), which would otherwise
// send 2.x prereleases to `latest`
const distTag = (version, tags) => {
  const { major, prerelease } = parseVersion(version);
  const releases = tags
    .map((tag) => tag.replace(/^v/, ""))
    .filter((tag) => semverPattern.test(tag))
    .map(parseVersion)
    .filter((parsed) => parsed.prerelease.length === 0);
  if (releases.length === 0) {
    throw new Error("No release tags (e.g. v1.0.1) found: fetch the tags");
  }
  if (prerelease.length === 0) {
    return "latest";
  }
  const exceptionEnded = releases.some(
    (parsed) => parsed.major >= latestPrereleaseMajor
  );
  return major === latestPrereleaseMajor && !exceptionEnded ? "latest" : "next";
};

// Pins the dependencies on released packages; returns the changes made
const pinInternalDependencies = (version, base = root) => {
  parseVersion(version);
  const packages = releasedPackages(base);
  const names = new Set(packages.map(({ manifest }) => manifest.name));
  const changes = [];
  packages.forEach(({ dir, manifest }) => {
    let changed = false;
    ["dependencies", "peerDependencies"].forEach((section) => {
      Object.keys(manifest[section] || {})
        .filter((name) => names.has(name))
        .forEach((name) => {
          if (manifest[section][name] !== version) {
            changes.push(
              `${manifest.name}: ${section}.${name} ${manifest[section][name]} -> ${version}`
            );
            manifest[section][name] = version;
            changed = true;
          }
        });
    });
    if (changed) {
      writeJson(path.join(base, dir, "package.json"), manifest);
    }
  });
  return changes;
};

// The repository's tags `v*`
const versionTags = () => {
  try {
    return execFileSync("git", ["tag", "--list", "v*"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    })
      .split("\n")
      .filter(Boolean);
  } catch (error) {
    throw new Error(`Can't read the git tags: ${error.message}`);
  }
};

// Sets the version with `npm version`, which also updates the lock file
const setVersion = (version) => {
  parseVersion(version);
  const workspaces = releasedPackages().flatMap(({ dir }) => [
    "--workspace",
    dir,
  ]);
  execFileSync(
    "npm",
    [
      "version",
      version,
      "--no-git-tag-version",
      "--include-workspace-root",
      ...workspaces,
    ],
    { cwd: root, stdio: "inherit" }
  );
};

// The release date of `set`: `--date YYYY-MM-DD`, not later than today, or
// today (UTC)
const releaseDate = (options) => {
  if (options.length === 0) {
    return utcDate();
  }
  if (options.length !== 2 || options[0] !== "--date") {
    throw new Error(
      "Usage: node scripts/release.js set <version> [--date YYYY-MM-DD]"
    );
  }
  const [, date] = options;
  if (parseDate(date) && date > utcDate()) {
    throw new Error(`'${date}' is in the future (UTC)`);
  }
  return date;
};

const main = (args) => {
  const [command, version, ...options] = args;
  switch (command) {
    case "set": {
      const date = releaseDate(options);
      // Checks the version and date before anything is changed
      parseVersion(version);
      if (!parseDate(date)) {
        throw new Error(`'${date}' is not a date (YYYY-MM-DD)`);
      }
      setVersion(version);
      setCitation(version, date);
      return 0;
    }
    case "check": {
      const mismatches = [
        ...versionMismatches(version),
        ...citationErrors(version),
      ];
      mismatches.forEach((message) => console.error(message));
      return mismatches.length === 0 ? 0 : 1;
    }
    case "packages":
      releasedPackages().forEach(({ dir }) => console.log(dir));
      return 0;
    case "dist-tag":
      console.log(distTag(version, versionTags()));
      return 0;
    case "pin":
      pinInternalDependencies(version).forEach((change) => console.log(change));
      return 0;
    default:
      console.error(
        "Usage: node scripts/release.js set|check|packages|dist-tag|pin [<version>]"
      );
      return 2;
  }
};

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  citationErrors,
  distTag,
  parseVersion,
  pinInternalDependencies,
  releasedPackages,
  setCitation,
  versionMismatches,
};
