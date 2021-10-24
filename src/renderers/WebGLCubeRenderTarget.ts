import { BackSide, LinearFilter, LinearMipmapLinearFilter, NoBlending, RGBAFormat } from '../constants';
import { Mesh } from '../objects/Mesh';
import { BoxGeometry } from '../geometries/BoxGeometry';
import { ShaderMaterial } from '../materials/ShaderMaterial';
import { cloneUniforms } from './shaders/UniformsUtils';
import { WebGLRenderTarget } from './WebGLRenderTarget';
import { CubeCamera } from '../cameras/CubeCamera';
import { CubeTexture } from '../textures/CubeTexture';

// shader optimization
import vertex from './glsl/CubeRenderTarget.vert.glsl';
import fragment from './glsl/CubeRenderTarget.frag.glsl';


class WebGLCubeRenderTarget extends WebGLRenderTarget {

	constructor(size, options, dummy) {
		if (Number.isInteger(options)) {
			console.warn('THREE.WebGLCubeRenderTarget: constructor signature is now WebGLCubeRenderTarget( size, options )');

			options = dummy;
		}

		options = options || {};

		super(size, size, options);

		Object.defineProperty(this, 'isWebGLCubeRenderTarget', { value: true });

		const cTex = this.texture = new CubeTexture(undefined, options.mapping, options.wrapS, options.wrapT, options.magFilter, options.minFilter, options.format, options.type, options.anisotropy, options.encoding);
		cTex.generateMipmaps = options.generateMipmaps !== undefined ? options.generateMipmaps : false;
		cTex.minFilter = options.minFilter !== undefined ? options.minFilter : LinearFilter;
		cTex._needsFlipEnvMap = false;
	}

	fromEquirectangularTexture(renderer, texture) {
		this.texture.type = texture.type;
		this.texture.format = RGBAFormat; // see #18859
		this.texture.encoding = texture.encoding;

		this.texture.generateMipmaps = texture.generateMipmaps;
		this.texture.minFilter = texture.minFilter;
		this.texture.magFilter = texture.magFilter;

		const shader = {
			uniforms: {
				tEquirect: { value: null },
			},
			vertexShader: vertex,
			fragmentShader: fragment,
		};

		const geometry = new BoxGeometry(5, 5, 5);

		const material = new ShaderMaterial({
			name: 'CubemapFromEquirect',

			uniforms: cloneUniforms(shader.uniforms),
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader,
			side: BackSide,
			blending: NoBlending,

		});

		material.uniforms.tEquirect.value = texture;

		const mesh = new Mesh(geometry, material);

		const currentMinFilter = texture.minFilter;

		// Avoid blurred poles
		if (texture.minFilter === LinearMipmapLinearFilter) texture.minFilter = LinearFilter;

		const camera = new CubeCamera(1, 10, this);
		camera.update(renderer, mesh);

		texture.minFilter = currentMinFilter;

		mesh.geometry.dispose();
		mesh.material.dispose();

		return this;
	}

	clear(renderer, color, depth, stencil) {
		const currentRenderTarget = renderer.getRenderTarget();

		for (let i = 0; i < 6; i++) {
			renderer.setRenderTarget(this, i);

			renderer.clear(color, depth, stencil);
		}

		renderer.setRenderTarget(currentRenderTarget);
	}
}

export { WebGLCubeRenderTarget };
