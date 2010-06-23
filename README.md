three.js
========

#### Javascript 3D Engine ####

[![Flattr this](http://api.flattr.com/button/button-compact-static-100x17.png)](http://flattr.com/thing/287/three-js)

The aim of this project is to create a 3D engine with a very low level of abstraction (aka for dummies). Currently there is no documentation available but feel free to use the examples as a reference and/or read the source code. However, be aware that the syntax may change from revision to revision breaking compatibility.

The engine can render using &lt;canvas&gt; and &lt;svg&gt; by now and WebGL renderer will be available soon.

[More info...](http://mrdoob.com/blog/post/693)

Other similar projects: [pre3d](http://deanm.github.com/pre3d/), [pvjs](http://code.google.com/p/pvjswebgl/), [jsgl](http://tulrich.com/geekstuff/canvas/perspective.html), [k3d](http://www.kevs3d.co.uk/dev/canvask3d/k3d_test.html), ...

### Examples ###

[![geometry_terrain](http://github.com/mrdoob/three.js/raw/master/assets/examples/06_terrain.png)](http://mrdoob.com/projects/three.js/examples/geometry_terrain.html)
[![materials_video](http://github.com/mrdoob/three.js/raw/master/assets/examples/05_video.png)](http://mrdoob.com/projects/three.js/examples/materials_video.html)
[![geometry_vr](http://github.com/mrdoob/three.js/raw/master/assets/examples/04_vr.png)](http://mrdoob.com/projects/three.js/examples/geometry_vr.html)
[![geometry_cube](http://github.com/mrdoob/three.js/raw/master/assets/examples/03_cube.png)](http://mrdoob.com/projects/three.js/examples/geometry_cube.html)
[![particles_random](http://github.com/mrdoob/three.js/raw/master/assets/examples/02_random.png)](http://mrdoob.com/projects/three.js/examples/particles_random.html)
[![particles_wave](http://github.com/mrdoob/three.js/raw/master/assets/examples/01_waves.png)](http://mrdoob.com/projects/three.js/examples/particles_waves.html)
[![particles_floor](http://github.com/mrdoob/three.js/raw/master/assets/examples/00_floor.png)](http://mrdoob.com/projects/three.js/examples/particles_floor.html)

[![Space Cannon 3D](http://github.com/mrdoob/three.js/raw/master/assets/projects/02_spacecannon.png)](http://labs.brian-stoner.com/spacecannon/)
[![Alocasia](http://github.com/mrdoob/three.js/raw/master/assets/projects/04_alocasia.png)](http://arithmetric.com/projects/alocasia/)
[![DDD](http://github.com/mrdoob/three.js/raw/master/assets/projects/01_ddd.png)](http://the389.com/works/three/)
[![jsflowfield4d](http://github.com/mrdoob/three.js/raw/master/assets/projects/00_jsflowfield4d.png)](http://test.sjeiti.com/jsflowfield4d/)
[![spikeball](http://github.com/mrdoob/three.js/raw/master/assets/projects/03_spikeball.png)](http://kile.stravaganza.org/lab/js/spikeball/)

### Usage ###

The library needs to be included first thing.

	<script type="text/javascript" src="js/three.js"></script>

This code creates a camera, then creates a scene object, adds a bunch of random particles in it, creates a &lt;canvas&gt; renderer and adds its viewport in the document.body element.

	<script type="text/javascript">

		var camera, scene, renderer;

		init();
		setInterval( loop, 1000 / 60 );

		function init() {

			camera = new THREE.Camera( 75, window.innerWidth / window.innerHeight, 0.0001, 10000 );
			camera.position.z = 1000;

			scene = new THREE.Scene();

			for (var i = 0; i < 1000; i++) {

				var particle = new THREE.Particle( new THREE.ColorFillMaterial( Math.random() * 0x808008 + 0x808080, 1 ) );
				particle.size = Math.random() * 10 + 5;
				particle.position.x = Math.random() * 2000 - 1000;
				particle.position.y = Math.random() * 2000 - 1000;
				particle.position.z = Math.random() * 2000 - 1000;
				scene.add( particle );

			}

			renderer = new THREE.CanvasRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );

			document.body.appendChild( renderer.domElement );

		}

		function loop() {

			renderer.render( scene, camera );

		}

	</script>

For creating a customised version of the library, including the source files in this order would be a good way to start:

	<script type="text/javascript" src="js/three/Three.js"></script>
	<script type="text/javascript" src="js/three/core/Color.js"></script>
	<script type="text/javascript" src="js/three/core/Vector2.js"></script>
	<script type="text/javascript" src="js/three/core/Vector3.js"></script>
	<script type="text/javascript" src="js/three/core/Vector4.js"></script>
	<script type="text/javascript" src="js/three/core/Rectangle.js"></script>
	<script type="text/javascript" src="js/three/core/Matrix4.js"></script>
	<script type="text/javascript" src="js/three/core/Vertex.js"></script>
	<script type="text/javascript" src="js/three/core/Face3.js"></script>
	<script type="text/javascript" src="js/three/core/Face4.js"></script>
	<script type="text/javascript" src="js/three/core/Geometry.js"></script>
	<script type="text/javascript" src="js/three/cameras/Camera.js"></script>
	<script type="text/javascript" src="js/three/objects/Object3D.js"></script>
	<script type="text/javascript" src="js/three/objects/Mesh.js"></script>
	<script type="text/javascript" src="js/three/objects/Particle.js"></script>
	<script type="text/javascript" src="js/three/objects/Line.js"></script>
	<script type="text/javascript" src="js/three/materials/BitmapUVMappingMaterial.js"></script>
	<script type="text/javascript" src="js/three/materials/ColorFillMaterial.js"></script>
	<script type="text/javascript" src="js/three/materials/ColorStrokeMaterial.js"></script>
	<script type="text/javascript" src="js/three/materials/FaceColorFillMaterial.js"></script>
	<script type="text/javascript" src="js/three/materials/FaceColorStrokeMaterial.js"></script>
	<script type="text/javascript" src="js/three/scenes/Scene.js"></script>
	<script type="text/javascript" src="js/three/renderers/Renderer.js"></script>
	<script type="text/javascript" src="js/three/renderers/CanvasRenderer.js"></script>
	<script type="text/javascript" src="js/three/renderers/SVGRenderer.js"></script>
	<script type="text/javascript" src="js/three/renderers/renderables/RenderableFace3.js"></script>
	<script type="text/javascript" src="js/three/renderers/renderables/RenderableFace4.js"></script>
	<script type="text/javascript" src="js/three/renderers/renderables/RenderableParticle.js"></script>
	<script type="text/javascript" src="js/three/renderers/renderables/RenderableLine.js"></script>


### Change Log ###

2010 06 22 - **r10** (23.959 kb)

* Changed Camera system. (Thx [Paul Brunt](http://github.com/supereggbert))
* Object3D.overdraw = true to enable CanvasRenderer screen space point expansion hack.


2010 06 20 - **r9** (23.753 kb)

* JSLinted.
* autoClear property for renderers.
* Removed SVG rgba() workaround for WebKit. (WebKit now supports it)
* Fixed matrix bug. (transformed objects outside the x axis would get infinitely tall :S)


2010 06 06 - **r8** (23.496 kb)

* Moved UVs to Geometry.
* CanvasRenderer expands screen space points (workaround for antialias gaps).
* CanvasRenderer supports BitmapUVMappingMaterial.


2010 06 05 - **r7** (22.387 kb)

* Added Line Object.
* Workaround for WebKit not supporting rgba() in SVG yet.
* No need to call updateMatrix(). Use .autoUpdateMatrix = false if needed. (Thx [Gregory Athons](http://github.com/gregmax17)).


2010 05 17 - **r6** (21.003 kb)

* 2d clipping on CanvasRenderer and SVGRenderer
* clearRect optimisations on CanvasRenderer


2010 05 16 - **r5** (19.026 kb)

* Removed Class.js dependency
* Added THREE namespace
* Camera.x -> Camera.position.x
* Camera.target.x -> Camera.target.position.x
* ColorMaterial -> ColorFillMaterial
* FaceColorMaterial -> FaceColorFillMaterial
* Materials are now multipass (use array)
* Added ColorStrokeMaterial and FaceColorStrokeMaterial
* geometry.faces.a are now indexes instead of links 


2010 04 26 - **r4** (16.274 kb)

* SVGRenderer Particle rendering
* CanvasRenderer uses context.setTransform to avoid extra calculations


2010 04 24 - **r3** (16.392 kb)

* Fixed incorrect rotation matrix transforms
* Added Plane and Cube primitives


2010 04 24 - **r2** (15.724 kb)

* Improved Color handling


2010 04 24 - **r1** (15.25 kb)

* First alpha release
