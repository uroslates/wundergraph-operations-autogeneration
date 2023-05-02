# WunderGraph Custom Operations Auto-Generation

This repository is created to showcase how we could extend/enhance Wundergraph to introduce a new feature of autogenerating introspected datasources operations (as graphql operations).

For more detailed information about this feature you could have a look at the [respective issue](https://github.com/wundergraph/wundergraph/issues/855) (feature request issue) on [Wundegraph's Gihtub Repo](https://github.com/wundergraph/wundergraph/issues/855).

### Getting started

```shell
npm i && npm start
```

### Custom Operation Autogeneration

To generate custom operations (from specific wundergraph apiNamespace) you can run `npm run autogenerate:wg:gql:operations`.

This will result in generating `custom` wundegraph operations within `.wundergraph/operations/{apiNamespace}` folder that you can start using within your graphql or js/ts wundergraph operations for futher composition.

### Auto-Generate graphql operations from OCC Spec

For autogenerating `occ` `apiNamespace` graphqul operations, run the following:

```sh
npm run autogenerate:wg:gql:operations -- occ
```

Test the operation by calling the generated operations REST endpoints:

- [occ_getAllPages](http://127.0.0.1:9991/operations/occ/queries/occ_getAllPages?baseSiteId=electronics&currentPage=1&pageSize=10&fields=DEFAULT&pageType=ContentPage)
- [occ_getProducts](http://127.0.0.1:9991/operations/occ/queries/occ_getProducts?baseSiteId=electronics&currentPage=1&pageSize=10&fields=DEFAULT&query=camera&searchQueryContext=)
- [occ_getProduct](http://127.0.0.1:9991/operations/occ/queries/occ_getProduct?baseSiteId=electronics&currentPage=1&pageSize=10&fields=BASIC&productCode=779841)

You could now also consume custom `auto-generated occ operations` within the ts based operations (look at the [.wundergraph/operations/users/get.ts](.wundergraph/operations/users/get.ts)).

### Quick Fix for OCC Image.imageType enum Issue

With changes introduced here (minor schema modifications and wundergraph configuration adjustments) we are now able to retrieve and **imageType** enum value when quering OCC APIs. To test it run the application and try reaching the [follwoing API Endpoint](http://localhost:9991/operations/custom_getProduct) and verify the existence of *imageType* property in response:

```sh
curl http://localhost:9991/operations/custom_getProduct
```

### Auto-Generate graphql operations from countries apiNamespace

For autogenerating `countries` `apiNamespace` graphqul operations, run the following:

```sh
npm run autogenerate:wg:gql:operations -- countries
```

#### Get all Continents

```shell
curl http://localhost:9991/operations/Continents
```

#### Get all Countries

```shell
curl http://localhost:9991/operations/Countries
```

#### Get user

```shell
curl http://localhost:9991/operations/users/get?id=1
```

## Learn More

Read the [Docs](https://wundergraph.com/docs).

## Deploy to WunderGraph Cloud

[![Deploy to WunderGraph](https://wundergraph.com/button)](https://cloud.wundergraph.com/new/clone?templateName=simple)
