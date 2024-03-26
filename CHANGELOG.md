# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [5.1.0](https://github.com/J3573R/fastify-mongoose-rest/compare/v4.2.2...v5.1.0) (2024-03-26)


### Features

* added support for custom find property ([f2e75ec](https://github.com/J3573R/fastify-mongoose-rest/commit/f2e75ec7de1c7b68a039739ea5ae73510712bef7))
* better define options for creation ([a3b065c](https://github.com/J3573R/fastify-mongoose-rest/commit/a3b065ca1f8de00ade2e3b55f1404bb7cb82757b))
* improve typing ([ee37692](https://github.com/J3573R/fastify-mongoose-rest/commit/ee376929293a16cfc4a7cc5916803122e487a327))
* move types to their own file ([2c2a8cb](https://github.com/J3573R/fastify-mongoose-rest/commit/2c2a8cbd773b2db1b03b107c84acd4a271673df7))
* option for population object array ([0c68519](https://github.com/J3573R/fastify-mongoose-rest/commit/0c685191ab9412888c7f5304e3d54c08293bd480))
* options default value ([2ee3470](https://github.com/J3573R/fastify-mongoose-rest/commit/2ee3470eaa0c6cb470392213ac3dd60932d9c4e4))
* page alias to list operation ([bd4947a](https://github.com/J3573R/fastify-mongoose-rest/commit/bd4947ac9c456ba7cee8d5129006dd55aac64a96))

## [5.0.0](https://github.com/J3573R/fastify-mongoose-rest/compare/v4.2.2...v5.0.0) (2023-11-02)


### Features

* added support for custom find property ([f2e75ec](https://github.com/J3573R/fastify-mongoose-rest/commit/f2e75ec7de1c7b68a039739ea5ae73510712bef7))
* better define options for creation ([a3b065c](https://github.com/J3573R/fastify-mongoose-rest/commit/a3b065ca1f8de00ade2e3b55f1404bb7cb82757b))
* improve typing ([ee37692](https://github.com/J3573R/fastify-mongoose-rest/commit/ee376929293a16cfc4a7cc5916803122e487a327))
* move types to their own file ([2c2a8cb](https://github.com/J3573R/fastify-mongoose-rest/commit/2c2a8cbd773b2db1b03b107c84acd4a271673df7))
* option for population object array ([0c68519](https://github.com/J3573R/fastify-mongoose-rest/commit/0c685191ab9412888c7f5304e3d54c08293bd480))
* options default value ([2ee3470](https://github.com/J3573R/fastify-mongoose-rest/commit/2ee3470eaa0c6cb470392213ac3dd60932d9c4e4))
* page alias to list operation ([bd4947a](https://github.com/J3573R/fastify-mongoose-rest/commit/bd4947ac9c456ba7cee8d5129006dd55aac64a96))

## 4.3.0 (2023-04-27)

### Features

* Added findProperty as an option to override _id as default query param when setupping fastifyMongoose.
* Details route will now return 404 if resource is not found.

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
