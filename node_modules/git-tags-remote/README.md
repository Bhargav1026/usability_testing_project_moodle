# git-tags-remote

[![NPM version](https://img.shields.io/npm/v/git-tags-remote.svg)](https://www.npmjs.com/package/git-tags-remote)
[![Build Status](https://github.com/sh0ji/git-tags-remote/workflows/Integration/badge.svg)](https://github.com/sh0ji/git-tags-remote/actions?query=workflow%3AIntegration)
[![codecov](https://codecov.io/gh/sh0ji/git-tags-remote/branch/master/graph/badge.svg)](https://codecov.io/gh/sh0ji/git-tags-remote)

> Get remote repository tags.

Inspired by [remote-git-tags](https://github.com/sindresorhus/remote-git-tags) and [node-git-tags](https://github.com/bfricka/node-git-tags). Allows any type of remote repository, including repositories accessed through SSH or private repositories. If `git ls-remote --tags` works for you, so will this.

## Install

```sh
npm install git-tags-remote
```

Note that a [git binary and command line interface](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) is a prerequisite.

## Usage

```javascript
const gtr = require('git-tags-remote');

gtr.get('git@github.com:sh0ji/git-tags-remote.git').then(console.log);
// Map {
//   'v1.0.3' => 'a21074841b25eb4efe141ea4d7c2a1519c218b90',
//   'v1.0.2' => '0d50a47d20275ea6de9defd0518332dc0f96d195',
//   'v1.0.0' => 'f009ac7ee3ed9396700467ff13fd3085351a0cac'
// }
```

## API

`.get(gitUrl)`  
Returns a `Promise<Map<string, string>>` with the Git tags as keys and their commit SHA as values, just like [remote-git-tags](https://github.com/sindresorhus/remote-git-tags).

- `gitUrl` must be a [valid git url](https://git-scm.com/docs/git-clone#_git_urls_a_id_urls_a).  
   - In other words, `https://github.com/sh0ji/git-tags-remote.git` is valid but `github.com/sh0ji/git-tags-remote` is not.

`.latest(gitUrl)`  
Returns a promised tuple (`Promise<[string, string]>`) with the latest git tag and commit SHA value.

- Example return: `['v1.0.0-rc.2', '8e048a0fd9cb668366eef550be445ac761efd667']`
