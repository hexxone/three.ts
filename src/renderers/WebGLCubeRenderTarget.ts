import {
	BackSide,
	BoxGeometry,
	cloneUniforms,
	CubeCamera,
	CubeTexture,
	LinearFilter,
	LinearMipmapLinearFilter,
	Mesh,
	NoBlending,
	RGBAFormat,
	ShaderMaterial,
	WebGLRenderTarget,
} from "../";

// shader optimization
import vertex from "./glsl/CubeRenderTarget.vert.glsl";
import fragment from "./glsl/CubeRenderTarget.frag.glsl";

class WebGLCubeRenderTarget extends WebGLRenderTarget {
	constructor(size, options?, dummy?) {
		if (Number.isInteger(options)) {
			console.warn(
				"WebGLCubeRenderTarget: constructor signature is now WebGLCubeRenderTarget( size, options )"
			);

			options = dummy;
		}

		options = options || {};

		super(size, size, options);

		this.isWebGLCubeRenderTarget = true;

		const cTex = (this.texture = new CubeTexture(
			undefined,
			options.mapping,
			options.wrapS,
			options.wrapT,
			options.magFilter,
			options.minFilter,
			options.format,
			options.type,
			options.anisotropy,
			options.encoding
		));
		this.texture.isRenderTargetTexture = true;

		cTex.generateMipmaps =
			options.generateMipmaps !== undefined ? options.generateMipmaps : false;
		cTex.minFilter =
			options.minFilter !== undefined ? options.minFilter : LinearFilter;
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

		const material = new ShaderMaterial();
		material.name = "CubemapFromEquirect";
		material.uniforms = cloneUniforms(shader.uniforms);
		material.vertexShader = shader.vertexShader;
		material.fragmentShader = shader.fragmentShader;
		material.side = BackSide;
		material.blending = NoBlending;

		material.uniforms.tEquirect.value = texture;

		const mesh = new Mesh(geometry, material);

		const currentMinFilter = texture.minFilter;

		// Avoid blurred poles
		if (texture.minFilter === LinearMipmapLinearFilter)
			texture.minFilter = LinearFilter;

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
