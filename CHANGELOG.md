# Changelog
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
