# three.ts

A full rewrite of [three.js](https://github.com/mrdoob/three.js) in TypeScript.

## TypeScript 3D library

The goal of three.js is to create an easy-to-use, lightweight, cross-browser, general purpose 3D library.

However, when using TypeScript, referencing precompiled ES modules has its drawbacks, such as missing tree shaking and sub-optimal code splitting.

Three.js also takes great care to keep its API backwards compatible, but at the expense of code readability and best practices.

This fork will allow you to quickly customize you dev-experience and deeply integrate with three-internals in a typesafe manner.

Even so, this library is still a work in progress and will also have some issues.

The current version contains only a WebGL renderer.
A WebXR/3D-compatible shader renderer (with alpha support) is available in the '[we_utils](https://github.com/hexxone/we_utils)' EffectComposer.

WebGPU, SVG and CSS3D renderers are only available in the old three.js examples and need to be ported.

## Fork Baseline

This TypeScript fork is currently derived from the `three` package version declared in this repository:

- upstream baseline: `0.133.7`
- practical upstream era: roughly `three.js r133`

The code in this repository is not a clean rebase on current upstream `three.js`.
It is a long-lived fork with local renderer and workflow changes for `we_utils`, custom post-processing, and direct internal TypeScript access.

The original TypeScript conversion and rewrite was done fully manually by me over roughly `100-200` hours of excruciating pain, without AI-assisted code generation.
It has been exercised in real projects such as `audiorbits` and my personal website, both of which use a substantial subset of the fork even though they do not cover every feature.

## Backported And Custom Features

The following newer or project-specific features are present in this vendored fork:

- `WebGLRenderer.compileAsync()` backed by `KHR_parallel_shader_compile`
- `WebGLRenderer.outputColorSpace` alias support
- `Texture.colorSpace` alias support
- project-specific shader alpha and transparency handling work used by `we_utils` and downstream projects
- `Material.alphaHash` support and matching shader chunk handling
- working `WebGLMultipleRenderTargets` attachment setup and draw-buffer binding in the WebGL renderer
- additional XR support paths in the WebGL renderer and related helpers
- additional project-specific renderer integration used by the `we_utils` effect and pass pipeline

These additions were applied selectively and do not imply broad API parity with current upstream `three.js`.

## Known Gaps

This fork still has several known gaps compared to modern upstream `three.js`:

- no proper `reversedDepthBuffer` implementation
- still relies on the older `logarithmicDepthBuffer` path where enabled
- no modern upstream WebGPU renderer port
- no broad audit for recent loader, material, and helper additions from newer upstream releases
- no guarantee that newer upstream examples or docs map directly onto this fork without porting

In practice, "new" upstream features since v133 should be evaluated and ported one-by-one instead of assuming compatibility.

[Examples](https://threejs.org/examples/)
&mdash;
[Documentation](https://threejs.org/docs/)
&mdash;
[Wiki](https://github.com/mrdoob/three.js/wiki)

### Usage

This code creates a scene, a camera, and a geometric cube, and it adds the cube to the scene.
It then creates a `WebGL` renderer for the scene and camera, and it adds that viewport to the `document.body` element.
Finally, it animates the cube within the scene for the camera.

```javascript
import * as THREE from 'path/to/three.ts';

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

### Used by

I am actively using this library in the following repos/projects:

- [we_utils](https://github.com/hexxone/we_utils) - submodule with helpers for shaders etc.
- [audiorbits](https://github.com/hexxone/audiorbits)
- [reactiveink](https://github.com/hexxone/ReactiveInk)

### Cloning this repository

Cloning the repo with all its history results in a >2GB download.

If you don't need the whole history you can use the `depth` parameter to significantly reduce download size.

```sh
git clone --depth=1 https://github.com/hexxone/three.ts.git
```

### Change log

[Original Releases](https://github.com/mrdoob/three.js/releases)
