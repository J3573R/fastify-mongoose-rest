# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.2.2](https://github.com/J3573R/fastify-mongoose-rest/compare/v4.2.1...v4.2.2) (2022-10-05)

### [4.2.1](https://github.com/J3573R/fastify-mongoose-rest/compare/v4.2.0...v4.2.1) (2022-10-05)


### Bug Fixes

* Changed all instances of insert to insert many ([361548a](https://github.com/J3573R/fastify-mongoose-rest/commit/361548ad6b1c46a14ffa7aa0ad25519753737933))

## [4.2.0](https://github.com/J3573R/fastify-mongoose-rest/compare/v4.1.0...v4.2.0) (2022-10-05)


### Features

* Added insert route ([941844e](https://github.com/J3573R/fastify-mongoose-rest/commit/941844e90dc303abe6f48292a27c45e7142db490))

## 4.1.0 (2022-08-31)

### Bug fixes

* Added summary to delete route schema
* Added tag support to delete route schema
* Added parameter validation to delete route

## 4.0.0 (2022-08-11)


### ⚠ BREAKING CHANGES

* X-Total-Count header has to be enabled with `totalCount` request parameter

### Features

* x-total-count header is added to search only if it's enabled  ([72b66a1](https://github.com/J3573R/fastify-mongoose-rest/commit/72b66a180f27e8eda9a67566c2909706c33ee20c))

## 3.0.0 (2022-08-10)


### ⚠ BREAKING CHANGES

* X-Total-Count header is not added automatically to search routes

### Features

* X-Total-Count header is not added automatically to search routes

### Bug fixes
* bump fastify & mongoose versions to newest
