# Abeeway Asset Tracker 3 Package

## Description

The IoT Flow Abeeway Asset Tracker 3 driver implements the specification of JavaScript IoT Flow drivers.

---

## CDN (browser)

```html
<script src="https://cdn.jsdelivr.net/npm/abeeway-asset-tracker-driver-v3@3.2.27/src/index.min.js"></script>
```

---

## To use in JavaScript

### First, install the package:

```bash
npm install abeeway-asset-tracker-driver-v3
```

---

### Import the module

```javascript
var driver = require("abeeway-asset-tracker-driver-v3");
```

---

## Common functions

### Convert a hex string to a byte array

```javascript
function parseHexString(str) {
    var result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }
    return result;
}
```

---

### Decode an uplink

```javascript
var input = {
    bytes: parseHexString(uplinkPayloadString),
    recvTime: "2024-06-10T09:42:13.733+02:00",
    fPort: 18
};
var result = driver.decodeUplink(input);
```

---

### Decode a downlink

```javascript
var input = { bytes: parseHexString(downlinkPayloadString) };
var result = driver.decodeDownlink(input);
```

---

### Encode a downlink

```javascript
var result = driver.encodeDownlink(input).bytes;
```

---

## Build

```bash
cd AT3
npm install
npm run build
```

The build outputs are written to the `/dist` folder:

| File | Format | Intended usage |
| --- | --- | --- |
| `abw-at3-drv.js` | UMD, minified | General-purpose build for CommonJS/Node.js and direct browser script usage |
| `abw-at3-drv-src.js` | UMD, non-minified | Same as above, but easier to inspect and debug |
| `abw-at3-drv.mjs` | ESM, minified | ES module build for `import`-based usage in browsers or modern runtimes |
| `abw-at3-drv-chirpstack.js` | UMD, minified, with ChirpStack global function shim | ChirpStack codec script |

---

## ChirpStack Integration

Upload `dist/abw-at3-drv-chirpstack.js` to ChirpStack:

```txt
Device Profiles → <your profile> → Codec → Custom JavaScript codec functions → paste → Submit
```

The bundle exposes `decodeUplink`, `decodeDownlink` and `encodeDownlink` as global functions required by ChirpStack's JavaScript codec interface.

---

## Test

```bash
cd AT3
node run-test.js
```

---

## Firmware compatibility

| Codec version | AT3 firmware |
| --- | --- |
| 3.2.27 | v1.5 |
| 3.2.26 | v1.5 |
| 3.2.25 | v1.4 |

---

## To update this package

1. Clone this repo: https://github.com/abeeway/abeeway-codec
2. Go to `./AT3`
3. Update the `"version"` in `package.json` (npm will not accept the same version twice)
4. Update the firmware compatibility table above
5. Commit and push, then push a tag:

```bash
git tag at3-vX.Y.Z
git push origin at3-vX.Y.Z
```

The GitHub Actions workflow builds and publishes the package to npmjs automatically.
