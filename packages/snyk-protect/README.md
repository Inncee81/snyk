# @snyk/protect

[![npm](https://img.shields.io/npm/v/@snyk/protect)](https://www.npmjs.com/package/@snyk/protect)
[![Known Vulnerabilities](https://snyk.io/test/github/snyk/snyk/badge.svg)](https://snyk.io/test/github/snyk/snyk)

![Snyk](https://snyk.io/style/asset/logo/snyk-print.svg)

Patch vulnerable code in your project's dependencies. This package is officially maintained by [Snyk](https://snyk.io).

## Usage

You typically don't need to install `@snyk/protect` manually. It'll be introduced when it's needed as part of [Snyk's Fix PR service](https://support.snyk.io/hc/en-us/articles/360011484018-Fixing-vulnerabilities).

To enable patches in your Fix PRs:

- Visit https://app.snyk.io
- Go to "Org Settings" > "Integrations"
- Choose "Edit Settings" under your SCM integration.
- Under the "Fix Pull Request" section, ensure patches are enabled.

Snyk will now include patches as part of its Fix PRs for your project.

## How it works

If there's a patch available for a vulnerability in your project, the Fix PR:

- Adds a `patch` entry to your `.snyk` file.
- Adds `@snyk/protect` to your `package.json`'s dependencies.
- Adds `@snyk/protect` to your `package.json`'s `prepare` script.

Now whenever you run `npm install`, `@snyk/protect` will pickup the patches configured in your `.snyk` file and patch your dependencies.

## Migrating from `snyk protect` to `@snyk/protect`

`@snyk/protect` is a standalone replacement for `snyk protect`. They both do the same job, however:

- `@snyk/protect` has zero dependencies.
- You don't need to include `snyk` in your dependencies.

If you already have `snyk protect` set up, you can migrate to `@snyk/protect` by applying the following changes to your `package.json`:

```patch
 {
   "name": "my-project",
   "scripts": {
     "prepare": "npm run snyk-protect",
-    "snyk-protect": "snyk protect"
+    "snyk-protect": "snyk-protect"
   },
   "dependencies": {
-    "snyk": "^1.500.0"
+    "@snyk/protect": "^1.657.0"
   }
 }
```

---

Made with 💜 by Snyk
