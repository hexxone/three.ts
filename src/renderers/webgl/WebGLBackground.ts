import { CubeTexture, BackSide, BoxGeometry, Camera, cloneUniforms, Color, CubeUVReflectionMapping, FrontSide, Mesh, Object3D, PlaneGeometry, Scene, ShaderLib, ShaderMaterial, WebGLRenderer } from '../../';

import { WebGLCubeMaps } from './WebGLCubeMaps';
import { WebGLObjects } from './WebGLObjects';
import { WebGLRenderList } from './WebGLRenderLists';
import { WebGLState } from './WebGLState';

class WebGLBackground {
	_renderer: WebGLRenderer;
	_cubemaps: WebGLCubeMaps;
	_state: WebGLState;
	_objects: WebGLObjects;
	_premultipliedAlpha: boolean;

	clearColor = new Color( 0x000000 );
	clearAlpha = 0;

	planeMesh: Mesh;
	boxMesh: Mesh;

	currentBackground = null;
	currentBackgroundVersion = 0;
	currentTonemapping = null;

	constructor( renderer: WebGLRenderer, cubemaps: WebGLCubeMaps, state: WebGLState, objects: WebGLObjects, premultipliedAlpha: boolean ) {
		this._renderer = renderer;
		this._cubemaps = cubemaps;
		this._state = state;
		this._objects = objects;
		this._premultipliedAlpha = premultipliedAlpha;
	}

	render( renderList: WebGLRenderList, scene: Object3D | Scene, camera: Camera, forceClear = false ) {
		let background = scene.isScene ? ( scene as Scene ).background : null;

		if ( background && background.isTexture ) {
			background = this._cubemaps.get( background );
		}

		// Ignore background in AR
		// TODO: Reconsider this.

		const xr = this._renderer.xr;
		const session = xr.getSession && xr.getSession();

		if ( session && session.environmentBlendMode === 'additive' ) {
			background = null;
		}

		if ( background === null ) {
			this.setClear( this.clearColor, this.clearAlpha );
		} else if ( background && background.isColor ) {
			this.setClear( background, 1 );
			forceClear = true;
		}

		if ( this._renderer.autoClear || forceClear ) {
			this._renderer.clear( this._renderer.autoClearColor, this._renderer.autoClearDepth, this._renderer.autoClearStencil );
		}

		if ( background && ( background.isCubeTexture || background.isWebGLCubeRenderTarget || background.mapping === CubeUVReflectionMapping ) ) {
			if ( this.boxMesh === undefined ) {
				this.boxMesh = new Mesh(
					new BoxGeometry( 1, 1, 1 ),
					new ShaderMaterial( {
						name: 'BackgroundCubeMaterial',
						uniforms: cloneUniforms( ShaderLib.cube.uniforms ),
						vertexShader: ShaderLib.cube.vertexShader,
						fragmentShader: ShaderLib.cube.fragmentShader,
						side: BackSide,
						depthTest: false,
						depthWrite: false,
						fog: false,
					} ),
				);

				( this.boxMesh.geometry as BoxGeometry ).deleteAttribute( 'normal' );
				( this.boxMesh.geometry as BoxGeometry ).deleteAttribute( 'uv' );

				this.boxMesh.onBeforeRender = function( renderer, scene, camera ) {
					this.matrixWorld.copyPosition( camera.matrixWorld );
				};

				// enable code injection for non-built-in material
				Object.defineProperty( this.boxMesh.material, 'envMap', {

					get: function() {
						return this.uniforms.envMap.value;
					},

				} );

				this._objects.update( this.boxMesh );
			}

			if ( background.isWebGLCubeRenderTarget ) {
				// TODO Deprecate

				background = background.texture as any;
			}

			( this.boxMesh.material as ShaderMaterial ).uniforms.envMap.value = background;
			( this.boxMesh.material as ShaderMaterial ).uniforms.flipEnvMap.value = ( background instanceof CubeTexture && background._needsFlipEnvMap ) ? - 1 : 1;

			if ( this.currentBackground !== background ||
				this.currentBackgroundVersion !== background.version ||
				this.currentTonemapping !== this._renderer.toneMapping ) {
				this.boxMesh.material.needsUpdate = true;

				this.currentBackground = background;
				this.currentBackgroundVersion = background.version;
				this.currentTonemapping = this._renderer.toneMapping;
			}

			// push to the pre-sorted opaque render list
			renderList.unshift( this.boxMesh, this.boxMesh.geometry, this.boxMesh.material, 0, 0, null );
		} else if ( background && background.isTexture ) {
			if ( this.planeMesh === undefined ) {
				this.planeMesh = new Mesh(
					new PlaneGeometry( 2, 2 ),
					new ShaderMaterial( {
						name: 'BackgroundMaterial',
						uniforms: cloneUniforms( ShaderLib.background.uniforms ),
						vertexShader: ShaderLib.background.vertexShader,
						fragmentShader: ShaderLib.background.fragmentShader,
						side: FrontSide,
						depthTest: false,
						depthWrite: false,
						fog: false,
					} ),
				);

				( this.planeMesh.geometry as PlaneGeometry ).deleteAttribute( 'normal' );

				// enable code injection for non-built-in material
				Object.defineProperty( this.planeMesh.material, 'map', {

					get: function() {
						return this.uniforms.t2D.value;
					},

				} );

				this._objects.update( this.planeMesh );
			}

			( this.planeMesh.material as ShaderMaterial ).uniforms.t2D.value = background;

			if ( background.matrixAutoUpdate === true ) {
				background.updateMatrix();
			}

			( this.boxMesh.material as ShaderMaterial ).uniforms.uvTransform.value.copy( background.matrix );

			if ( this.currentBackground !== background ||
				this.currentBackgroundVersion !== background.version ||
				this.currentTonemapping !== this._renderer.toneMapping ) {
				this.planeMesh.material.needsUpdate = true;

				this.currentBackground = background;
				this.currentBackgroundVersion = background.version;
				this.currentTonemapping = this._renderer.toneMapping;
			}


			// push to the pre-sorted opaque render list
			renderList.unshift( this.planeMesh, this.planeMesh.geometry, this.planeMesh.material, 0, 0, null );
		}
	}

	setClear( color: Color, alpha: number ) {
		this._state.colorBuffer.setClear( color.r, color.g, color.b, alpha, this._premultipliedAlpha );
	}

	getClearColor() {
		return this.clearColor;
	}

	setClearColor( color, alpha = 1 ) {
		this.clearColor.set( color );
		this.clearAlpha = alpha;
		this.setClear( this.clearColor, this.clearAlpha );
	}

	getClearAlpha() {
		return this.clearAlpha;
	}

	setClearAlpha( alpha ) {
		this.clearAlpha = alpha;
		this.setClear( this.clearColor, this.clearAlpha );
	}
}


export { WebGLBackground };
