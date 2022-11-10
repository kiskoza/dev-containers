# Dev containers

A Firefox plugin to create a new container for every user in development.

## Getting Started

### Prerequisites

- [Firefox](https://www.mozilla.org/en-US/firefox/new/)

You don't need any tooling to run the add-on in the browser, but you'll need nodejs & yarn to build and sign a new release.

The project uses [asdf](https://asdf-vm.com/) to install development tools

```bash
asdf plugin add nodejs
asdf plugin add yarn

asdf install
```

### Installing

1. Open Firefox
2. Go to `about:debugging#/runtime/this-firefox`
3. Open "Temporary Extensions"
4. Click "Load Temporary Add-on..."
5. Select `src/manifest.json`

Or you can use yarn to load it in a development instance of Firefox with auto code reloading

```bash
yarn dev
```

## Running the tests

Don't have any yet :(

## Deployment

For a new release you need to build a new `.xpi` file.

```bash
yarn build
yarn sign --api-key <api key> --api-secret <api secret>
```

Or you can grab the latest release from the releases page.

## Contributing

Currently the project is in an experimental state, but I welcome any PR

## Versioning

We use [Semantic Versioning](http://semver.org/) for versioning. For the versions available, see the tags on this repository.
