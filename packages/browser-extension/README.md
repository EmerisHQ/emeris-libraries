# `emeris-extension`

Browser extension to hold keys and sign transactions for Emeris as well as other platforms.

## Depdendencies

The extension uses demeris components. Herefor it pulls the demeris repository. This should happen automatically on `npm install`. If this is not the case please run `git submodule init && git submodule update`.

After adding demeris you need to install it's dependencies:

```
cd demeris
npm i
```

As long as the signer is not published you need to link it locally:

```
cd ../signer
npm link
cd ../browser-extension
npm link @emeris/signer
```

## Develop

```
npm run serve
```

## Build

```
npm run build
```

## Usage

```
const emerisExtension = require('emeris-extension');

// TODO: DEMONSTRATE API
```
