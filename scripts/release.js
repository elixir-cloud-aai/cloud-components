#!/usr/bin/env node
// Release helper (see "Releases" in CONTRIBUTING.md). All public packages in
// `packages/*` (those without `"private": true`) share the version of the
// root `package.json` and are released together.
//
// Usage:
//   node scripts/release.js set <version>    set the version of the root and
//                                            of all released packages (for
//                                            the version bump pull request)
//   node scripts/release.js check <version>  fail unless the root and all
//                                            released packages have <version>
//   node scripts/release.js packages         print the directories of the
//                                            released packages, one per line
//   node scripts/release.js dist-tag <version>
//                                            print the npm dist-tag for
//                                            <version>: `latest`, or the
//                                            prerelease identifier (`alpha`
//                                            for `2.0.0-alpha.49`)
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
  return { prerelease: match[4] ? match[4].split(".") : [] };
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

// `latest` for releases, the first prerelease identifier otherwise (or
// `next`, if it is a number)
const distTag = (version) => {
  const { prerelease } = parseVersion(version);
  if (prerelease.length === 0) {
    return "latest";
  }
  return /^[a-zA-Z][0-9a-zA-Z-]*$/.test(prerelease[0]) &&
    prerelease[0] !== "latest"
    ? prerelease[0]
    : "next";
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

const main = (args) => {
  const [command, version] = args;
  switch (command) {
    case "set":
      setVersion(version);
      return 0;
    case "check": {
      const mismatches = versionMismatches(version);
      mismatches.forEach((message) => console.error(message));
      return mismatches.length === 0 ? 0 : 1;
    }
    case "packages":
      releasedPackages().forEach(({ dir }) => console.log(dir));
      return 0;
    case "dist-tag":
      console.log(distTag(version));
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
  distTag,
  parseVersion,
  pinInternalDependencies,
  releasedPackages,
  versionMismatches,
};
