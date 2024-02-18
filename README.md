# three.ts

a custom fork of [three.js](https://github.com/mrdoob/three.js).

## TypeScript 3D library

The aim of 'three.js' is to create an easy to use, lightweight, cross-browser, general purpose 3D library.

However when using TypeScript, referencing precompiled ES-modules has it's drawbacks, like missing tree-shaking and sub-optimal code-splitting.

Even then, the library is still a work in progress, and there are certainly some issues.

The current version only includes a WebGL renderer.
WebGPU, SVG and CSS3D renderers are available in the 'three.js' examples.
WebXR-compatible Shader renderer is available in 'we_utils' EffectComposer.

[Examples](https://threejs.org/examples/) &mdash;
[Documentation](https://threejs.org/docs/) &mdash;
[Wiki](https://github.com/mrdoob/three.js/wiki) &mdash;

### Usage

This code creates a scene, a camera, and a geometric cube, and it adds the cube to the scene.
It then creates a `WebGL` renderer for the scene and camera, and it adds that viewport to the `document.body` element.
Finally, it animates the cube within the scene for the camera.

```javascript
import * as THREE from "path/to/three.ts";

let camera, scene, renderer;
let geometry, material, mesh;

init();

function init() {
  camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );
  camera.position.z = 1;

  scene = new Scene();

  geometry = new BoxGeometry(0.2, 0.2, 0.2);
  material = new MeshNormalMaterial();

  mesh = new Mesh(geometry, material);
  scene.add(mesh);

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  document.body.appendChild(renderer.domElement);
}

function animation(time) {
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;

  renderer.render(scene, camera);
}
```

If everything went well, you should maybe see something like [this](https://jsfiddle.net/vy29n6aj/).

### Cloning this repository

Cloning the repo with all its history results in a >2GB download.
If you don't need the whole history you can use the `depth` parameter to significantly reduce download size.

```sh
git clone --depth=1 https://github.com/hexxone/three.ts.git
```

### Change log

[Original Releases](https://github.com/mrdoob/three.js/releases)
